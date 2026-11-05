const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { runInNewContext } = require("node:vm");

const context = { window: {} };
runInNewContext(readFileSync(resolve(__dirname, "../questions.js"), "utf8"), context);
const bank = JSON.parse(JSON.stringify(context.window.questionBank));
const slideCounts = [83, 85, 54, 59, 58, 43];
const normalize = (text) => text.trim().toLocaleLowerCase("it").replace(/\s+/g, " ");

test("la banca contiene almeno 120 domande, distribuite sulle sei lezioni", () => {
  assert.ok(bank.length >= 120);
  assert.equal(new Set(bank.map((q) => q.module)).size, 6);
  for (let module = 1; module <= 6; module += 1) {
    assert.equal(bank.filter((q) => q.module === `Lezione ${module}`).length, 20);
  }
});

test("ogni domanda ha quattro opzioni distinte, risposta valida e spiegazione", () => {
  for (const [index, question] of bank.entries()) {
    const label = `Domanda ${index + 1}`;
    assert.equal(typeof question.question, "string", label);
    assert.ok(question.question.trim().length > 0, label);
    assert.equal(typeof question.explanation, "string", label);
    assert.ok(question.explanation.trim().length > 0, label);
    assert.ok(Array.isArray(question.options), label);
    assert.equal(question.options.length, 4, label);
    assert.ok(question.options.every((option) => typeof option === "string" && option.trim()), label);
    assert.equal(new Set(question.options.map(normalize)).size, 4, label);
    assert.ok(Number.isInteger(question.correctAnswer), label);
    assert.ok(question.correctAnswer >= 0 && question.correctAnswer < 4, label);
  }
});

test("non ci sono testi di domanda duplicati", () => {
  assert.equal(new Set(bank.map((q) => normalize(q.question))).size, bank.length);
});

test("i riferimenti rimandano a slide esistenti nella lezione indicata", () => {
  for (const question of bank) {
    assert.match(question.module, /^Lezione [1-6]$/);
    const module = Number(question.module.split(" ")[1]);
    assert.ok(Array.isArray(question.sourceSlides) && question.sourceSlides.length > 0);
    assert.equal(new Set(question.sourceSlides).size, question.sourceSlides.length);
    for (const slide of question.sourceSlides) {
      assert.ok(Number.isInteger(slide) && slide >= 1 && slide <= slideCounts[module - 1], question.question);
    }
  }
});

test("ogni lezione distribuisce equamente le risposte corrette tra A, B, C e D", () => {
  for (let module = 1; module <= 6; module += 1) {
    const counts = [0, 0, 0, 0];
    bank.filter((q) => q.module === `Lezione ${module}`).forEach((q) => counts[q.correctAnswer] += 1);
    assert.deepEqual(counts, [5, 5, 5, 5]);
  }
});
