import { answerCurrentQuestion, createQuizSession, getCurrentQuestion } from "../domain/quiz-session.js";
import { completeLevel, recordAnswer, recordWrongQuestion } from "../domain/progress.js";
import { playSound } from "../audio/sounds.js";

const subjectNames = {
  chinese: "语文",
  math: "数学",
  english: "英语",
  science: "科学/常识",
  history: "三国历史"
};

const byId = (items, id) => items.find((item) => item.id === id);

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const questionMap = (questions) => new Map(questions.map((question) => [question.id, question]));

const percent = (stat) => {
  if (!stat || stat.total === 0) return "0%";
  return `${Math.round((stat.correct / stat.total) * 100)}%`;
};

export const renderApp = (root, state, actions) => {
  root.innerHTML = layoutForRoute(state);
  bindEvents(root, state, actions);
};

const layoutForRoute = (state) => {
  if (state.route.name === "quiz") return renderQuiz(state);
  if (state.route.name === "result") return renderResult(state);
  if (state.route.name === "warriors") return renderWarriors(state);
  if (state.route.name === "parent") return renderParentGate();
  if (state.route.name === "parent-stats") return renderParentStats(state);
  return renderMap(state);
};

const renderMap = (state) => `
  <main class="app-shell map-shell">
    <header class="topbar">
      <div>
        <p class="eyebrow">三国知识闯关</p>
        <h1>小将军地图</h1>
      </div>
      <nav class="top-actions" aria-label="主要入口">
        <button data-action="warriors">武将图鉴</button>
        <button data-action="parent">家长统计</button>
      </nav>
    </header>
    <section class="notice">今天建议闯 1-2 关，保持轻松学习。</section>
    <section class="map-grid">
      ${state.levels.map((level) => renderLevelNode(level, state)).join("")}
    </section>
  </main>
`;

const renderLevelNode = (level, state) => {
  const locked = level.order > state.progress.unlockedLevel;
  const completed = state.progress.completedLevels.includes(level.id);
  const warrior = byId(state.warriors, level.unlockWarriorId);
  return `
    <article class="level-node ${locked ? "is-locked" : ""} ${completed ? "is-complete" : ""}">
      <span class="flag">第 ${level.order} 关</span>
      <h2>${escapeHtml(level.title)}</h2>
      <p>${escapeHtml(level.description)}</p>
      <p class="reward">奖励：${escapeHtml(warrior.name)}卡</p>
      <button data-action="start-level" data-level-id="${level.id}" ${locked ? "disabled" : ""}>
        ${locked ? "未解锁" : completed ? "再玩一次" : "开始闯关"}
      </button>
    </article>
  `;
};

const renderQuiz = (state) => {
  const question = getCurrentQuestion(state.activeSession);
  if (!question) {
    return `<main class="app-shell"><section class="panel">题目已完成。</section></main>`;
  }

  return `
    <main class="app-shell quiz-shell">
      <section class="panel quiz-card">
        <p class="eyebrow">第 ${state.activeSession.currentIndex + 1} / ${state.activeSession.questions.length} 题 · ${subjectNames[question.subject]}</p>
        <h1>${escapeHtml(question.prompt)}</h1>
        <div class="option-grid">
          ${question.options.map((option, index) => `
            <button class="option-button" data-action="answer" data-answer-index="${index}">
              ${escapeHtml(option)}
            </button>
          `).join("")}
        </div>
        ${state.activeSession.retryQuestionId ? `<p class="feedback">再想想，还有一次机会。</p>` : ""}
      </section>
    </main>
  `;
};

const renderResult = (state) => {
  const result = state.lastResult;
  const warrior = byId(state.warriors, result.warriorId);
  return `
    <main class="app-shell">
      <section class="panel result-card">
        <p class="eyebrow">通关成功</p>
        <h1>解锁 ${escapeHtml(warrior.name)}</h1>
        <div class="warrior-avatar large-avatar">${escapeHtml(warrior.name.slice(0, 1))}</div>
        <p>${escapeHtml(warrior.trait)}：${escapeHtml(warrior.description)}</p>
        <p>本关答对 ${result.correctCount} / ${result.totalCount} 题。</p>
        <div class="action-row">
          <button data-action="map">返回地图</button>
          <button data-action="warriors">查看图鉴</button>
        </div>
      </section>
    </main>
  `;
};

const renderWarriors = (state) => `
  <main class="app-shell">
    <header class="topbar">
      <div>
        <p class="eyebrow">武将图鉴</p>
        <h1>已收集 ${state.progress.unlockedWarriors.length} / ${state.warriors.length}</h1>
      </div>
      <button data-action="map">返回地图</button>
    </header>
    <section class="warrior-grid">
      ${state.warriors.map((warrior) => {
        const unlocked = state.progress.unlockedWarriors.includes(warrior.id);
        return `
          <article class="warrior-card ${unlocked ? "" : "is-locked"}">
            <div class="warrior-avatar">${unlocked ? escapeHtml(warrior.name.slice(0, 1)) : "?"}</div>
            <h2>${unlocked ? escapeHtml(warrior.name) : "未解锁"}</h2>
            <p>${unlocked ? `${escapeHtml(warrior.trait)}：${escapeHtml(warrior.description)}` : "继续闯关收集武将卡。"}</p>
          </article>
        `;
      }).join("")}
    </section>
  </main>
`;

