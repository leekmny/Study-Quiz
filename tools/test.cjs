const assert = require("node:assert/strict"),
  vm = require("vm"),
  fs = require("fs");
const qs = require("../questions.js"),
  { validate, range } = require("./quiz-tools.cjs");
assert.ok(qs.length >= 49);
assert.deepEqual(validate().errors, []);
assert.equal(
  validate("한국사").count,
  qs.filter((q) => q.category === "한국사").length,
);
assert.equal(
  validate("예술과 문화").count,
  qs.filter((q) => q.category === "예술과 문화").length,
);
assert.equal(range(1, 20).count, 20);
assert.deepEqual(
  range(1, 48).answers.map((x) => x.count),
  [12, 12, 12, 12],
);
assert.throws(() => range(20, 1));
assert.throws(() => validate("없음"));
assert.equal(
  qs.filter((q) => typeof q.hint === "string" && q.hint.trim()).length,
  qs.length,
);
class El {
  constructor() {
    this.style = {};
    this.children = [];
    this.hidden = false;
    this.disabled = false;
    this.dataset = {};
    this.classList = { add() {}, toggle() {} };
  }
  append(...xs) {
    this.children.push(...xs);
  }
  replaceChildren() {
    this.children = [];
  }
  focus() {}
  setAttribute() {}
  set textContent(x) {
    this.text = x;
    this.children = [];
  }
  get textContent() {
    return this.text;
  }
}
function harness(broken = false) {
  const els = {};
  const document = {
    documentElement: { lang: "ko" },
    dispatchEvent() {},
    getElementById: (id) => (els[id] ??= new El()),
    createElement: () => new El(),
    querySelectorAll: () => [],
    addEventListener() {},
  };
  let intervals = new Map(),
    n = 0,
    now = 0,
    store = new Map();
  const FakeDate = class extends Date {
    static now() {
      return now;
    }
  };
  const ctx = {
    CustomEvent: class {
      constructor(type) {
        this.type = type;
      }
    },
    LocalDataManager: require("../local-data.js").LocalDataManager,
    quizQuestions: qs,
    document,
    Date: FakeDate,
    console,
    localStorage: {
      getItem(k) {
        return broken ? "bad json" : store.get(k) || null;
      },
      setItem(k, v) {
        if (broken) throw Error("denied");
        store.set(k, v);
      },
    },
    setInterval: (f) => {
      intervals.set(++n, f);
      return n;
    },
    clearInterval: (id) => intervals.delete(id),
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(require.resolve("../i18n.js"), "utf8"), ctx);
  vm.runInContext(
    fs.readFileSync(require.resolve("../script.js"), "utf8"),
    ctx,
  );
  return {
    els,
    run: (s) => vm.runInContext(s, ctx),
    advance(ms) {
      now += ms;
      for (const f of [...intervals.values()]) f();
    },
    intervals,
  };
}
let h = harness();
h.run(
  "start();answer(state.pool[0].correctAnswer);answer(state.pool[0].correctAnswer)",
);
assert.equal(h.run("state.score"), 10);
assert.equal(h.run("state.answers.length"), 1);
h.run("next();hint()");
assert.equal(h.els.options.children.filter((b) => b.disabled).length, 2);
assert.equal(h.els.hintText.hidden, false);
assert.ok(
  h.els.hintText.textContent.includes(h.run("state.pool[state.index].hint")),
);
h.run("answer(state.pool[state.index].correctAnswer)");
assert.equal(h.run("state.score"), 15);
h.run("next();answer((state.pool[state.index].correctAnswer+1)%4)");
assert.equal(h.run("state.score"), 15);
h.run(
  "next();while(state.index<state.pool.length){answer(state.pool[state.index].correctAnswer);next();}",
);
assert.equal(h.els.result.hidden, false);
assert.equal(h.els.review.children.length, 1);
assert.equal(h.run("loadRecords().length"), 1);
h = harness();
h.run("mode='category';$('category').value='과학';start()");
assert.equal(
  h.run("state.pool.length"),
  qs.filter((q) => q.category === "과학").length,
);
assert.equal(h.run("state.pool.every(q=>q.category==='과학')"), true);
h = harness();
h.run(
  "start();state.index=state.pool.findIndex(q=>q.hintSource);load();hint()",
);
assert.equal(h.els.hintText.hidden, false);
assert.equal(h.els.hintText.children.length, 1);
assert.match(h.els.hintText.children[0].href, /^https:\/\//);
h.run("answer(state.pool[state.index].correctAnswer);next()");
assert.equal(h.els.hintText.hidden, true);
h = harness();
h.run("mode='speed';start()");
h.advance(15001);
assert.equal(h.run("state.answers[0].selected"), -1);
assert.equal(h.run("state.score"), 0);
assert.equal(h.intervals.size, 0);
h.run("next()");
assert.equal(h.intervals.size, 1);
h.els.home.onclick();
assert.equal(h.intervals.size, 0);
h = harness(true);
h.run(
  "mode='category';$('category').value='지리';start();while(state.index<state.pool.length){answer(state.pool[state.index].correctAnswer);next();}",
);
assert.equal(h.els.result.hidden, false);
assert.match(h.els.storageNote.textContent, /저장되지/);
console.log(
  "PASS: 현재 문항 구조, 기존 1~48번 정답 위치 각 12개, 범위·카테고리·잘못된 인수 검사",
);
console.log(
  "PASS: 중복 채점 방지, 정오답, 힌트 제거·감점, 전 문항 완료·오답 복습·순위 저장",
);
console.log(
  "PASS: 분야 필터, 15초 시간초과, 타이머 재시작·중단, 손상/차단 저장소 복구",
);
console.log(
  "Note: logic checks use a simulated DOM. Run npm run test:browser for browser checks.",
);
