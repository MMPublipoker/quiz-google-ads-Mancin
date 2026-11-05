// La banca v3 usa selezioni multiple e ordini delle opzioni salvati per tentativo.
const STORAGE_KEY = "google-ads-quiz-tool-state-v3";
const QUIZ_SIZE = 20;
const questionBank = Array.isArray(window.questionBank) ? window.questionBank : [];

if (questionBank.length < QUIZ_SIZE) {
  throw new Error("La banca domande deve contenere almeno 20 domande.");
}

const dom = {
  startButton: document.querySelector("#start-quiz"),
  resetButton: document.querySelector("#reset-progress"),
  prevButton: document.querySelector("#prev-button"),
  nextButton: document.querySelector("#next-button"),
  restartButton: document.querySelector("#restart-quiz"),
  quizScreen: document.querySelector("#quiz-screen"),
  resultScreen: document.querySelector("#result-screen"),
  questionCounter: document.querySelector("#question-counter"),
  questionTitle: document.querySelector("#question-title"),
  questionText: document.querySelector("#question-text"),
  answersForm: document.querySelector("#answers-form"),
  progressBar: document.querySelector("#progress-bar"),
  answeredCount: document.querySelector("#answered-count"),
  resultSummary: document.querySelector("#result-summary"),
  correctCount: document.querySelector("#correct-count"),
  finalScore: document.querySelector("#final-score"),
  finalPercent: document.querySelector("#final-percent"),
  reviewList: document.querySelector("#review-list"),
};

const state = hydrateState();

bootstrap();

function bootstrap() {
  dom.startButton.addEventListener("click", startQuiz);
  dom.resetButton.addEventListener("click", resetProgress);
  dom.prevButton.addEventListener("click", goToPreviousQuestion);
  dom.nextButton.addEventListener("click", handleNextButton);
  dom.restartButton.addEventListener("click", restartQuiz);

  render();
}

function shuffleIndices(length) {
  const indices = Array.from({ length }, (_, index) => index);
  for (let index = length - 1; index > 0; index -= 1) {
    // Rejection sampling avoids bias when reducing random integers to a range.
    const range = index + 1;
    const limit = 2 ** 32 - (2 ** 32 % range);
    const random = new Uint32Array(1);
    do { window.crypto.getRandomValues(random); } while (random[0] >= limit);
    const swapIndex = random[0] % range;
    [indices[index], indices[swapIndex]] = [indices[swapIndex], indices[index]];
  }
  return indices;
}

function createDefaultState(started = false) {
  const questionOrder = shuffleIndices(questionBank.length).slice(0, QUIZ_SIZE);
  return {
    currentQuestionIndex: 0,
    answers: Array.from({ length: QUIZ_SIZE }, () => []),
    questionOrder,
    optionOrders: questionOrder.map((index) => shuffleIndices(questionBank[index].options.length)),
    started,
    finished: false,
  };
}

function isPermutation(order, length) {
  return Array.isArray(order) && order.length === length &&
    new Set(order).size === length &&
    order.every((index) => Number.isInteger(index) && index >= 0 && index < length);
}

function hydrateState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored || !Array.isArray(stored.questionOrder) ||
        stored.questionOrder.length !== QUIZ_SIZE ||
        new Set(stored.questionOrder).size !== QUIZ_SIZE ||
        !stored.questionOrder.every((index) => Number.isInteger(index) && index >= 0 && index < questionBank.length) ||
        !Array.isArray(stored.optionOrders) || stored.optionOrders.length !== QUIZ_SIZE ||
        !stored.optionOrders.every((order, index) => isPermutation(order, questionBank[stored.questionOrder[index]].options.length)) ||
        !Array.isArray(stored.answers) || stored.answers.length !== QUIZ_SIZE ||
        !stored.answers.every((answers, index) => {
          const question = questionBank[stored.questionOrder[index]];
          return Array.isArray(answers) && new Set(answers).size === answers.length &&
            (question.correctAnswers.length > 1 || answers.length <= 1) &&
            answers.every((answer) => Number.isInteger(answer) && answer >= 0 && answer < question.options.length);
        }) || !Number.isInteger(stored.currentQuestionIndex) ||
        stored.currentQuestionIndex < 0 || stored.currentQuestionIndex >= QUIZ_SIZE) {
      return createDefaultState(false);
    }
    return {
      currentQuestionIndex: stored.currentQuestionIndex,
      answers: stored.answers,
      questionOrder: stored.questionOrder,
      optionOrders: stored.optionOrders,
      started: Boolean(stored.started),
      finished: Boolean(stored.finished),
    };
  } catch (error) {
    return createDefaultState(false);
  }
}

