const fs = require("fs");
const qs = require("../questions.js");
function validate(category) {
  const errors = [],
    warnings = [];
  const list = category ? qs.filter((q) => q.category === category) : qs;
  if (!list.length) throw Error("대상 문항 없음: " + category);
  const ids = new Set(),
    texts = new Set();
  for (const q of qs) {
    if (!Number.isInteger(q.id) || q.id < 1 || ids.has(q.id))
      errors.push("ID 오류 " + q.id);
    ids.add(q.id);
    if (texts.has(q.question)) errors.push("중복 질문 " + q.id);
    texts.add(q.question);
  }
  for (const q of list) {
    if (
      !["한국사", "과학", "지리", "예술과 문화"].includes(q.category) ||
      !["easy", "medium", "hard"].includes(q.difficulty)
    )
      errors.push("분류 오류 " + q.id);
    if (
      !Array.isArray(q.options) ||
      q.options.length !== 4 ||
      new Set(q.options).size !== 4 ||
      q.options.some((x) => typeof x !== "string" || !x.trim())
    )
      errors.push("보기 오류 " + q.id);
    if (
      !Number.isInteger(q.correctAnswer) ||
      q.correctAnswer < 0 ||
      q.correctAnswer > 3
    )
      errors.push("정답 오류 " + q.id);
    if (!q.question?.trim() || !q.explanation?.trim())
      errors.push("내용 누락 " + q.id);
    if (/가장|최초|최대|최고|최저|처음|마지막/.test(q.question))
      warnings.push({
        id: q.id,
        question: q.question,
        hasCriterion: /기준|면적|해발|건조|부피|조선시대|아프리카/.test(
          q.question,
        ),
      });
  }
  return {
    scope: category || "전체",
    count: list.length,
    errors,
    superlatives: warnings,
    note: "최상급 탐지와 구조 검사. 외부 사실 검증은 별도.",
  };
}
function range(a, b) {
  if (!/^\d+$/.test(String(a)) || !/^\d+$/.test(String(b)) || +a < 1 || +b < +a)
    throw Error("사용법: range <양의 시작ID> <끝ID>, 시작 <= 끝");
  const list = qs.filter((q) => q.id >= +a && q.id <= +b);
  if (!list.length) throw Error("빈 구간");
  const values = list.map(
    (q) => ({ easy: 1, medium: 2, hard: 3 })[q.difficulty],
  );
  const mean = values.reduce((a, b) => a + b, 0) / values.length,
    answers = [0, 0, 0, 0];
  list.forEach((q) => answers[q.correctAnswer]++);
  return {
    start: +a,
    end: +b,
    count: list.length,
    mean,
    stdDev: Math.sqrt(
      values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length,
    ),
    deviations: list.map((q, i) => ({ id: q.id, deviation: values[i] - mean })),
    answers: answers.map((count, i) => ({
      option: i + 1,
      count,
      percent: (100 * count) / list.length,
    })),
  };
}
function stats() {
  const counts = (key) =>
    qs.reduce((out, q) => {
      out[q[key]] = (out[q[key]] || 0) + 1;
      return out;
    }, {});
  return {
    count: qs.length,
    categories: counts("category"),
    difficulty: counts("difficulty"),
    answers: counts("correctAnswer"),
  };
}
module.exports = { validate, range, stats };
if (require.main === module) {
  try {
    const [cmd, ...args] = process.argv.slice(2);
    let result;
    if (cmd === "validate" || cmd === "check")
      result = validate(args.join(" "));
    else if (cmd === "range" && args.length === 2) result = range(...args);
    else if (cmd === "stats") result = stats();
    else
      throw Error(
        "Usage: validate [category] | check | range <startID> <endID> | stats",
      );
    console.log(JSON.stringify(result, null, 2));
    if (result.errors?.length) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
