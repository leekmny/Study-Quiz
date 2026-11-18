"use strict";
const assert = require("node:assert/strict");
const { LocalDataManager, validRecord } = require("../local-data.js");
const storage = () => {
  const values = new Map();
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
};
const record = (id, extra = {}) => ({
  id,
  studentId: "learner",
  name: "Learner",
  score: 10,
  correct: 1,
  total: 1,
  mode: "all",
  date: "2026-11-18",
  completed: true,
  completedAt: "2026-11-18T10:00:00Z",
  ...extra,
});
const memory = storage(),
  manager = new LocalDataManager(memory);
manager.save(record("short"));
manager.save(record("long", { score: 0, correct: 0, total: 9 }));
assert.equal(
  manager.stats().averageAccuracy,
  10,
  "accuracy must weight questions rather than sessions",
);
manager.importData({
  profile: {
    id: "learner",
    name: "Learner",
    avatar: "🌱",
    email: "private@example.invalid",
  },
  records: [record("private", { secret: "do not export" })],
});
assert.equal(manager.exportData().profile.email, undefined);
assert.equal(
  manager.exportData().records.find((r) => r.id === "private").secret,
  undefined,
);
assert.equal(validRecord(record("bad", { missedIds: [-1, "4"] })), false);
manager.save(
  record("wrong", {
    correct: 0,
    score: 0,
    answers: [{ questionId: 3, correct: false }],
    completedAt: "2026-11-18T11:00:00Z",
  }),
);
assert.deepEqual(manager.missedQuestionIds(), [3]);
manager.save(
  record("fixed", {
    answers: [{ questionId: 3, correct: true }],
    completedAt: "2026-11-18T12:00:00Z",
  }),
);
assert.deepEqual(manager.missedQuestionIds(), []);
const before = manager.exportData();
assert.throws(() =>
  manager.importData({
    profile: { id: "someone-else", name: "Other" },
    records: [],
  }),
);
assert.deepEqual(manager.exportData().records, before.records);
assert.equal(manager.profile().id, "learner");
assert.throws(
  () =>
    manager.importData({
      profile: { id: "learner", name: "Learner" },
      records: [record("foreign", { studentId: "someone-else" })],
    }),
  /학생|profile/i,
);
const rollbackStorage = storage();
const rollbackManager = new LocalDataManager(rollbackStorage);
const write = rollbackStorage.setItem;
rollbackStorage.setItem = (key, value) => {
  if (key === "quizlab-records") throw Error("full");
  write(key, value);
};
assert.throws(
  () =>
    rollbackManager.importData({
      profile: { id: "new", name: "New" },
      records: [record("new", { studentId: "new" })],
    }),
  /full/,
);
assert.equal(
  rollbackStorage.getItem("quizlab-profile"),
  null,
  "failed import must not change profile",
);
const recentManager = new LocalDataManager(storage());
for (let i = 0; i < 101; i++)
  recentManager.save(
    record("recent-" + i, {
      score: i === 100 ? 0 : 10,
      correct: i === 100 ? 0 : 1,
      completedAt: new Date(Date.UTC(2026, 0, 1, 0, i)).toISOString(),
    }),
  );
assert.equal(recentManager.records().length, 100);
assert.ok(
  recentManager.records().some((r) => r.id === "recent-100"),
  "a new low score must remain in history",
);
assert.ok(!recentManager.records().some((r) => r.id === "recent-0"));
console.log(
  "PASS: weighted accuracy, export field allowlist, review mastery, profile protection",
);
