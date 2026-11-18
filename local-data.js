(function (root) {
  "use strict";
  const validProfile = (p) =>
    p &&
    typeof p.id === "string" &&
    p.id.length > 0 &&
    typeof p.name === "string";
  const validRecord = (r) => {
    const validIds = (a) =>
      Array.isArray(a) && a.every((id) => Number.isInteger(id) && id > 0);
    return Boolean(
      r &&
      typeof r.mode === "string" &&
      typeof r.date === "string" &&
      (r.studentId == null || typeof r.studentId === "string") &&
      (r.id == null || typeof r.id === "string") &&
      (r.name == null || typeof r.name === "string") &&
      Number.isInteger(r.total) &&
      r.total > 0 &&
      Number.isFinite(r.score) &&
      r.score >= 0 &&
      r.score <= r.total * 10 &&
      (r.correct == null ||
        (Number.isInteger(r.correct) &&
          r.correct >= 0 &&
          r.correct <= r.total)) &&
      (r.missedIds == null || validIds(r.missedIds)) &&
      (r.questionIds == null || validIds(r.questionIds)) &&
      (r.answers == null ||
        (Array.isArray(r.answers) &&
          r.answers.every(
            (a) =>
              a &&
              Number.isInteger(a.questionId) &&
              a.questionId > 0 &&
              typeof a.correct === "boolean",
          ))),
    );
  };
  const profileFields = (p) => ({
    id: p.id,
    name: p.name.slice(0, 50),
    avatar: ["🌱", "🦊", "🐱", "🐻"].includes(p.avatar) ? p.avatar : "🌱",
  });
  const recordFields = (r) => {
    const out = {};
    for (const key of [
      "id",
      "studentId",
      "name",
      "score",
      "total",
      "correct",
      "completed",
      "completedAt",
      "mode",
      "modeKey",
      "date",
    ])
      if (r[key] != null) out[key] = r[key];
    if (r.categories && typeof r.categories === "object") {
      out.categories = Object.create(null);
      for (const [key, c] of Object.entries(r.categories))
        if (
          c &&
          Number.isInteger(c.correct) &&
          Number.isInteger(c.total) &&
          c.total > 0 &&
          c.correct >= 0 &&
          c.correct <= c.total
        )
          out.categories[key] = { correct: c.correct, total: c.total };
    }
    for (const key of ["missedIds", "questionIds"])
      if (r[key]) out[key] = [...r[key]];
    if (r.answers)
      out.answers = r.answers.map((a) => ({
        questionId: a.questionId,
        correct: a.correct,
      }));
    return out;
  };
  function normalize(records) {
    const seen = new Set();
    return (Array.isArray(records) ? records : [])
      .filter(validRecord)
      .filter((r) => {
        const key =
          r.id ||
          JSON.stringify([r.studentId || "", r.mode, r.date, r.score, r.total]);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map(recordFields);
  }
  const order = (a, b) =>
    b.score / b.total - a.score / a.total || b.score - a.score;
  const chronological = (a, b) =>
    (Date.parse(a.completedAt || a.date) || 0) -
    (Date.parse(b.completedAt || b.date) || 0);
  class LocalDataManager {
    constructor(storage) {
      this.storage = storage;
      this.error = "";
    }
    read(key, fallback) {
      try {
        return JSON.parse(this.storage.getItem(key) || "null") ?? fallback;
      } catch {
        this.error = "저장된 데이터를 읽을 수 없습니다. 원본은 유지됩니다.";
        return fallback;
      }
    }
    write(key, value) {
      this.storage.setItem(key, JSON.stringify(value));
    }
    records() {
      return normalize(this.read("quizlab-records", []))
        .sort(chronological)
        .slice(-100)
        .sort(order);
    }
    top(n = 5) {
      return this.records().slice(0, n);
    }
    profile() {
      const p = this.read("quizlab-profile", null);
      return validProfile(p)
        ? profileFields(p)
        : { id: "", name: "정보 없음", avatar: "🌱" };
    }
    saveProfile(name, avatar) {
      const old = this.profile();
      const p = {
        id:
          old.id ||
          "student-" + Date.now() + "-" + Math.random().toString(36).slice(2),
        name: String(name).trim().slice(0, 50) || "학습자",
        avatar: ["🌱", "🦊", "🐱", "🐻"].includes(avatar) ? avatar : "🌱",
      };
      this.write("quizlab-profile", p);
      return p;
    }
    save(record) {
      if (!validRecord(record)) throw Error("잘못된 응시 기록");
      const raw = this.storage.getItem("quizlab-records");
      if (raw && !this.storage.getItem("quizlab-records-before-v2"))
        this.storage.setItem("quizlab-records-before-v2", raw);
      if (raw) {
        try {
          if (!Array.isArray(JSON.parse(raw))) throw Error();
        } catch {
          this.storage.setItem("quizlab-records-recovery-" + Date.now(), raw);
        }
      }
      this.write(
        "quizlab-records",
        normalize([...normalize(this.read("quizlab-records", [])), record])
          .sort(chronological)
          .slice(-100),
      );
    }
    stats() {
      const a = this.records();
      const known = a.filter((r) => r.correct != null);
      return {
        attempts: a.length,
        best: a.length ? Math.max(...a.map((r) => r.score)) : null,
        averageAccuracy: known.length
          ? (known.reduce((s, r) => s + r.correct, 0) /
              known.reduce((s, r) => s + r.total, 0)) *
            100
          : null,
      };
    }
    missedQuestionIds() {
      const missed = new Set();
      const chronological = this.records().sort(
        (a, b) =>
          (Date.parse(a.completedAt || a.date) || 0) -
          (Date.parse(b.completedAt || b.date) || 0),
      );
      for (const r of chronological) {
        if (r.answers)
          for (const answer of r.answers) {
            if (answer.correct) missed.delete(answer.questionId);
            else missed.add(answer.questionId);
          }
        else {
          for (const id of r.questionIds || [])
            if (!(r.missedIds || []).includes(id)) missed.delete(id);
          for (const id of r.missedIds || []) missed.add(id);
        }
      }
      return [...missed];
    }
    exportData() {
      return {
        schemaVersion: 2,
        exportedAt: new Date().toISOString(),
        profile: this.profile(),
        records: this.records(),
      };
    }
    importData(data) {
      if (
        !data ||
        !Array.isArray(data.records) ||
        !validProfile(data.profile) ||
        data.records.some((r) => !validRecord(r))
      )
        throw Error("프로필과 유효한 기록 배열이 필요합니다.");
      if (
        data.records.some((r) => r.studentId && r.studentId !== data.profile.id)
      )
        throw Error("다른 학생의 기록이 포함되어 있습니다.");
      const current = this.profile();
      if (current.id && current.id !== data.profile.id)
        throw Error("다른 학생의 자료입니다. 교사용 가져오기를 이용하세요.");
      const raw = this.storage.getItem("quizlab-records");
      if (raw)
        this.storage.setItem("quizlab-records-recovery-" + Date.now(), raw);
      const previousProfile = this.storage.getItem("quizlab-profile");
      const merged = normalize([...this.records(), ...data.records])
        .sort(chronological)
        .slice(-100);
      this.write("quizlab-profile", profileFields(data.profile));
      try {
        this.write("quizlab-records", merged);
      } catch (error) {
        if (
          previousProfile == null &&
          typeof this.storage.removeItem === "function"
        )
          this.storage.removeItem("quizlab-profile");
        else this.storage.setItem("quizlab-profile", previousProfile ?? "null");
        throw error;
      }
    }
  }
  const api = { LocalDataManager, validRecord, validProfile, normalize, order };
  if (typeof module !== "undefined") module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this);
