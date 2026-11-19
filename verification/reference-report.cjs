"use strict";

const { readFileSync } = require("node:fs");
const reports = require("../reports.js");

function reportRequest(request) {
  switch (request.op) {
    case "report-grades":
      return reports.grades(request.rows || []);
    case "report-aggregate":
      return reports.aggregate(request.files || []);
    case "report-csv":
      return reports.csv(request.data ?? reports.aggregate(request.files || []), request.lang);
    default:
      throw Error(`unknown report operation ${JSON.stringify(request.op)}`);
  }
}

if (require.main === module) {
  try {
    const request = JSON.parse(readFileSync(process.argv[2] || 0, "utf8"));
    console.log(JSON.stringify({ ok: true, result: reportRequest(request) }));
  } catch (error) {
    console.log(JSON.stringify({ ok: false, error: error.message }));
  }
}

module.exports = { reportRequest };
