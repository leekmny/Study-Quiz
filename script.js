"use strict";
const $ = (id) => document.getElementById(id);
let mode = "all",
  state = null,
  timer = null;
const dataManager = new LocalDataManager({
  getItem: (k) => localStorage.getItem(k),
  setItem: (k, v) => localStorage.setItem(k, v),
});
const tr = (key, vars) => I18n.t(key, vars);
function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function dailyRandom() {
  const date = new Date();
  let seed = Number(
    `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`,
  );
  return () => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
function loadRecords() {
  return dataManager.records();
}
function recordMode(record) {
  return record.modeKey
    ? tr("mode." + record.modeKey)
    : I18n.category(record.mode);
}
function board() {
  const records = loadRecords();
  $("ranking").replaceChildren();
  for (const record of records.slice(0, 5)) {
    const li = document.createElement("li");
    li.textContent = tr(
      record.total === 1 ? "recordLineSingle" : "recordLine",
      { ...record, mode: recordMode(record) },
    );
    $("ranking").append(li);
  }
  if (!records.length) $("ranking").textContent = tr("noRecords");
}
function show(id) {
  for (const name of ["setup", "play", "result"]) $(name).hidden = name !== id;
}
function stop() {
  clearInterval(timer);
  timer = null;
}
function missedQuestionIds() {
  if (typeof dataManager.missedQuestionIds === "function")
    return dataManager.missedQuestionIds();
  const missed = new Set();
  for (const record of [...loadRecords()].sort((a, b) =>
    String(a.completedAt || a.date).localeCompare(
      String(b.completedAt || b.date),
    ),
  ))
    for (const answer of record.answers || [])
      if (answer.correct) missed.delete(answer.questionId);
      else missed.add(answer.questionId);
  return [...missed];
}
function makePool(explicitIds) {
  let pool = [...quizQuestions];
  const random = mode === "daily" ? dailyRandom() : Math.random;
  if (explicitIds) pool = pool.filter((q) => explicitIds.includes(q.id));
  else if (mode === "review") {
    const missed = missedQuestionIds();
    pool = pool.filter((q) => missed.includes(q.id));
  } else if (mode === "category")
    pool = pool.filter((q) => q.category === $("category").value);
  if (mode !== "daily") {
    const difficulty = $("difficulty")?.value;
    if (["easy", "medium", "hard"].includes(difficulty))
      pool = pool.filter((q) => q.difficulty === difficulty);
  }
  pool = shuffle(pool, random);
  const length = mode === "daily" ? 10 : Number($("sessionLength")?.value);
  if (length > 0) pool = pool.slice(0, length);
  return pool.map((q) => {
    const order = shuffle([0, 1, 2, 3], random);
    return {
      ...q,
      optionOrder: order,
      options: order.map((i) => q.options[i]),
      correctAnswer: order.indexOf(q.correctAnswer),
    };
  });
}
function localizedQuestion(q) {
  if (I18n.lang !== "en" || typeof quizQuestionsEN === "undefined") return q;
  if (typeof globalThis.studyQuizGo === "function")
    return goEngine({ op: "localize", question: q, language: "en" });
  const translated = quizQuestionsEN.find((item) => item.id === q.id);
  if (!translated) return q;
  return {
    ...q,
    question: translated.question,
    options: q.optionOrder.map((i) => translated.options[i]),
    explanation: translated.explanation,
    hint: translated.hint,
  };
}
function start(explicitIds) {
  if (globalThis.studyQuizGoReady) {
    startGo(explicitIds);
    return;
  }
  stop();
  const pool = makePool(Array.isArray(explicitIds) ? explicitIds : null);
  if (!pool.length) {
    state = null;
    show("setup");
    if ($("sessionNote"))
      $("sessionNote").textContent = tr(
        mode === "review" ? "emptyReview" : "noQuestions",
      );
    return;
  }
  if ($("sessionNote")) $("sessionNote").textContent = "";
  state = {
    pool,
    index: 0,
    score: 0,
    answers: [],
    answered: false,
    hint: false,
    eliminated: [],
    deadline: 0,
    finished: false,
  };
  show("play");
  load();
}
function goEngine(request) {
  const response = JSON.parse(globalThis.studyQuizGo(JSON.stringify(request)));
  if (!response.ok) throw Error(response.error);
  return response.result;
}
async function waitForGoEngine() {
  const engine = await globalThis.studyQuizGoReady;
  if (!engine.ready) throw engine.error;
}
async function startGo(explicitIds) {
  stop();
  const button = $("start");
  button.disabled = true;
  try {
    await waitForGoEngine();
    const date = new Date();
    const calendarDate = [
      String(date.getFullYear()).padStart(4, "0"),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
    state = goEngine({
      op: "start",
      mode,
      category: $("category")?.value,
      difficulty: $("difficulty")?.value,
      length: Number($("sessionLength")?.value) || 0,
      ids: Array.isArray(explicitIds) ? explicitIds : undefined,
      missedIds: mode === "review" ? missedQuestionIds() : undefined,
      now: date.getTime(),
      date: calendarDate,
    });
    if (!state) {
      show("setup");
      $("sessionNote").textContent = tr(
        mode === "review" ? "emptyReview" : "noQuestions",
      );
      return;
    }
    $("sessionNote").textContent = "";
    show("play");
    loadGo();
  } catch (error) {
    show("setup");
    $("sessionNote").textContent = String(error);
  } finally {
    button.disabled = false;
  }
}
function loadGo() {
  stop();
  paintQuestion();
  $("question").focus();
  if (mode === "speed")
    timer = setInterval(() => {
      timerText();
      if (Date.now() >= state.deadline) goStep("tick");
    }, 100);
}
function goStep(action, index) {
  if (!state || state.finished) return;
  try {
    const result = goEngine({ op: "step", action, state, mode, now: Date.now(), index });
    if (!result.changed) return;
    state = result.state;
    if (state.finished) finish(true);
    else if (action === "next") loadGo();
    else {
      if (state.answered) stop();
      paintQuestion();
    }
  } catch (error) {
    stop();
    state = null;
    show("setup");
    $("sessionNote").textContent = String(error);
  }
}
function timerText() {
  if (!state) return;
  $("timer").textContent =
    mode === "speed"
      ? tr("seconds", {
          seconds: Math.max(0, Math.ceil((state.deadline - Date.now()) / 1000)),
        })
      : tr("untimed");
}
function paintQuestion() {
  if (!state || state.finished) return;
  const q = localizedQuestion(state.pool[state.index]);
  $("badge").textContent =
    I18n.category(q.category) + " · " + I18n.difficulty(q.difficulty);
  $("position").textContent = `${state.index + 1} / ${state.pool.length}`;
  $("score").textContent = tr("score", { score: state.score });
  $("progress").value =
    (state.index + Number(state.answered)) / state.pool.length;
  $("question").textContent = q.question;
  $("options").replaceChildren();
  q.options.forEach((text, i) => {
    const button = document.createElement("button");
    button.textContent = `${i + 1}. ${text}`;
    button.onclick = () => answer(i);
    button.disabled = state.answered || state.eliminated.includes(i);
    if (state.eliminated.includes(i)) button.classList.add("eliminated");
    if (state.answered) {
      if (i === q.correctAnswer) button.classList.add("correct");
      else if (i === state.answers.at(-1).selected)
        button.classList.add("wrong");
    }
    $("options").append(button);
  });
  $("hint").disabled = state.hint || state.answered;
  $("hintText").replaceChildren();
  $("hintText").hidden = !state.hint;
  if (state.hint) {
    $("hintText").textContent = tr("hintText", {
      hint: q.hint || tr("hintFallback"),
    });
    if (q.hintSource) {
      const a = document.createElement("a");
      a.href = q.hintSource;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = tr("hintSource");
      $("hintText").append(a);
    }
  }
  $("feedback").hidden = !state.answered;
  if (state.answered) {
    const answer = state.answers.at(-1);
    $("verdict").textContent =
      answer.selected === -1
        ? tr("timedOut")
        : answer.ok
          ? tr("correct", { points: answer.points })
          : tr("incorrect");
    $("explanation").textContent = q.explanation;
    $("sourceNote").replaceChildren();
    $("sourceNote").append(tr("sourceNote") + " ");
    for (const url of q.sources || []) {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = tr("sourceLink") + " ";
      $("sourceNote").append(a);
    }
  }
  $("next").textContent = tr(
    state.index === state.pool.length - 1 ? "results" : "next",
  );
  timerText();
}
function load() {
  stop();
  state.answered = false;
  state.hint = false;
  state.eliminated = [];
  state.deadline = mode === "speed" ? Date.now() + 15000 : 0;
  paintQuestion();
  $("question").focus();
  if (mode === "speed")
    timer = setInterval(() => {
      timerText();
      if (Date.now() >= state.deadline) answer(-1);
    }, 100);
}
function answer(index) {
  if (globalThis.studyQuizGoReady) return goStep("answer", index);
  if (!state || state.answered || state.finished) return;
  if (mode === "speed" && Date.now() >= state.deadline) index = -1;
  if (
    index !== -1 &&
    (!Number.isInteger(index) ||
      index < 0 ||
      index > 3 ||
      state.eliminated.includes(index))
  )
    return;
  state.answered = true;
  stop();
  const q = state.pool[state.index],
    ok = index === q.correctAnswer,
    points = ok ? (state.hint ? 5 : 10) : 0;
  state.score += points;
  state.answers.push({ q, selected: index, ok, points });
  paintQuestion();
}
function hint() {
  if (globalThis.studyQuizGoReady) return goStep("hint");
  if (!state || state.answered || state.hint) return;
  if (mode === "speed" && Date.now() >= state.deadline) {
    answer(-1);
    return;
  }
  state.hint = true;
  state.eliminated = shuffle(
    [0, 1, 2, 3].filter((i) => i !== state.pool[state.index].correctAnswer),
  ).slice(0, 2);
  paintQuestion();
}
function next() {
  if (globalThis.studyQuizGoReady) return goStep("next");
  if (!state?.answered || state.finished) return;
  state.index++;
  if (state.index < state.pool.length) load();
  else finish();
}
function paintResult() {
  const correct = state.answers.filter((a) => a.ok).length;
  $("summary").textContent = tr("summary", {
    score: state.score,
    correct,
    total: state.pool.length,
    accuracy: Math.round((correct / state.pool.length) * 100),
  });
  $("breakdown").replaceChildren();
  for (const category of new Set(state.pool.map((q) => q.category))) {
    const answers = state.answers.filter((a) => a.q.category === category),
      span = document.createElement("span");
    span.textContent = `${I18n.category(category)}: ${answers.filter((a) => a.ok).length}/${answers.length}`;
    $("breakdown").append(span);
  }
  $("review").replaceChildren();
  for (const answer of state.answers.filter((a) => !a.ok)) {
    const q = localizedQuestion(answer.q),
      details = document.createElement("details"),
      summary = document.createElement("summary"),
      p = document.createElement("p");
    summary.textContent = q.question;
    p.textContent = tr("reviewAnswer", {
      selected:
        answer.selected < 0 ? tr("timedOut") : q.options[answer.selected],
      answer: q.options[q.correctAnswer],
      explanation: q.explanation,
    });
    details.append(summary, p);
    $("review").append(details);
  }
  if (!$("review").children.length) $("review").textContent = tr("perfect");
  if ($("retryWrong"))
    $("retryWrong").hidden = state.answers.every((a) => a.ok);
}
function finish(finishedByEngine = false) {
  if (state.finished && !finishedByEngine) return;
  stop();
  state.finished = true;
  show("result");
  paintResult();
  const correct = state.answers.filter((a) => a.ok).length;
  try {
    let profile = dataManager.profile();
    if (!profile.id) profile = dataManager.saveProfile(tr("learner"), "🌱");
    const categories = {};
    for (const answer of state.answers) {
      const item = (categories[answer.q.category] ||= { correct: 0, total: 0 });
      item.total++;
      if (answer.ok) item.correct++;
    }
    dataManager.save({
      id: "attempt-" + Date.now() + "-" + Math.random().toString(36).slice(2),
      studentId: profile.id,
      name: profile.name,
      score: state.score,
      total: state.pool.length,
      correct,
      completed: true,
      completedAt: new Date().toISOString(),
      categories,
      mode: mode === "category" ? $("category").value : mode,
      modeKey: mode,
      answers: state.answers.map((a) => ({
        questionId: a.q.id,
        correct: a.ok,
      })),
      date: new Date().toISOString().slice(0, 10),
    });
  } catch {
    $("storageNote").textContent = tr("saveFailed");
  }
  if (typeof accountRefresh === "function") accountRefresh();
  board();
}
function selectMode(value) {
  mode = value;
  for (const button of document.querySelectorAll("[data-mode]")) {
    const selected = button.dataset.mode === mode;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  }
  $("categoryLabel").hidden = mode !== "category";
  for (const id of ["difficulty", "sessionLength"])
    if ($(id)) $(id).disabled = mode === "daily";
  if ($("sessionNote"))
    $("sessionNote").textContent =
      mode === "daily" ? tr("dailyNote") : tr("selectedHelp");
}
for (const button of document.querySelectorAll("[data-mode]"))
  button.onclick = () => selectMode(button.dataset.mode);
$("start").onclick = () => start();
$("hint").onclick = hint;
$("next").onclick = next;
$("home").onclick = () => {
  stop();
  state = null;
  show("setup");
};
$("restart").onclick = () => {
  state = null;
  show("setup");
};
if ($("retryWrong"))
  $("retryWrong").onclick = () => {
    const ids = state.answers.filter((a) => !a.ok).map((a) => a.q.id);
    selectMode("review");
    start(ids);
  };
document.addEventListener("keydown", (event) => {
  if (
    $("play").hidden ||
    event.repeat ||
    !state ||
    ["SELECT", "INPUT", "TEXTAREA"].includes(event.target.tagName)
  )
    return;
  if (/^[1-4]$/.test(event.key) && !state.answered) {
    event.preventDefault();
    const index = Number(event.key) - 1;
    if (!$("options").children[index].disabled) answer(index);
  } else if (
    event.key === "Enter" &&
    state.answered &&
    event.target.tagName !== "BUTTON"
  ) {
    event.preventDefault();
    next();
  }
});
document.addEventListener("languagechange", () => {
  board();
  selectMode(mode);
  if (state?.finished) paintResult();
  else if (state) paintQuestion();
});
board();
show("setup");
