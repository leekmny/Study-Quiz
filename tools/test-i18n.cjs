"use strict";
const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  vm = require("node:vm"),
  path = require("node:path");
const sourcePath = path.join(__dirname, "..", "i18n.js");
assert.ok(fs.existsSync(sourcePath), "language switching must be implemented");
const saved = new Map(),
  listeners = [],
  nodes = [
    { dataset: { i18n: "start" }, textContent: "" },
    {
      dataset: { i18nPlaceholder: "namePlaceholder" },
      setAttribute(k, v) {
        this[k] = v;
      },
    },
  ];
const document = {
  documentElement: { lang: "ko" },
  title: "",
  querySelectorAll: () => nodes,
  getElementById: () => null,
  dispatchEvent: (e) => listeners.push(e.type),
};
const ctx = {
  document,
  localStorage: {
    getItem: (k) => saved.get(k),
    setItem: (k, v) => saved.set(k, v),
  },
  CustomEvent: class {
    constructor(type) {
      this.type = type;
    }
  },
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(sourcePath, "utf8"), ctx);
vm.runInContext("I18n.setLanguage('en')", ctx);
assert.equal(document.documentElement.lang, "en");
assert.equal(nodes[0].textContent, "Start a quiz");
assert.equal(nodes[1].placeholder, "Your name");
assert.equal(saved.get("quizlab-language"), "en");
assert.ok(listeners.includes("languagechange"));
assert.equal(vm.runInContext("I18n.category('한국사')", ctx), "Korean history");
assert.equal(vm.runInContext("I18n.difficulty('hard')", ctx), "Advanced");
assert.match(vm.runInContext("I18n.t('score',{score:15})", ctx), /15/);
vm.runInContext("I18n.setLanguage('bad')", ctx);
assert.equal(document.documentElement.lang, "ko");
console.log(
  "PASS: language switching translates text/attributes/categories and persists preference",
);
