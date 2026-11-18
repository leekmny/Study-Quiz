const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const result = spawnSync(
  process.execPath,
  [path.join(__dirname, "build.cjs")],
  { encoding: "utf8" },
);
assert.equal(result.status, 0, result.stderr);
const dist = path.join(root, "dist");
const files = fs
  .readdirSync(dist, { recursive: true })
  .filter((f) => fs.statSync(path.join(dist, f)).isFile());
assert.ok(files.includes("index.html"));
assert.ok(files.includes("questions-en.js"));
assert.ok(
  files.includes("assets/favicon.svg") || files.includes("assets\\favicon.svg"),
);
assert.equal(
  files.some((f) => /records|summary|\.env|test|readme|package|\.git/i.test(f)),
  false,
  "Deploy contains only public app files",
);
for (const name of ["index.html", "teacher_report.html"]) {
  const html = fs.readFileSync(path.join(dist, name), "utf8");
  assert.doesNotMatch(html, /C:\\Users\\|@gmail\.com|@naver\.com/i);
  for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    if (!/^(https?:|data:)/.test(match[1]))
      assert.ok(
        fs.existsSync(path.join(dist, match[1])),
        `Missing asset ${match[1]}`,
      );
  }
}
console.log(
  "PASS: public build excludes private data and has complete local assets",
);
