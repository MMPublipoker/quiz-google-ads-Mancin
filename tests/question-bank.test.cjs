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
    assert.ok(Array.isArray(question.correctAnswers) && question.correctAnswers.length > 0, label);
    assert.equal(new Set(question.correctAnswers).size, question.correctAnswers.length, label);
    assert.ok(question.correctAnswers.every((index) => Number.isInteger(index) && index >= 0 && index < 4), label);
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

test("ogni lezione contiene domande a selezione singola e multipla", () => {
  for (let module = 1; module <= 6; module += 1) {
    const questions = bank.filter((q) => q.module === `Lezione ${module}`);
    assert.ok(questions.some((q) => q.correctAnswers.length === 1));
    assert.ok(questions.some((q) => q.correctAnswers.length > 1));
  }
});

const { webcrypto } = require("node:crypto");
const appSource = readFileSync(resolve(__dirname, "../app.js"), "utf8");
const logic = appSource.slice(appSource.indexOf("function shuffleIndices"), appSource.indexOf("function persistState"));
const appContext = { window: { crypto: webcrypto }, questionBank: bank, QUIZ_SIZE: 20,
  STORAGE_KEY: "test", localStorage: { getItem: () => null } };
runInNewContext(logic, appContext);

test("le opzioni sono permutazioni valide e assumono tutte le posizioni", () => {
  const orders = new Set();
  const positions = new Set();
  for (let i = 0; i < 100; i++) {
    const order = appContext.shuffleIndices(4);
    assert.deepEqual(Array.from(order).sort(), [0, 1, 2, 3]);
    orders.add(order.join(","));
    positions.add(order.indexOf(0));
  }
  assert.ok(orders.size > 1);
  assert.equal(positions.size, 4);
});

test("il punteggio richiede tutte e soltanto le risposte corrette", () => {
  const question = { correctAnswers: [1, 3] };
  assert.equal(appContext.isCorrectSelection(question, [3, 1]), true);
  for (const selection of [[], [1], [3], [0, 1], [0, 1, 3], [0, 1, 2, 3]]) {
    assert.equal(appContext.isCorrectSelection(question, selection), false);
  }
});

test("il salvataggio conserva ordini e selezioni e scarta permutazioni corrotte", () => {
  const saved = JSON.parse(JSON.stringify(appContext.createDefaultState(true)));
  saved.answers[0] = [0];
  appContext.localStorage.getItem = () => JSON.stringify(saved);
  assert.equal(JSON.stringify(appContext.hydrateState()), JSON.stringify(saved));
  saved.optionOrders[0] = [0, 0, 2, 3];
  assert.equal(appContext.hydrateState().started, false);
  saved.currentQuestionIndex = 0.5;
  assert.equal(appContext.hydrateState().started, false);
});
