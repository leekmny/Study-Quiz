"use strict";
const accountLanguage = () => (typeof I18n !== "undefined" ? I18n.lang : "ko");
const accountText = (ko, en) => (accountLanguage() === "en" ? en : ko);
let teacherResult = null,
  teacherSelection = 0;
function accountMode(record) {
  const key = record.modeKey || record.mode;
  if (typeof I18n !== "undefined") {
    if (["all", "category", "speed", "review", "daily"].includes(key))
      return I18n.t("mode." + key);
    if (["한국사", "과학", "지리", "예술과 문화"].includes(key))
      return I18n.category(key);
  }
  return accountLanguage() === "en"
    ? { 전체: "All subjects", 스피드: "Speed" }[key] || key
    : key;
}
function accountDate(record) {
  const date = new Date(record.completedAt || record.date);
  return Number.isFinite(date.getTime())
    ? date.toLocaleDateString(accountLanguage() === "en" ? "en-US" : "ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : record.date;
}
function accountElement(tag, text, className) {
  const element = document.createElement(tag);
  if (text != null) element.textContent = text;
  if (className) element.className = className;
  return element;
}
function learningDashboard(records, stats) {
  const dashboard = $("learningDashboard");
  if (!dashboard) return;
  dashboard.replaceChildren();
  const dates = new Set();
  for (const record of records) {
    const date = new Date(record.completedAt || record.date);
    if (Number.isFinite(date.getTime()))
      dates.add(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  }
  const now = new Date(),
    today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  let day = dates.has(today) ? today : today - 86400000,
    streak = 0;
  while (dates.has(day)) {
    streak++;
    day -= 86400000;
  }
  const metrics = accountElement("div", null, "learning-metrics");
  for (const [label, value] of [
    [accountText("누적 도전", "Attempts"), String(stats.attempts)],
    [
      accountText("정답률", "Accuracy"),
      stats.averageAccuracy == null
        ? "—"
        : stats.averageAccuracy.toFixed(0) + "%",
    ],
    [accountText("연속 학습", "Day streak"), String(streak)],
    [
      accountText("복습할 문제", "To review"),
      String(dataManager.missedQuestionIds().length),
    ],
  ]) {
    const card = accountElement("article", null, "learning-metric");
    card.append(accountElement("span", label), accountElement("strong", value));
    metrics.append(card);
  }
  dashboard.append(metrics);
  const categories = Object.create(null);
  for (const record of records)
    for (const [category, count] of Object.entries(record.categories || {})) {
      const sum = (categories[category] ||= { correct: 0, total: 0 });
      sum.correct += count.correct;
      sum.total += count.total;
    }
  const subjects = accountElement("section", null, "category-performance");
  subjects.append(
    accountElement("h3", accountText("분야별 정답률", "Accuracy by subject")),
  );
  if (!Object.keys(categories).length)
    subjects.append(
      accountElement(
        "p",
        accountText(
          "첫 도전을 마치면 분야별 결과가 표시됩니다.",
          "Complete a quiz to see your subject results.",
        ),
        "empty-note",
      ),
    );
  for (const [category, count] of Object.entries(categories)) {
    const row = accountElement("div", null, "learning-category");
    const label =
      typeof I18n !== "undefined" ? I18n.category(category) : category;
    row.append(
      accountElement("span", label),
      accountElement(
        "b",
        Math.round((count.correct / count.total) * 100) + "%",
      ),
    );
    const progress = document.createElement("progress");
    progress.max = count.total;
    progress.value = count.correct;
    progress.setAttribute("aria-label", label);
    row.append(progress);
    subjects.append(row);
  }
  dashboard.append(subjects);
  const recent = accountElement("section", null, "recent-attempts");
  recent.append(
    accountElement("h3", accountText("최근 도전", "Recent attempts")),
  );
  const list = document.createElement("ol");
  for (const record of [...records]
    .sort(
      (a, b) =>
        (Date.parse(b.completedAt || b.date) || 0) -
        (Date.parse(a.completedAt || a.date) || 0),
    )
    .slice(0, 3)) {
    const item = document.createElement("li");
    item.append(
      accountElement("span", accountMode(record)),
      accountElement(
        "b",
        record.correct == null
          ? `${record.score} ${accountText("점", "pts")}`
          : `${record.correct}/${record.total}`,
      ),
      accountElement("small", accountDate(record)),
    );
    list.append(item);
  }
  if (!list.children.length)
    recent.append(
      accountElement(
        "p",
        accountText(
          "아직 완료한 도전이 없습니다.",
          "No completed quizzes yet.",
        ),
        "empty-note",
      ),
    );
  else recent.append(list);
  dashboard.append(recent);
}
function accountRefresh() {
  const profile = dataManager.profile(),
    stats = dataManager.stats(),
    records = dataManager.records();
  $("profileName").value = profile.id ? profile.name : "";
  $("profileAvatar").value = profile.avatar;
  $("personalStats").textContent = accountText(
    `응시 ${stats.attempts}회 · 최고 ${stats.best ?? "—"}점 · 정답률 ${stats.averageAccuracy == null ? "—" : stats.averageAccuracy.toFixed(1) + "%"}`,
    `${stats.attempts} attempts · Best ${stats.best ?? "—"} pts · Accuracy ${stats.averageAccuracy == null ? "—" : stats.averageAccuracy.toFixed(1) + "%"}`,
  );
  $("allRecords").replaceChildren();
  for (const record of records)
    $("allRecords").append(
      accountElement(
        "li",
        `${record.score} ${accountText("점", "pts")} · ${record.correct == null ? "—" : record.correct}/${record.total} · ${accountMode(record)} · ${accountDate(record)}`,
      ),
    );
  if (!records.length)
    $("allRecords").append(
      accountElement(
        "li",
        accountText("아직 기록이 없습니다.", "No saved attempts yet."),
      ),
    );
  learningDashboard(records, stats);
}
function accountDownload(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type })),
    link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function refreshTeacherPreview() {
  if (teacherResult)
    $("teacherPreview").srcdoc = QuizReports.html(
      teacherResult,
      accountLanguage(),
    );
}
$("saveProfile").onclick = () => {
  try {
    dataManager.saveProfile(
      $("profileName").value.trim() || accountText("학습자", "Learner"),
      $("profileAvatar").value,
    );
    accountRefresh();
    $("accountStatus").textContent = accountText(
      "프로필을 저장했습니다.",
      "Profile saved.",
    );
  } catch {
    $("accountStatus").textContent = accountText(
      "프로필을 저장할 수 없습니다. 브라우저 저장소를 확인하세요.",
      "Could not save your profile. Check browser storage.",
    );
  }
};
$("exportRecords").onclick = () => {
  try {
    if (!dataManager.profile().id)
      dataManager.saveProfile(accountText("학습자", "Learner"), "🌱");
    accountDownload(
      "quizlab-records.json",
      JSON.stringify(dataManager.exportData(), null, 2),
      "application/json",
    );
  } catch {
    $("accountStatus").textContent = accountText(
      "기록을 내보낼 수 없습니다.",
      "Could not export records.",
    );
  }
};
$("importRecords").onchange = async (event) => {
  try {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) throw Error("size");
    dataManager.importData(
      JSON.parse((await file.text()).replace(/^\uFEFF/, "")),
    );
    board();
    accountRefresh();
    $("accountStatus").textContent = accountText(
      "내 기록을 병합했습니다.",
      "Records merged.",
    );
  } catch {
    $("accountStatus").textContent = accountText(
      "복원하지 못했습니다. 같은 프로필의 올바른 기록 JSON(5MB 이하)을 선택하세요.",
      "Restore failed. Select a valid records JSON for this profile, up to 5 MB.",
    );
  } finally {
    event.target.value = "";
  }
};
$("teacherFiles").onchange = async (event) => {
  const selection = ++teacherSelection;
  try {
    const files = [...event.target.files];
    if (!files.length) return;
    if (files.length > 100 || files.some((file) => file.size > 5 * 1024 * 1024))
      throw Error("size");
    const imports = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        data: JSON.parse((await file.text()).replace(/^\uFEFF/, "")),
      })),
    );
    const result = QuizReports.aggregate(imports);
    if (selection !== teacherSelection) return;
    teacherResult = result;
    refreshTeacherPreview();
    $("teacherStatus").textContent = accountText(
      `파일 ${files.length}개 · 학생 ${result.students}명 · 응시 ${result.attempts}건 · 제외 ${result.excluded}건`,
      `${files.length} files · ${result.students} students · ${result.attempts} attempts · ${result.excluded} excluded`,
    );
    $("teacherDownload").disabled = $("teacherCSV").disabled = false;
  } catch {
    if (selection === teacherSelection)
      $("teacherStatus").textContent = accountText(
        "가져오지 못했습니다. 올바른 기록 JSON을 선택하세요. 기존 보고서는 유지됩니다.",
        "Import failed. Select valid records JSON files. The existing report was kept.",
      );
  } finally {
    if (selection === teacherSelection) event.target.value = "";
  }
};
$("teacherDownload").onclick = () => {
  if (teacherResult)
    accountDownload(
      "teacher_report.html",
      QuizReports.html(teacherResult, accountLanguage()),
      "text/html;charset=utf-8",
    );
};
$("teacherCSV").onclick = () => {
  if (teacherResult)
    accountDownload(
      "report_detailed.csv",
      QuizReports.csv(teacherResult, accountLanguage()),
      "text/csv;charset=utf-8",
    );
};
document.addEventListener("languagechange", () => {
  accountRefresh();
  refreshTeacherPreview();
  $("accountStatus").textContent = "";
  $("teacherStatus").textContent = "";
});
accountRefresh();
