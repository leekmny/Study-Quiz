const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const output = path.join(root, "dist");
const files = [
  "index.html",
  "style.css",
  "questions.js",
  "questions-en.js",
  "local-data.js",
  "reports.js",
  "i18n.js",
  "script.js",
  "account-ui.js",
  "assets/favicon.svg",
];

function build() {
  // Always construct a fresh directory so old exports cannot enter a deployment.
  if (path.dirname(output) !== root || path.basename(output) !== "dist")
    throw Error("Invalid build directory");
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
  for (const file of files) {
    const target = path.join(output, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(root, file), target);
  }
  const reports = require("../reports.js");
  fs.writeFileSync(
    path.join(output, "teacher_report.html"),
    reports.html(reports.aggregate([]), "ko"),
  );
  console.log(
    "Built public app in dist/ (no saved records or imported reports).",
  );
  return output;
}
module.exports = build;
if (require.main === module) build();