function isCorrectSelection(question, answers) {
  return answers.length === question.correctAnswers.length &&
    question.correctAnswers.every((answer) => answers.includes(answer));
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Ignore storage failures and keep the quiz interactive.
  }
}

function getSessionQuestions() {
  return state.questionOrder.map((index) => questionBank[index]);
}

function startQuiz() {
  state.started = true;
  state.finished = false;
  state.currentQuestionIndex = 0;
  persistState();
  render();
}

function resetProgress() {
  Object.assign(state, createDefaultState(false));
  persistState();
  render();
}

function restartQuiz() {
  Object.assign(state, createDefaultState(true));
  persistState();
  render();
}

function goToPreviousQuestion() {
  if (state.currentQuestionIndex > 0) {
    state.currentQuestionIndex -= 1;
    persistState();
    render();
  }
}

function handleNextButton() {
  if (!state.started) {
    startQuiz();
    return;
  }

  if (state.currentQuestionIndex === QUIZ_SIZE - 1) {
    state.finished = true;
    persistState();
    render();
    return;
  }

  state.currentQuestionIndex += 1;
  persistState();
  render();
}

function setAnswer(questionIndex, answerIndex, checked) {
  const question = questionBank[state.questionOrder[questionIndex]];
  if (question.correctAnswers.length > 1) {
    const answers = new Set(state.answers[questionIndex]);
    if (checked) answers.add(answerIndex);
    else answers.delete(answerIndex);
    state.answers[questionIndex] = [...answers];
  } else {
    state.answers[questionIndex] = [answerIndex];
  }
  persistState();
  // Keep the focused input mounted for keyboard and screen reader users.
  dom.answeredCount.textContent = `${state.answers.filter((answers) => answers.length > 0).length}/${QUIZ_SIZE}`;
}

function render() {
  dom.quizScreen.classList.toggle("hidden", state.finished);
  dom.resultScreen.classList.toggle("hidden", !state.finished);

  if (state.finished) {
    renderResults();
  } else if (!state.started) {
    renderIntroState();
  } else {
    renderQuestion();
  }
}

function renderIntroState() {
  dom.questionCounter.textContent = "Quiz pronto";
  dom.questionTitle.textContent = "Pronto a iniziare?";
  dom.questionText.textContent =
    "Ogni domanda indica se selezionare una o più risposte. Vale un punto solo se selezioni tutte le risposte corrette e nessuna errata. Al termine troverai spiegazioni e riferimenti alle slide.";
  dom.answeredCount.textContent = `0/${QUIZ_SIZE}`;
  dom.progressBar.style.width = "0%";
  dom.answersForm.innerHTML = "";
  dom.prevButton.disabled = true;
  dom.nextButton.textContent = "Inizia test";
}

