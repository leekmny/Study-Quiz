"use strict";
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const http = require("node:http");
const { pathToFileURL } = require("node:url");
const root = path.resolve(__dirname, "..");
const output = path.join(root, "test-results");
const checks = [],
  errors = [];

async function launchBrowser() {
  const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH;
  if (executablePath)
    return chromium.launch({ headless: true, executablePath });
  try {
    return await chromium.launch({
      headless: true,
      channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
    });
  } catch {
    return chromium.launch({ headless: true });
  }
}
function watchErrors(page) {
  page.on("pageerror", (error) => errors.push(error.message));
}
async function answerQuestion(
  page,
  { wrong = false, keyboard = false, focusQuestion = true } = {},
) {
  const index = await page.evaluate(
    () => state.pool[state.index].correctAnswer,
  );
  if (keyboard) {
    if (focusQuestion) await page.locator("#question").focus();
    await page.keyboard.press(String((wrong ? (index + 1) % 4 : index) + 1));
  } else
    await page
      .locator("#options button")
      .nth(wrong ? (index + 1) % 4 : index)
      .click();
  assert.equal(await page.locator("#feedback").isVisible(), true);
}
async function finishQuiz(page) {
  let questions = 0;
  while (await page.locator("#play").isVisible()) {
    if (!(await page.evaluate(() => state.answered)))
      await answerQuestion(page);
    await page.locator("#next").click();
    assert.ok(++questions <= 200, "quiz must finish");
  }
  assert.equal(await page.locator("#result").isVisible(), true);
}
async function download(page, selector, target) {
  const ready = page.waitForEvent("download");
  await page.locator(selector).click();
  const file = await ready;
  await file.saveAs(target);
  assert.equal(await file.failure(), null);
}
async function noOverflow(page, width) {
  await page.setViewportSize({ width, height: 960 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
    true,
    `no horizontal overflow at ${width}px`,
  );
}
function startServer() {
  const types = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    ".png": "image/png",
  };
  const server = http.createServer((request, response) => {
    const pathname = new URL(request.url, "http://localhost").pathname;
    if (pathname === "/teacher_report.html") {
      const reports = require("../reports.js");
      response.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
      response.end(reports.html(reports.aggregate([]), "en"));
      return;
    }
    const target = path.resolve(
      root,
      "." + decodeURIComponent(pathname === "/" ? "/index.html" : pathname),
    );
    if (
      !target.startsWith(root + path.sep) ||
      !fs.existsSync(target) ||
      !fs.statSync(target).isFile()
    ) {
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200, {
      "Content-Type":
        (types[path.extname(target)] || "application/octet-stream") +
        ";charset=utf-8",
    });
    fs.createReadStream(target).pipe(response);
  });
  return new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () => resolve(server)),
  );
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  fs.mkdirSync(path.join(root, "docs"), { recursive: true });
  const browser = await launchBrowser();
  let server;
  try {
    const context = await browser.newContext({
      acceptDownloads: true,
      viewport: { width: 1440, height: 1080 },
    });
    const page = await context.newPage();
    watchErrors(page);
    await page.goto(pathToFileURL(path.join(root, "index.html")).href);
    assert.equal(await page.locator("html").getAttribute("lang"), "ko");
    assert.equal(
      await page.locator("#questionCount").innerText(),
      String(require("../questions.js").length),
    );
    await page.screenshot({
      path: path.join(output, "desktop-ko.png"),
      fullPage: true,
    });
    await page.locator("#language").selectOption("en");
    assert.equal(await page.locator("#start").innerText(), "Start a quiz");
    assert.equal(
      await page.locator("#category option").first().getAttribute("value"),
      "한국사",
    );
    await page.reload();
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    await page.locator("#profileName").fill("Practice learner");
    await page.locator("#saveProfile").click();
    assert.match(
      await page.locator("#accountStatus").innerText(),
      /Profile saved/,
    );
    checks.push(
      "file:// loading; KO/EN controls; language persistence; profile save",
    );

    await page.locator("#start").click();
    const englishQuestion = await page.locator("#question").innerText();
    assert.equal(
      englishQuestion,
      await page.evaluate(
        () =>
          quizQuestionsEN.find((q) => q.id === state.pool[state.index].id)
            .question,
      ),
    );
    await page.locator("#language").selectOption("ko");
    assert.notEqual(
      await page.locator("#question").innerText(),
      englishQuestion,
    );
    await page.locator("#language").selectOption("en");
    assert.equal(await page.locator("#question").innerText(), englishQuestion);
    await page.locator("#home").focus();
    await answerQuestion(page, { keyboard: true, focusQuestion: false });
    await page.locator("#question").focus();
    await page.keyboard.press("1");
    assert.equal(await page.locator("#score").innerText(), "10 pts");
    assert.equal(await page.evaluate(() => state.answers.length), 1);
    await page.locator("#language").selectOption("ko");
    assert.match(await page.locator("#verdict").innerText(), /정답/);
    await page.locator("#language").selectOption("en");
    assert.match(await page.locator("#verdict").innerText(), /Correct/);
    await page.locator("#question").focus();
    await page.keyboard.press("Enter");
    await page.locator("#hint").click();
    assert.equal(await page.locator("#options button:disabled").count(), 2);
    assert.equal(await page.locator("#hintText").isVisible(), true);
    await answerQuestion(page, { keyboard: true, focusQuestion: false });
    assert.equal(await page.locator("#score").innerText(), "15 pts");
    await page.locator("#next").focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.evaluate(() => state.index), 2);
    await answerQuestion(page, { wrong: true });
    await page.locator("#next").click();
    await finishQuiz(page);
    assert.match(
      await page.locator("#summary").innerText(),
      /85 pts.*9\/10.*90%/,
    );
    assert.equal(await page.locator("#review details").count(), 1);
    assert.equal(await page.evaluate(() => dataManager.records().length), 1);
    await page.locator("#language").selectOption("ko");
    assert.match(await page.locator("#summary").innerText(), /정답률 90%/);
    await page.locator("#language").selectOption("en");
    assert.match(await page.locator("#summary").innerText(), /90% accuracy/);
    checks.push(
      "live question/feedback/result translation; keyboard; duplicate scoring; hint elimination and score; completion and review",
    );

    await page.locator("#retryWrong").click();
    assert.match(await page.locator("#position").innerText(), /1 \/ 1/);
    await answerQuestion(page);
    await page.locator("#next").click();
    await page.locator("#restart").click();
    assert.equal(
      await page.evaluate(() => dataManager.missedQuestionIds().length),
      0,
    );
    assert.match(
      await page.locator("#personalStats").innerText(),
      /2 attempts/,
    );
    assert.match(
      await page.locator("#learningDashboard").innerText(),
      /Attempts.*Accuracy/s,
    );
    await page.locator('[data-mode="review"]').click();
    await page.locator("#start").click();
    assert.equal(await page.locator("#setup").isVisible(), true);
    assert.match(
      await page.locator("#sessionNote").innerText(),
      /No missed questions/,
    );

    await page.locator('[data-mode="category"]').click();
    await page.locator("#category").selectOption("과학");
    await page.locator("#difficulty").selectOption("easy");
    await page.locator("#sessionLength").selectOption("20");
    await page.locator("#start").click();
    assert.equal(
      await page.evaluate(
        () =>
          state.pool.every(
            (q) => q.category === "과학" && q.difficulty === "easy",
          ) &&
          state.pool.length > 0 &&
          state.pool.length <= 20,
      ),
      true,
    );
    await page.locator("#home").click();
    await page.locator('[data-mode="daily"]').click();
    assert.equal(await page.locator("#difficulty").isDisabled(), true);
    await page.locator("#start").click();
    const daily = await page.evaluate(() =>
      JSON.stringify(state.pool.map((q) => [q.id, q.optionOrder])),
    );
    assert.match(await page.locator("#position").innerText(), /1 \/ 10/);
    await page.locator("#home").click();
    await page.locator("#start").click();
    assert.equal(
      await page.evaluate(() =>
        JSON.stringify(state.pool.map((q) => [q.id, q.optionOrder])),
      ),
      daily,
    );
    await page.locator("#home").click();
    await page.locator('[data-mode="speed"]').click();
    await page.locator("#start").click();
    await page.waitForFunction(() => state.answered, null, { timeout: 20000 });
    assert.match(await page.locator("#verdict").innerText(), /Time's up/);
    assert.equal(await page.locator("#score").innerText(), "0 pts");
    await page.locator("#next").click();
    assert.match(await page.locator("#timer").innerText(), /^15s$/);
    await page.locator("#home").click();
    checks.push(
      "missed-question retry/removal; dashboard; category/difficulty/length filters; stable daily set; real 15-second timeout and restart",
    );

    const exported = path.join(output, "records.json");
    await download(page, "#exportRecords", exported);
    const snapshot = JSON.parse(fs.readFileSync(exported, "utf8"));
    assert.equal(snapshot.records.length, 2);
    assert.equal(snapshot.profile.name, "Practice learner");
    const restoreChooser = page.waitForEvent("filechooser");
    await page
      .locator(".file-label")
      .filter({ has: page.locator("#importRecords") })
      .locator(".file-prompt")
      .click();
    await (await restoreChooser).setFiles(exported);
    await page.waitForFunction(() =>
      document.getElementById("accountStatus").textContent.includes("merged"),
    );
    assert.equal(await page.evaluate(() => dataManager.records().length), 2);
    const before = await page.evaluate(() =>
      localStorage.getItem("quizlab-records"),
    );
    await page.locator("#importRecords").setInputFiles({
      name: "invalid.json",
      mimeType: "application/json",
      buffer: Buffer.from('{"profile":{},"records":[{}]}'),
    });
    await page.waitForFunction(() =>
      document.getElementById("accountStatus").textContent.includes("failed"),
    );
    assert.equal(
      await page.evaluate(() => localStorage.getItem("quizlab-records")),
      before,
    );

    await page.locator(".teacher-link").click();
    assert.equal(await page.locator("#teacherTools").getAttribute("open"), "");
    const teacherChooser = page.waitForEvent("filechooser");
    await page
      .locator(".file-label")
      .filter({ has: page.locator("#teacherFiles") })
      .locator(".file-prompt")
      .click();
    await (await teacherChooser).setFiles(exported);
    await page.waitForFunction(
      () => !document.getElementById("teacherDownload").disabled,
    );
    assert.match(
      await page.locator("#teacherStatus").innerText(),
      /1 students.*2 attempts/,
    );
    await page.frameLocator("#teacherPreview").locator("body").waitFor();
    assert.match(
      await page.frameLocator("#teacherPreview").locator("body").innerText(),
      /teacher/i,
    );
    const teacherHTML = path.join(output, "teacher-report.html"),
      csv = path.join(output, "teacher-report.csv");
    await download(page, "#teacherDownload", teacherHTML);
    await download(page, "#teacherCSV", csv);
    assert.match(fs.readFileSync(teacherHTML, "utf8"), /<html lang="en"/);
    assert.match(fs.readFileSync(csv, "utf8"), /Practice learner/);
    await page.locator("#language").selectOption("ko");
    await page.waitForFunction(() =>
      document
        .getElementById("teacherPreview")
        .srcdoc.includes('<html lang="ko"'),
    );
    await page.locator("#language").selectOption("en");
    const priorReport = await page
      .locator("#teacherPreview")
      .getAttribute("srcdoc");
    await page.locator("#teacherFiles").setInputFiles({
      name: "invalid.json",
      mimeType: "application/json",
      buffer: Buffer.from('{"records":"invalid"}'),
    });
    await page.waitForFunction(() =>
      document
        .getElementById("teacherStatus")
        .textContent.includes("Import failed"),
    );
    assert.equal(
      await page.locator("#teacherPreview").getAttribute("srcdoc"),
      priorReport,
    );
    assert.equal(await page.evaluate(() => dataManager.records().length), 2);
    checks.push(
      "JSON export and deduplicated restore; invalid restore preserves data; teacher bilingual preview/HTML/CSV; invalid import preserves prior report",
    );

    await page.locator("#teacherTools").evaluate((node) => (node.open = false));
    for (const width of [390, 768, 1440]) await noOverflow(page, width);
    await page.screenshot({
      path: path.join(output, "desktop-en.png"),
      fullPage: true,
    });
    await noOverflow(page, 390);
    await page.screenshot({
      path: path.join(output, "mobile-en.png"),
      fullPage: true,
    });
    await page.reload();
    assert.equal(await page.evaluate(() => dataManager.records().length), 2);
    assert.equal(
      await page.locator("#profileName").inputValue(),
      "Practice learner",
    );
    checks.push(
      "390/768/1440px layouts; records and profile persist after reload",
    );

    // A separate, empty browser context keeps the public README screenshot free of records.
    const clean = await browser.newContext({
      viewport: { width: 1440, height: 1080 },
    });
    const preview = await clean.newPage();
    watchErrors(preview);
    await preview.goto(pathToFileURL(path.join(root, "index.html")).href);
    await preview.locator("#language").selectOption("en");
    await preview.screenshot({
      path: path.join(root, "docs", "preview.png"),
      fullPage: true,
    });
    await clean.close();

    server = await startServer();
    const hosted = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const hostedPage = await hosted.newPage();
    watchErrors(hostedPage);
    await hostedPage.goto(`http://127.0.0.1:${server.address().port}/`);
    await hostedPage.locator("#language").selectOption("en");
    await hostedPage.locator("#start").click();
    await answerQuestion(hostedPage);
    assert.equal(await hostedPage.locator("#score").innerText(), "10 pts");
    await hostedPage.locator("#home").click();
    await hostedPage.goto(
      `http://127.0.0.1:${server.address().port}/teacher_report.html`,
    );
    assert.equal(await hostedPage.locator("html").getAttribute("lang"), "en");
    assert.match(
      await hostedPage.locator("body").innerText(),
      /No student records|No imported|No records/i,
    );
    await hosted.close();
    checks.push("HTTP hosting and clean standalone teacher report");
    assert.deepEqual(errors, []);
    fs.writeFileSync(
      path.join(output, "browser-results.json"),
      JSON.stringify({ status: "PASS", checks, errors }, null, 2),
    );
    console.log(
      `PASS: ${checks.length} browser workflow groups; file:// and HTTP; isolated browser data only`,
    );
    await context.close();
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
