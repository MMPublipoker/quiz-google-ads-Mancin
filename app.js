// La banca v2 cambia contenuti e indici: non riutilizzare i tentativi della banca precedente.
const STORAGE_KEY = "google-ads-quiz-tool-state-v2";
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

function createDefaultState(started = false) {
  return {
    currentQuestionIndex: 0,
    answers: new Array(QUIZ_SIZE).fill(null),
    questionOrder: createQuestionOrder(),
    started,
    finished: false,
  };
}

function createQuestionOrder() {
  const indices = questionBank.map((_, index) => index);

  for (let index = indices.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [indices[index], indices[swapIndex]] = [indices[swapIndex], indices[index]];
  }

  return indices.slice(0, QUIZ_SIZE);
}

function isValidQuestionOrder(order) {
  if (!Array.isArray(order) || order.length !== QUIZ_SIZE) {
    return false;
  }

  const uniqueValues = new Set(order);
  if (uniqueValues.size !== QUIZ_SIZE) {
    return false;
  }

  return order.every((value) => Number.isInteger(value) && value >= 0 && value < questionBank.length);
}

function hydrateState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored) {
      return createDefaultState(false);
    }

    const answers = Array.isArray(stored.answers)
      ? stored.answers.slice(0, QUIZ_SIZE).map((value) => {
          return Number.isInteger(value) ? value : null;
        })
      : [];

    while (answers.length < QUIZ_SIZE) {
      answers.push(null);
    }

    return {
      currentQuestionIndex:
        typeof stored.currentQuestionIndex === "number" &&
        stored.currentQuestionIndex >= 0 &&
        stored.currentQuestionIndex < QUIZ_SIZE
          ? stored.currentQuestionIndex
          : 0,
      answers,
      questionOrder: isValidQuestionOrder(stored.questionOrder)
        ? stored.questionOrder.slice(0, QUIZ_SIZE)
        : createQuestionOrder(),
      started: Boolean(stored.started),
      finished: Boolean(stored.finished),
    };
  } catch (error) {
    return createDefaultState(false);
  }
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

function setAnswer(questionIndex, answerIndex) {
  state.answers[questionIndex] = answerIndex;
  persistState();
  renderQuestion();
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
    "Completa il quiz per valutare la tua preparazione. Al termine troverai il riepilogo delle risposte, una spiegazione per ogni domanda e il punteggio finale.";
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
  const answeredQuestions = state.answers.filter((answer) => answer !== null).length;
  const progressPercent = ((state.currentQuestionIndex + 1) / QUIZ_SIZE) * 100;

  dom.questionCounter.textContent = `Domanda ${state.currentQuestionIndex + 1} di ${QUIZ_SIZE}`;
  dom.questionTitle.textContent = "Seleziona la risposta corretta";
  dom.questionText.textContent = currentQuestion.question;
  dom.answeredCount.textContent = `${answeredQuestions}/${QUIZ_SIZE}`;
  dom.progressBar.style.width = `${progressPercent}%`;
  dom.answersForm.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    const label = document.createElement("label");
    label.className = "answer-option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = `question-${state.currentQuestionIndex}`;
    input.checked = selectedAnswer === index;
    input.addEventListener("change", () => setAnswer(state.currentQuestionIndex, index));

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
    return total + (state.answers[index] === question.correctAnswer ? 1 : 0);
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
    const userAnswerIndex = state.answers[index];
    const isCorrect = userAnswerIndex === question.correctAnswer;

    const card = document.createElement("article");
    card.className = `review-card ${isCorrect ? "is-correct" : "is-wrong"}`;

    const status = document.createElement("span");
    status.className = "review-status";
    status.textContent = isCorrect ? "Corretta" : "Da rivedere";

    const title = document.createElement("h4");
    title.textContent = `${index + 1}. ${question.question}`;

    const userAnswer = document.createElement("p");
    userAnswer.textContent =
      userAnswerIndex === null
        ? "La domanda non ha ricevuto risposta."
        : `La tua risposta: ${question.options[userAnswerIndex]}`;

    const correctAnswer = document.createElement("p");
    correctAnswer.textContent = `Risposta corretta: ${question.options[question.correctAnswer]}`;

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
