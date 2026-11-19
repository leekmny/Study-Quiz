"use strict";
// Recheck adapter. Invoke the original browser functions in a small DOM
// harness, controlling only its date, clock, input, storage, and random source.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

class Element {
  constructor() {
    this.children = [];
    this.hidden = false;
    this.disabled = false;
    this.dataset = {};
    this.value = "";
    this.classList = { add() {}, toggle() {} };
  }
  append(...nodes) {
    this.children.push(...nodes);
  }
  replaceChildren(...nodes) {
    this.children = nodes;
  }
  focus() {}
  setAttribute() {}
  set textContent(value) {
    this.text = String(value);
    this.children = [];
  }
  get textContent() {
    return this.text || "";
  }
}

function run(request) {
  if (request.op !== "quiz") throw Error("expected a quiz trace request");
  const root = path.resolve(__dirname, "..");
  const elements = new Map();
  const callbacks = new Map();
  const intervals = new Map();
  const storage = new Map();
  let now = request.now ?? 0;
  let interval = 0;
  let position = 0;
  const localDay = request.date?.split("-").map(Number);
  if (request.missedIds) {
    storage.set("quizlab-records", JSON.stringify([{
      mode: "all", date: "2000-01-01", score: 0, total: 1,
      missedIds: request.missedIds,
    }]));
  }
  const FakeDate = class extends Date {
    constructor(...args) {
      super(...(args.length ? args : [now]));
    }
    static now() { return now; }
    getFullYear() { return localDay?.[0] ?? super.getFullYear(); }
    getMonth() { return localDay ? localDay[1] - 1 : super.getMonth(); }
    getDate() { return localDay?.[2] ?? super.getDate(); }
  };
  const document = {
    documentElement: { lang: "ko" },
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, new Element());
      return elements.get(id);
    },
    createElement: () => new Element(),
    querySelectorAll: () => [],
    addEventListener(type, listener) {
      if (!callbacks.has(type)) callbacks.set(type, []);
      callbacks.get(type).push(listener);
    },
    dispatchEvent(event) {
      for (const listener of callbacks.get(event.type) || []) listener(event);
    },
  };
  const suppliedRandom = request.random ?? [];
  const context = vm.createContext({
    document, Date: FakeDate,
    Math: Object.assign(Object.create(Math), {
      random: suppliedRandom.length
        ? () => suppliedRandom[position++ % suppliedRandom.length]
        : Math.random,
    }),
    LocalDataManager: require(path.join(root, "local-data.js")).LocalDataManager,
    quizQuestions: require(path.join(root, "questions.js")),
    quizQuestionsEN: require(path.join(root, "questions-en.js")),
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    setInterval(listener) {
      intervals.set(++interval, listener);
      return interval;
    },
    clearInterval: (id) => intervals.delete(id),
    CustomEvent: class { constructor(type) { this.type = type; } },
    request,
  });
  const evaluate = (code) => vm.runInContext(code, context);
  for (const filename of ["i18n.js", "script.js"]) {
    vm.runInContext(fs.readFileSync(path.join(root, filename), "utf8"), context, { filename });
  }
  evaluate(`
    mode = request.mode || "all";
    $("category").value = request.category || "";
    $("difficulty").value = request.difficulty || "";
    $("sessionLength").value = String(request.length || 0);
    I18n.setLanguage(request.language || "ko");
    start(request.ids);
  `);
  const result = { pool: [], steps: [] };
  if (!evaluate("state")) return result;
  result.pool = evaluate("state.pool.map(localizedQuestion)");
  const snapshot = () => JSON.parse(evaluate(`JSON.stringify({
    index: state.index, score: state.score,
    answers: state.answers.map(a => ({
      questionId: a.q.id, selected: a.selected, ok: a.ok, points: a.points,
    })),
    answered: state.answered, hint: state.hint, eliminated: state.eliminated,
    deadline: state.deadline, finished: state.finished,
  })`));

  let previous = snapshot();
  result.steps.push({ changed: true, ...previous });
  for (const action of request.actions || []) {
    now = action.at ?? now + (action.after ?? 0);
    context.action = action;
    switch (action.action) {
      case "hint": evaluate("hint()"); break;
      case "answer": evaluate("answer(action.index)"); break;
      case "next": evaluate("next()"); break;
      case "correct":
        evaluate("if (!state.finished) answer(state.pool[state.index].correctAnswer)");
        break;
      case "wrong":
        evaluate(`
          if (!state.finished) {
            const correct = state.pool[state.index].correctAnswer;
            answer([0, 1, 2, 3].find(i => i !== correct && !state.eliminated.includes(i)));
          }
        `);
        break;
      case "tick":
        for (const listener of [...intervals.values()]) listener();
        break;
    }
    const current = snapshot();
    result.steps.push({ changed: JSON.stringify(current) !== JSON.stringify(previous), ...current });
    previous = current;
  }
  return result;
}

if (require.main === module) {
  try {
    const filename = process.argv[2];
    const request = JSON.parse(fs.readFileSync(filename && filename !== "-" ? filename : 0, "utf8"));
    console.log(JSON.stringify({ ok: true, result: run(request) }));
  } catch (error) {
    console.log(JSON.stringify({ ok: false, error: error.message }));
  }
}
module.exports = { run };