function renderQuestion() {
  const sessionQuestions = getSessionQuestions();
  const currentQuestion = sessionQuestions[state.currentQuestionIndex];
  const selectedAnswer = state.answers[state.currentQuestionIndex];
  const answeredQuestions = state.answers.filter((answers) => answers.length > 0).length;
  const progressPercent = ((state.currentQuestionIndex + 1) / QUIZ_SIZE) * 100;

  dom.questionCounter.textContent = `Domanda ${state.currentQuestionIndex + 1} di ${QUIZ_SIZE}`;
  const multiple = currentQuestion.correctAnswers.length > 1;
  dom.questionTitle.textContent = multiple
    ? "Seleziona tutte le risposte corrette"
    : "Seleziona una sola risposta";
  dom.questionText.textContent = currentQuestion.question;
  dom.answeredCount.textContent = `${answeredQuestions}/${QUIZ_SIZE}`;
  dom.progressBar.style.width = `${progressPercent}%`;
  dom.answersForm.innerHTML = "";

  state.optionOrders[state.currentQuestionIndex].forEach((optionIndex, index) => {
    const option = currentQuestion.options[optionIndex];
    const label = document.createElement("label");
    label.className = "answer-option";

    const input = document.createElement("input");
    input.type = multiple ? "checkbox" : "radio";
    input.name = `question-${state.currentQuestionIndex}`;
    input.checked = selectedAnswer.includes(optionIndex);
    input.addEventListener("change", () => setAnswer(state.currentQuestionIndex, optionIndex, input.checked));

    const card = document.createElement("span");
    card.className = "answer-card";

    const letter = document.createElement("span");
    letter.className = "answer-letter";
    letter.textContent = String.fromCharCode(65 + index);

    const text = document.createElement("p");
    text.className = "answer-text";
    text.textContent = option;

    card.append(letter, text);
    label.append(input, card);
    dom.answersForm.append(label);
  });

  dom.prevButton.disabled = state.currentQuestionIndex === 0;
  dom.nextButton.textContent = state.currentQuestionIndex === QUIZ_SIZE - 1 ? "Concludi test" : "Avanti";
}

function renderResults() {
  const sessionQuestions = getSessionQuestions();
  const correctAnswers = sessionQuestions.reduce((total, question, index) => {
    return total + (isCorrectSelection(question, state.answers[index]) ? 1 : 0);
  }, 0);
  const finalScore = Math.max(1, correctAnswers);
  const percentage = Math.round((correctAnswers / QUIZ_SIZE) * 100);

  dom.correctCount.textContent = `${correctAnswers}/${QUIZ_SIZE}`;
  dom.finalScore.textContent = `${finalScore}/20`;
  dom.finalPercent.textContent = `${percentage}%`;
  dom.resultSummary.textContent =
    correctAnswers >= 16
      ? "Ottimo lavoro: hai dimostrato una preparazione molto solida."
      : correctAnswers >= 11
        ? "Buona base: il risultato e' promettente e con un ultimo ripasso puoi migliorare ancora."
        : "Hai margine di crescita: usa il riepilogo qui sotto per individuare gli argomenti da ripassare.";

  renderReview(sessionQuestions);
}

function renderReview(sessionQuestions) {
  dom.reviewList.innerHTML = "";

  sessionQuestions.forEach((question, index) => {
    const selectedAnswers = state.answers[index];
    const isCorrect = isCorrectSelection(question, selectedAnswers);

    const card = document.createElement("article");
    card.className = `review-card ${isCorrect ? "is-correct" : "is-wrong"}`;

    const status = document.createElement("span");
    status.className = "review-status";
    status.textContent = isCorrect ? "Corretta" : "Da rivedere";

    const title = document.createElement("h4");
    title.textContent = `${index + 1}. ${question.question}`;

    const userAnswer = document.createElement("p");
    userAnswer.textContent =
      selectedAnswers.length === 0
        ? "La domanda non ha ricevuto risposta."
        : `Le tue risposte: ${state.optionOrders[index].filter((option) => selectedAnswers.includes(option)).map((option) => question.options[option]).join("; ")}`;

    const correctAnswer = document.createElement("p");
    correctAnswer.textContent = `Risposte corrette: ${state.optionOrders[index].filter((option) => question.correctAnswers.includes(option)).map((option) => question.options[option]).join("; ")}`;

    const moduleReference = document.createElement("p");
    moduleReference.className = "review-module";
    moduleReference.textContent = getModuleReviewLabel(question.module, question.sourceSlides);

    const explanation = document.createElement("p");
    explanation.textContent = question.explanation;

    card.append(status, title, userAnswer, correctAnswer, moduleReference, explanation);
    dom.reviewList.append(card);
  });
}

function getModuleReviewLabel(moduleLabel, sourceSlides) {
  const match = typeof moduleLabel === "string" ? moduleLabel.match(/(\d+)/) : null;

  if (match) {
    const slideReference = Array.isArray(sourceSlides) && sourceSlides.length > 0
      ? ` (slide ${sourceSlides.join(", ")})`
      : "";
    return `Ripassa questo concetto nel Modulo ${match[1]} del corso${slideReference}.`;
  }

  return "Ripassa questo concetto nel modulo dedicato del corso.";
}
