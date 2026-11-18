"use strict";
const assert = require("node:assert/strict");
const reports = require("../reports.js");

assert.deepEqual(reports.grades([]), []);
assert.deepEqual(
  reports.grades([{ accuracy: 0 }]).map((r) => [r.rank, r.percentile, r.grade]),
  [[1, 0, "A"]],
);
assert.deepEqual(
  reports
    .grades([{ accuracy: 50 }, { accuracy: 90 }])
    .map((r) => [r.rank, r.grade]),
  [
    [1, "C"],
    [2, "D"],
  ],
);
assert.deepEqual(
  reports
    .grades([{ accuracy: 50 }, { accuracy: 50 }])
    .map((r) => [r.rank, r.grade]),
  [
    [1, "C"],
    [1, "C"],
  ],
);
const boundaries = reports.grades(
  Array.from({ length: 10 }, (_, i) => ({ accuracy: 100 - i })),
);
assert.deepEqual(
  boundaries.map((r) => r.grade),
  ["A", "A", "B", "B", "C", "C", "C", "D", "D", "D"],
);
assert.deepEqual(
  boundaries
    .filter((r) => [20, 40, 70].includes(r.percentile))
    .map((r) => r.grade),
  ["A", "B", "C"],
);
const tied = reports.grades(
  [100, 90, 90, 80, 70, 60, 50, 40, 30, 20].map((accuracy) => ({ accuracy })),
);
assert.deepEqual(
  tied.slice(0, 4).map((r) => [r.rank, r.grade]),
  [
    [1, "A"],
    [2, "A"],
    [2, "A"],
    [4, "B"],
  ],
);
assert.ok(
  reports
    .grades(Array.from({ length: 10 }, () => ({ accuracy: 50 })))
    .every((r) => r.rank === 1 && r.grade === "A"),
);
assert.deepEqual(
  reports.grades([
    null,
    undefined,
    {},
    { accuracy: NaN },
    { accuracy: Infinity },
    { accuracy: -1 },
    { accuracy: 101 },
    { accuracy: "90" },
    { accuracy: null },
  ]),
  [],
);
const input = [
  { accuracy: 20, name: "low" },
  { accuracy: 90, name: "high" },
];
const original = structuredClone(input);
assert.deepEqual(reports.grades(reports.grades(input)), reports.grades(input));
assert.deepEqual(input, original);

// Verify rankings independently for many cohort sizes, including ties.
for (let n = 1; n <= 30; n++) {
  const rows = Array.from({ length: n }, (_, i) => ({
    accuracy: ((i * 13) % 7) * 10,
  }));
  const actual = reports.grades(rows);
  for (const row of actual) {
    const rank =
      1 +
      rows.reduce(
        (count, other) => count + (other.accuracy > row.accuracy ? 1 : 0),
        0,
      );
    assert.equal(row.rank, rank);
    assert.equal(row.percentile, n === 1 ? 0 : (rank / n) * 100);
  }
}

// Explicit synthetic imports, never written into real teacher-imports.
const attempt = (id, correct, total, completedAt, extra = {}) => ({
  id,
  studentId: id,
  name: "FIXTURE ONLY",
  correct,
  total,
  score: correct * 10,
  mode: "fixture",
  date: "2026-10-29",
  completedAt,
  completed: true,
  ...extra,
});
const records = [
  attempt("a", 2, 10, "2026-10-29T01:00:00Z"),
  attempt("a-new", 9, 10, "2026-10-29T02:00:00Z", { studentId: "a" }),
  attempt("unfinished", 0, 10, "2026-10-29T03:00:00Z", {
    studentId: "a",
    completed: false,
  }),
  attempt("b", 18, 20, "2026-10-29T02:00:00Z"),
  attempt("c", 5, 10, "2026-10-29T02:00:00Z"),
  attempt("d", 1, 10, "2026-10-29T02:00:00Z", { correct: undefined }),
];
const data = reports.aggregate([
  { name: "EXPLICIT TEST FIXTURE", data: { records } },
]);
assert.deepEqual(
  data.rows.map((r) => [r.studentId, r.rank, r.grade]),
  [
    ["a", 1, "B"],
    ["b", 1, "B"],
    ["c", 3, "D"],
    ["d", null, "미수집"],
  ],
);
assert.equal(data.rows[0].id, "a-new");
assert.equal(data.rows[1].accuracy, 90);
assert.deepEqual(
  reports.aggregate([{ name: "EXPLICIT TEST FIXTURE", data: { records } }]),
  data,
);
const html = reports.html(data),
  csv = reports.csv(data);
assert.ok(
  html.includes(
    "<td>a</td><td>FIXTURE ONLY</td><td>1</td><td>90</td><td>10</td><td>9</td><td>90.00</td>",
  ),
);
assert.ok(html.includes("<td>B</td>"));
assert.ok(
  csv.includes(
    '"a","FIXTURE ONLY","1","90","10","9","90.00","fixture","2026-10-29T02:00:00Z","B"',
  ),
);
console.log(
  "PASS: empty/single/small cohorts, all ties, boundary ties, 20/40/70, invalid rates, immutable/repeatable ranking",
);
console.log(
  "PASS: latest completed imports, normalized rates, missing rates, HTML/CSV grade agreement",
);
const english = reports.html(data, "en");
assert.match(english, /<html lang="en">/);
assert.match(english, /<h1>Learning at a glance\.<\/h1>/);
assert.ok(reports.csv(data, "en").includes('"Student ID","Name","Rank"'));
assert.ok(reports.csv(data, "en").includes("Not recorded"));
console.log(
  "PASS: English report and CSV preserve data with translated labels",
);
const weighted = reports.aggregate([
  {
    name: "synthetic.json",
    data: {
      records: [
        attempt("long", 9, 10, "2026-11-18T10:00:00Z"),
        attempt("short", 1, 1, "2026-11-18T11:00:00Z"),
      ],
    },
  },
]);
assert.ok(
  Math.abs(weighted.averageAccuracy - 90.9090909090909) < 1e-10,
  "report accuracy must weight questions consistently with the learner dashboard",
);