const renderParentGate = () => `
  <main class="app-shell">
    <section class="panel parent-gate">
      <p class="eyebrow">家长统计</p>
      <h1>请输入 4 位口令</h1>
      <input inputmode="numeric" maxlength="4" class="passcode-input" aria-label="家长口令" />
      <div class="action-row">
        <button data-action="check-passcode">进入</button>
        <button data-action="map">返回</button>
      </div>
      <p class="feedback" data-passcode-message></p>
    </section>
  </main>
`;

const renderParentStats = (state) => `
  <main class="app-shell">
    <header class="topbar">
      <div>
        <p class="eyebrow">家长统计</p>
        <h1>学习记录</h1>
      </div>
      <button data-action="map">返回地图</button>
    </header>
    <section class="stats-grid">
      ${Object.entries(state.progress.subjectStats).map(([subject, stat]) => `
        <article class="stat-card">
          <strong>${subjectNames[subject]}</strong>
          <span>${percent(stat)}</span>
          <small>${stat.correct} / ${stat.total}</small>
        </article>
      `).join("")}
    </section>
    <section class="panel stacked-panel">
      <h2>最近通关</h2>
      ${state.progress.recentCompletions.length === 0 ? "<p>还没有通关记录。</p>" : state.progress.recentCompletions.map((item) => {
        const level = byId(state.levels, item.levelId);
        return `<p>第 ${item.levelOrder} 关 ${escapeHtml(level?.title ?? "")}，${new Date(item.completedAt).toLocaleString()}</p>`;
      }).join("")}
    </section>
    <section class="panel stacked-panel">
      <h2>错题记录</h2>
      ${state.progress.wrongQuestions.length === 0 ? "<p>还没有错题。</p>" : state.progress.wrongQuestions.map((item) => `
        <article class="wrong-item">
          <strong>${escapeHtml(item.prompt)}</strong>
          <p>错误答案：${escapeHtml(item.selectedAnswer)}</p>
          <p>正确答案：${escapeHtml(item.correctAnswer)}</p>
          <p>${escapeHtml(item.explanation)}</p>
        </article>
      `).join("")}
    </section>
  </main>
`;

const bindEvents = (root, state, actions) => {
  root.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;

    if (action === "map") actions.navigate({ name: "map" });
    if (action === "warriors") actions.navigate({ name: "warriors" });
    if (action === "parent") actions.navigate({ name: "parent" });

    if (action === "start-level") {
      const level = byId(state.levels, target.dataset.levelId);
      const questionsById = questionMap(state.questions);
      const levelQuestions = level.questions.map((questionId) => questionsById.get(questionId));
      const activeSession = createQuizSession(level.id, levelQuestions);
      actions.updateSession(activeSession);
      actions.navigate({ name: "quiz", levelId: level.id });
    }

    if (action === "answer") {
      handleAnswer(Number(target.dataset.answerIndex), state, actions);
    }

    if (action === "check-passcode") {
      const input = root.querySelector(".passcode-input");
      const message = root.querySelector("[data-passcode-message]");
      if (input.value === state.progress.parentPasscode) {
        actions.navigate({ name: "parent-stats" });
      } else {
        message.textContent = "口令不正确。";
      }
    }
  });
};

const handleAnswer = (selectedIndex, state, actions) => {
  const beforeQuestion = getCurrentQuestion(state.activeSession);
  const result = answerCurrentQuestion(state.activeSession, selectedIndex);

  if (result.feedback === "retry") {
    playSound("wrong", state.progress.soundEnabled);
    actions.updateSession(result.session);
    return;
  }

  playSound(result.feedback === "wrong" ? "wrong" : "correct", state.progress.soundEnabled);
  let progress = recordAnswer(state.progress, beforeQuestion.subject, result.feedback !== "wrong");

  if (result.feedback === "wrong") {
    const answer = result.session.answers[result.session.answers.length - 1];
    progress = recordWrongQuestion(progress, {
      questionId: beforeQuestion.id,
      levelId: state.activeSession.levelId,
      subject: beforeQuestion.subject,
      prompt: beforeQuestion.prompt,
      selectedAnswer: answer.selectedAnswer,
      correctAnswer: answer.correctAnswer,
      explanation: beforeQuestion.explanation,
      answeredAt: new Date().toISOString()
    });
  }

  if (result.session.currentIndex >= result.session.questions.length) {
    const level = byId(state.levels, state.activeSession.levelId);
    const correctCount = result.session.answers.filter((answer) => answer.isCorrect).length;
    progress = completeLevel(progress, {
      levelId: level.id,
      levelOrder: level.order,
      warriorId: level.unlockWarriorId,
      completedAt: new Date().toISOString()
    });
    playSound("complete", progress.soundEnabled);
    actions.finishLevel({
      levelId: level.id,
      warriorId: level.unlockWarriorId,
      correctCount,
      totalCount: result.session.questions.length
    }, progress);
    return;
  }

  actions.updateProgress(progress);
  actions.updateSession(result.session);
};
