"use strict";
const assert = require("node:assert/strict"),
  vm = require("node:vm"),
  fs = require("node:fs"),
  path = require("node:path");
const questions = require("../questions.js");
class Element {
  constructor() {
    this.style = {};
    this.children = [];
    this.hidden = false;
    this.disabled = false;
    this.dataset = {};
    this.value = "";
    this.attrs = {};
    this.classList = { add() {}, toggle() {} };
  }
  append(...nodes) {
    this.children.push(...nodes);
  }
  replaceChildren(...nodes) {
    this.children = nodes;
  }
  focus() {}
  setAttribute(k, v) {
    this.attrs[k] = v;
  }
  getAttribute(k) {
    return this.attrs[k];
  }
  set textContent(v) {
    this.text = String(v);
    this.children = [];
  }
  get textContent() {
    return this.text || "";
  }
}
function harness({ blocked = false, random = Math.random, records = [] } = {}) {
  const elements = {},
    events = {},
    storage = new Map([["quizlab-records", JSON.stringify(records)]]),
    intervals = new Map();
  let now = new Date(2026, 10, 18, 12).getTime(),
    timerId = 0;
  const FakeDate = class extends Date {
    constructor(...args) {
      super(...(args.length ? args : [now]));
    }
    static now() {
      return now;
    }
  };
  const document = {
    documentElement: { lang: "ko" },
    getElementById: (id) => (elements[id] ||= new Element()),
    createElement: () => new Element(),
    querySelectorAll: () => [],
    addEventListener: (n, f) => (events[n] ||= []).push(f),
    dispatchEvent: (e) => (events[e.type] || []).forEach((f) => f(e)),
  };
  const ctx = {
    document,
    Date: FakeDate,
    Math: Object.assign(Object.create(Math), { random }),
    console,
    CustomEvent: class {
      constructor(type) {
        this.type = type;
      }
    },
    localStorage: {
      getItem: (k) => (blocked ? "bad json" : storage.get(k) || null),
      setItem(k, v) {
        if (blocked) throw Error("denied");
        storage.set(k, v);
      },
    },
    LocalDataManager: require("../local-data.js").LocalDataManager,
    quizQuestions: questions,
    quizQuestionsEN: questions.map((q) => ({
      ...q,
      question: `English question ${q.id}`,
      options: q.options.map((_, i) => `English ${q.id}-${i}`),
      explanation: "English explanation",
      hint: "English hint",
    })),
    setInterval: (f) => {
      intervals.set(++timerId, f);
      return timerId;
    },
    clearInterval: (id) => intervals.delete(id),
  };
  vm.createContext(ctx);
  for (const file of ["i18n.js", "script.js"])
    if (fs.existsSync(path.join(__dirname, "..", file)))
      vm.runInContext(
        fs.readFileSync(path.join(__dirname, "..", file), "utf8"),
        ctx,
      );
  return {
    elements,
    storage,
    intervals,
    run: (code) => vm.runInContext(code, ctx),
    advance(ms) {
      now += ms;
      for (const f of [...intervals.values()]) f();
    },
  };
}
// Sorted questions or a broken option remap must fail this behavioral check.
let h = harness({ random: () => 0 });
h.run("start()");
assert.notEqual(
  h.run("state.pool[0].id"),
  1,
  "all mode must shuffle questions",
);
assert.notDeepEqual(
  Array.from(h.run("state.pool[0].options")),
  questions.find((q) => q.id === h.run("state.pool[0].id")).options,
  "options must shuffle",
);
for (const q of Array.from(h.run("state.pool"))) {
  const original = questions.find((x) => x.id === q.id);
  assert.equal(
    q.options[q.correctAnswer],
    original.options[original.correctAnswer],
  );
}
h.run(
  "answer(state.pool[0].correctAnswer);answer(state.pool[0].correctAnswer)",
);
assert.equal(h.run("state.score"), 10);
assert.equal(h.run("state.answers.length"), 1);
h.run("next();hint()");
assert.equal(h.elements.options.children.filter((b) => b.disabled).length, 2);
h.run("answer(state.pool[state.index].correctAnswer)");
assert.equal(h.run("state.score"), 15);
h = harness();
h.run(
  "mode='category';$('category').value='과학';$('difficulty').value='easy';$('sessionLength').value='10';start()",
);
assert.ok(
  h.run("state.pool.every(q=>q.category==='과학'&&q.difficulty==='easy')"),
);
assert.ok(h.run("state.pool.length<=10&&state.pool.length>0"));
h = harness();
h.run("$('sessionLength').value='10';start()");
assert.equal(h.run("state.pool.length"), 10);
h.run("I18n.setLanguage('en')");
assert.match(h.elements.question.textContent, /^English question/);
h.run("answer(state.pool[state.index].correctAnswer)");
assert.match(h.elements.verdict.textContent, /Correct/);
h.run("I18n.setLanguage('ko')");
assert.equal(h.run("state.score"), 10);
assert.ok(!h.elements.feedback.hidden);
h = harness();
h.run("mode='daily';start()");
const ids = h.run("JSON.stringify(state.pool.map(q=>[q.id,q.options]))");
h.run("start()");
assert.equal(h.run("state.pool.length"), 10);
assert.equal(h.run("JSON.stringify(state.pool.map(q=>[q.id,q.options]))"), ids);
h.advance(86400000);
h.run("start()");
assert.notEqual(
  h.run("JSON.stringify(state.pool.map(q=>[q.id,q.options]))"),
  ids,
);
h = harness();
h.run("mode='review';start()");
assert.equal(h.elements.play.hidden, true, "empty review stays on setup");
const history = [
  {
    id: "one",
    studentId: "x",
    name: "X",
    date: "2026-11-18",
    completedAt: "2026-11-18T01:00:00Z",
    mode: "all",
    score: 0,
    total: 1,
    correct: 0,
    answers: [{ questionId: 1, correct: false }],
  },
];
h = harness({ records: history });
h.run("mode='review';start()");
assert.equal(h.run("state.pool.length"), 1);
assert.equal(h.run("state.pool[0].id"), 1);
h.run("answer(state.pool[0].correctAnswer);next()");
assert.equal(h.run("loadRecords().length"), 2);
h.run("I18n.setLanguage('en')");
assert.ok(
  h.elements.ranking.children.every(
    (item) => !item.textContent.includes("1 questions"),
  ),
  "one-question attempts use singular wording",
);
assert.equal(
  h.run('loadRecords().find(r=>r.id!=="one").answers[0].questionId'),
  1,
);
h.run("start()");
assert.equal(
  h.elements.play.hidden,
  true,
  "reviewed correct questions leave the pool",
);
h = harness();
h.run("mode='speed';start()");
h.advance(15001);
assert.equal(h.run("state.answers[0].selected"), -1);
assert.equal(h.intervals.size, 0);
h.run("next()");
assert.equal(h.intervals.size, 1);
h.elements.home.onclick();
assert.equal(h.intervals.size, 0);
h = harness({ blocked: true });
h.run(
  "$('sessionLength').value='10';start();while(!state.finished){answer(state.pool[state.index].correctAnswer);next();}",
);
assert.equal(h.elements.result.hidden, false);
assert.match(h.elements.storageNote.textContent, /저장/);
console.log(
  "PASS: shuffle/remapping, scoring, filters, length, live translation, daily seed, review, timers, blocked storage",
);
module.exports = { harness };
