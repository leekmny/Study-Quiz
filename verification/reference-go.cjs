"use strict";

const fs = require("node:fs");
const { run: quizRequest } = require("../tools/reference-quiz.cjs");
const { reportRequest } = require("./reference-report.cjs");
const { LocalDataManager, normalize, validRecord } = require("../local-data.js");

function requestResult(request) {
  if (request.op === "quiz") return quizRequest(request);
  if (request.op.startsWith("report-")) return reportRequest(request);
  switch (request.op) {
    case "records-valid":
      return validRecord(request.record);
    case "records-normalize":
      return normalize(request.records);
    case "records-summary": {
      const storage = new Map([["quizlab-records", JSON.stringify(request.records)]]);
      const manager = new LocalDataManager({
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
      });
      return { ...manager.stats(), missedIds: manager.missedQuestionIds() };
    }
    default:
      throw Error(`unknown operation ${JSON.stringify(request.op)}`);
  }
}

try {
  const input = process.argv[2];
  const request = JSON.parse(fs.readFileSync(input && input !== "-" ? input : 0, "utf8"));
  console.log(JSON.stringify({ ok: true, result: requestResult(request) }));
} catch (error) {
  console.log(JSON.stringify({ ok: false, error: error.message }));
}
