"""Verify the native Go port against the original Quiz Lab JavaScript in RECHECK."""

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path
from tempfile import TemporaryDirectory


ROOT = Path(__file__).resolve().parents[1]
UPSTREAM = "ce88328beff36b2a5f3273051397a22029aa8995"
SOURCE_FILES = ("questions.js", "questions-en.js", "local-data.js", "i18n.js", "script.js", "reports.js")
ENTRY = "verification/reference-go.cjs"
ADAPTERS = (ENTRY, "verification/reference-report.cjs", "tools/reference-quiz.cjs")
GROUPS = ("gameplay", "records", "teacher-report")
PLATFORM = {"os": "linux", "arch": "x64"}


def write_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def stage(output, candidate, image):
    source = output / "input"
    reference = source / "reference"
    reference.mkdir(parents=True)
    for name in SOURCE_FILES:
        content = subprocess.check_output(["git", "show", f"{UPSTREAM}:{name}"], cwd=ROOT)
        (reference / name).write_bytes(content)
    for name in ADAPTERS:
        (reference / name).parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(ROOT / name, reference / name)

    candidate_name = "candidate/studyquiz"
    (source / candidate_name).parent.mkdir()
    shutil.copyfile(candidate, source / candidate_name)

    (source / "fixtures").mkdir()
    scenarios = []
    for group in GROUPS:
        group_path = ROOT / "verification" / group
        for case in json.loads((group_path / "cases.json").read_text(encoding="utf-8")):
            name = f"fixtures/{case['id']}.json"
            shutil.copyfile(group_path / case["fixture"], source / name)
            expected = {"exit_code": 0, "stderr": ""}
            if "expected" in case:
                expected["stdout"] = (group_path / case["expected"]).read_text(encoding="utf-8")
            scenarios.append({
                "id": case["id"],
                "kind": "console",
                "input": {"args": [name]},
                "fixtures": [name],
                "policy": {"stdout": "json", "stderr": "bytes"},
                "expected": {"reference": expected, "candidate": expected},
            })

    image_info = subprocess.check_output(
        ["docker", "image", "inspect", image, "--format", "{{.Id}} {{.Os}} {{.Architecture}}"],
        text=True,
    ).split()
    if len(image_info) != 3 or image_info[1:] != ["linux", "amd64"]:
        raise ValueError("The RECHECK worker image must target Linux amd64.")

    manifest = source / "manifest.json"
    worker = source / "worker.json"
    write_json(manifest, {
        "schema_version": "recheck-porting-1",
        "description": f"Study-Quiz Go compared with upstream {UPSTREAM}",
        "targets": {
            "reference": {
                **PLATFORM, "runtime": "node", "language": "javascript", "entry": f"reference/{ENTRY}",
                "files": [f"reference/{name}" for name in (*SOURCE_FILES, *ADAPTERS[1:])],
            },
            "candidate": {
                **PLATFORM, "runtime": "native", "language": "go", "entry": candidate_name,
            },
        },
        "structure": {"enabled": False},
        "concurrency": 3,
        "scenarios": scenarios,
    })
    write_json(worker, {"workers": {"default": {**PLATFORM, "kind": "docker", "image": image_info[0]}}})
    return manifest, worker


def run(checkout, manifest, worker, output):
    venv = ".venv/Scripts/python.exe" if sys.platform == "win32" else ".venv/bin/python"
    python = checkout / venv
    interpreter = str(python) if python.is_file() else sys.executable
    result_path = output / "result.json"
    with TemporaryDirectory(prefix="quiz-recheck-") as temporary:
        temp = Path(temporary)
        common = [
            interpreter, "-m", "recheck", "--data-dir", str(temp / "data"),
            "--settings-dir", str(temp / "settings"),
        ]
        subprocess.run([
            *common, "--json-output", str(result_path), "porting-run",
            str(manifest), "--worker", str(worker),
        ], cwd=checkout, stdout=subprocess.DEVNULL, check=True)
        result = json.loads(result_path.read_text(encoding="utf-8"))
        run_id = result["run_id"]
        subprocess.run([*common, "report", run_id], cwd=checkout, stdout=subprocess.DEVNULL, check=True)
        shutil.copyfile(temp / "data" / "runs" / run_id / "report.html", output / "report.html")
    return summarize(result_path)


def summarize(result_path):
    raw = result_path.read_bytes()
    result = json.loads(raw)
    observations = next((
        attempt["observations"]
        for row in result["scenarios"]
        for attempt in row["attempts"]
        if all(attempt["observations"].get(side, {}).get("entry_sha256") for side in ("reference", "candidate"))
    ), {})
    environment = observations.get("reference", {}).get("environment", {})
    targets = {}
    for name, observation in observations.items():
        targets[name] = {"entry_sha256": observation["entry_sha256"]}
        if version := observation.get("runtime", {}).get("version"):
            targets[name]["runtime_version"] = version
    return {
        "schema_version": "study-quiz-recheck-summary-1",
        "upstream_commit": UPSTREAM,
        "run_id": result["run_id"],
        "manifest_sha256": result["manifest_sha256"],
        "result_sha256": hashlib.sha256(raw).hexdigest(),
        "worker": {
            field: environment[field]
            for field in ("os", "arch", "isolation", "emulated", "image_id", "worker_code_sha256")
            if field in environment
        },
        "targets": targets,
        "behavior": result["behavior"],
        "scenarios": [
            {field: row[field] for field in ("id", "outcome", "acceptance")}
            for row in result["scenarios"]
        ],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--recheck", type=Path, required=True, help="RECHECK source checkout")
    parser.add_argument("--candidate", type=Path, required=True, help="Go CLI built for Linux amd64")
    parser.add_argument("--image", required=True, help="Local RECHECK Linux amd64 Docker image")
    parser.add_argument("--output", type=Path, required=True, help="New directory for reports and staged inputs")
    args = parser.parse_args()
    try:
        checkout = args.recheck.resolve(strict=True)
        candidate = args.candidate.resolve(strict=True)
        output = args.output.resolve()
        output.mkdir(parents=True, exist_ok=False)
        manifest, worker = stage(output, candidate, args.image)
        summary = run(checkout, manifest, worker, output)
    except (OSError, ValueError, KeyError, subprocess.CalledProcessError) as error:
        print(error, file=sys.stderr)
        return 2
    write_json(output / "summary.json", summary)
    behavior = summary["behavior"]
    print(f"{summary['run_id']}  {behavior['matched']}/{behavior['registered']} matched  {behavior['acceptance']}")
    return int(behavior["matched"] != behavior["registered"] or behavior["acceptance"] != "passed")


if __name__ == "__main__":
    sys.exit(main())
