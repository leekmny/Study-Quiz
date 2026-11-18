const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const ko = require(path.join(root, 'questions.js'));
assert.ok(ko.length >= 100, 'Expanded bank should offer at least 100 questions');
assert.equal(new Set(ko.map(q => q.id)).size, ko.length, 'IDs must be unique');
const enPath = path.join(root, 'questions-en.js');
assert.ok(fs.existsSync(enPath), 'English question bank must be available offline');
const en = require(enPath);
assert.equal(en.length, ko.length, 'Every question needs an English translation');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(enPath, 'utf8'), context);
assert.equal(vm.runInContext('quizQuestionsEN.length', context), ko.length);
const categories = new Set(['한국사', '과학', '지리', '예술과 문화']);
for (const q of ko) {
  const translated = en.find(item => item.id === q.id);
  assert.ok(translated, `Missing translation: ${q.id}`);
  assert.ok(categories.has(q.category), `Unknown category: ${q.id}`);
  assert.ok(['easy', 'medium', 'hard'].includes(q.difficulty));
  assert.equal(translated.category, q.category);
  assert.equal(translated.difficulty, q.difficulty);
  assert.equal(translated.correctAnswer, q.correctAnswer, `Answer moved in translation: ${q.id}`);
  assert.ok(Array.isArray(q.sources) && q.sources.length > 0, `Missing answer source: ${q.id}`);
  assert.match(q.verifiedAt || '', /^\d{4}-\d{2}-\d{2}$/, `Missing source review date: ${q.id}`);
  assert.deepEqual(translated.sources, q.sources, `Source references differ by language: ${q.id}`);
  assert.equal(translated.verifiedAt, q.verifiedAt, `Source review date differs by language: ${q.id}`);
  assert.ok(Number.isInteger(q.correctAnswer) && q.correctAnswer >= 0 && q.correctAnswer < 4);
  for (const item of [q, translated]) {
    assert.equal(item.options.length, 4, `Expected four choices: ${q.id}`);
    assert.equal(new Set(item.options).size, 4, `Duplicate choices: ${q.id}`);
    for (const field of ['question', 'explanation', 'hint']) {
      assert.ok(typeof item[field] === 'string' && item[field].trim(), `Missing ${field}: ${q.id}`);
    }
  }
  assert.ok(!/[가-힣]/u.test([translated.question, translated.explanation, translated.hint, ...translated.options].join(' ')), `Untranslated Korean text: ${q.id}`);
  if (q.id > 52) {
    assert.ok(q.sources.length >= 2, `New question needs two references: ${q.id}`);
    for (const url of q.sources) assert.equal(new URL(url).protocol, 'https:');
  }
}
for (const category of categories) {
  assert.ok(ko.filter(q => q.category === category).length >= 20, `Insufficient category coverage: ${category}`);
}
console.log(`PASS: ${ko.length} Korean questions, ${en.length} English translations, four categories, valid choices and reference metadata.`);
