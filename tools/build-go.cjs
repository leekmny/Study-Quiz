"use strict";

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const output = require("./build.cjs")("dist-go");
const wasmFile = path.join(output, "study-quiz.wasm");
const supportFile = path.join(output, "wasm_exec.js");

function run(program, args, options = {}) {
  const result = spawnSync(program, args, { cwd: root, stdio: "inherit", ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${program} exited with code ${result.status}`);
  return result.stdout?.trim();
}

if (spawnSync("go", ["version"], { stdio: "ignore" }).status === 0) {
  const goRoot = run("go", ["env", "GOROOT"], { stdio: ["ignore", "pipe", "inherit"], encoding: "utf8" });
  fs.copyFileSync(path.join(goRoot, "lib", "wasm", "wasm_exec.js"), supportFile);
  fs.copyFileSync(path.join(goRoot, "LICENSE"), path.join(output, "GO-LICENSE.txt"));
  run("go", ["build", "-trimpath", "-o", wasmFile, "./cmd/studyquiz"], {
    env: { ...process.env, GOOS: "js", GOARCH: "wasm", CGO_ENABLED: "0" },
  });
} else {
  run("docker", [
    "run", "--rm", "--platform", "linux/amd64", "--network", "none",
    "--mount", `type=bind,source=${root},target=/workspace`,
    "--workdir", "/workspace",
    "golang:1.27.4-bookworm",
    "sh", "-ec",
    'root=$(go env GOROOT); cp "$root/lib/wasm/wasm_exec.js" dist-go/wasm_exec.js; cp "$root/LICENSE" dist-go/GO-LICENSE.txt; GOOS=js GOARCH=wasm CGO_ENABLED=0 go build -trimpath -o dist-go/study-quiz.wasm ./cmd/studyquiz',
  ]);
}

const base64 = fs.readFileSync(wasmFile).toString("base64");
fs.writeFileSync(path.join(output, "go-port.js"), `"use strict";
globalThis.studyQuizGoReady = (async () => {
  const runtime = new Go();
  const binary = Uint8Array.from(atob("${base64}"), (char) => char.charCodeAt(0));
  const { instance } = await WebAssembly.instantiate(binary, runtime.importObject);
  const running = runtime.run(instance);
  running.catch((error) => console.error("QUIZ LAB Go runtime failed", error));
  if (typeof globalThis.studyQuizGo !== "function") {
    throw new Error("QUIZ LAB Go engine did not register");
  }
})().then(() => ({ ready: true }), (error) => ({ ready: false, error }));
`);
fs.unlinkSync(wasmFile);

const index = path.join(output, "index.html");
const bootstrap = '    <script src="script.js"></script>';
const html = fs.readFileSync(index, "utf8");
if (!html.includes(bootstrap)) throw new Error("QUIZ LAB bootstrap was not found");
fs.writeFileSync(index, html.replace(bootstrap,
  '    <script src="wasm_exec.js"></script>\n    <script src="go-port.js"></script>\n' + bootstrap));
console.log("Go build is ready at dist-go/index.html (offline, no web server required).");
