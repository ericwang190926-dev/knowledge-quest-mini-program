# 三国知识闯关小程序 V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a playable browser prototype for a third-grade 三国知识闯关 game, structured so it can later migrate to a WeChat mini program.

**Architecture:** Use a static Vite app with small JavaScript modules for data, game rules, storage, and rendering. Keep domain logic independent from the DOM so answer flow, unlocks, statistics, and wrong-question records can be tested directly.

**Tech Stack:** Vite, vanilla JavaScript ES modules, CSS, Vitest, browser `localStorage`, Web Audio API.

---

## File Structure

- Create: `package.json` - npm scripts and dependencies.
- Create: `index.html` - app shell and root mount node.
- Create: `src/main.js` - app bootstrap and route state.
- Create: `src/styles.css` - 三国小将军风 visual system and responsive layout.
- Create: `src/data/levels.js` - 12 level definitions.
- Create: `src/data/questions.js` - 120 built-in questions.
- Create: `src/data/warriors.js` - 12 warrior card definitions.
- Create: `src/domain/progress.js` - default progress, stats, unlock, wrong-question helpers.
- Create: `src/domain/quiz-session.js` - answer and retry state machine.
- Create: `src/storage/local-store.js` - localStorage wrapper with fallback behavior.
- Create: `src/audio/sounds.js` - lightweight generated sound effects.
- Create: `src/ui/render.js` - DOM rendering helpers for map, quiz, result, gallery, and parent stats screens.
- Create: `tests/progress.test.js` - progress and stats unit tests.
- Create: `tests/quiz-session.test.js` - answer/retry unit tests.
- Create: `tests/data-integrity.test.js` - confirms 12 levels, 10 questions each, and valid references.

## Task 1: Project Skeleton

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/styles.css`

- [ ] **Step 1: Create package metadata and scripts**

Create `package.json`:

```json
{
  "name": "knowledge-quest-mini-program",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1"
  },
  "devDependencies": {
    "@vitejs/plugin-legacy": "^5.4.3",
    "vite": "^5.4.19",
    "vitest": "^2.1.9"
  }
}
```

- [ ] **Step 2: Create the HTML shell**

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>三国知识闯关</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 3: Create temporary bootstrap files**

Create `src/main.js`:

```js
import "./styles.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="app-shell">
    <section class="panel">
      <p class="eyebrow">三国知识闯关</p>
      <h1>准备开始冒险</h1>
      <p>项目骨架已启动，下一步接入关卡和答题数据。</p>
    </section>
  </main>
`;
```

Create `src/styles.css`:

```css
:root {
  font-family: "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  color: #1f2933;
  background: #f8edd4;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

button,
input {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 24px;
  background:
    linear-gradient(180deg, rgba(255, 248, 224, 0.92), rgba(238, 201, 133, 0.84)),
    #f8edd4;
}

.panel {
  max-width: 920px;
  margin: 0 auto;
  padding: 24px;
  border: 2px solid #7b341e;
  border-radius: 8px;
  background: #fffaf0;
  box-shadow: 0 12px 28px rgba(77, 45, 20, 0.16);
}

.eyebrow {
  margin: 0 0 8px;
  color: #9b2c2c;
  font-weight: 700;
}
```

- [ ] **Step 4: Install dependencies**

Run: `npm install`

Expected: npm creates `package-lock.json` and installs Vite/Vitest successfully.

- [ ] **Step 5: Verify the skeleton**

Run: `npm run build`

Expected: build completes and outputs `dist/`.

## Task 2: Static Game Data

**Files:**
- Create: `src/data/levels.js`
- Create: `src/data/warriors.js`
- Create: `src/data/questions.js`
- Create: `tests/data-integrity.test.js`

- [ ] **Step 1: Write data integrity tests first**

Create `tests/data-integrity.test.js`:

```js
import { describe, expect, it } from "vitest";
import { levels } from "../src/data/levels.js";
import { questions } from "../src/data/questions.js";
import { warriors } from "../src/data/warriors.js";

describe("static game data", () => {
  it("defines 12 levels with 10 questions each", () => {
    expect(levels).toHaveLength(12);
    for (const level of levels) {
      expect(level.questions).toHaveLength(10);
    }
  });

  it("links every level to an existing warrior and existing questions", () => {
    const warriorIds = new Set(warriors.map((warrior) => warrior.id));
    const questionIds = new Set(questions.map((question) => question.id));

    for (const level of levels) {
      expect(warriorIds.has(level.unlockWarriorId)).toBe(true);
      for (const questionId of level.questions) {
        expect(questionIds.has(questionId)).toBe(true);
      }
    }
  });

  it("keeps question options and answers valid", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(question.answerIndex).toBeGreaterThanOrEqual(0);
      expect(question.answerIndex).toBeLessThan(4);
      expect(["chinese", "math", "english", "science", "history"]).toContain(question.subject);
      expect(question.explanation.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify missing data fails**

Run: `npm test -- tests/data-integrity.test.js`

Expected: FAIL because the data modules do not exist yet.

- [ ] **Step 3: Add warrior data**

Create `src/data/warriors.js` with 12 child-friendly warrior cards:

```js
export const warriors = [
  { id: "liubei", name: "刘备", faction: "蜀", trait: "仁义", unlockLevelId: "level-01", description: "重视朋友和百姓的领袖。" },
  { id: "guanyu", name: "关羽", faction: "蜀", trait: "守信", unlockLevelId: "level-02", description: "讲义气、守信用的勇将。" },
  { id: "zhangfei", name: "张飞", faction: "蜀", trait: "勇敢", unlockLevelId: "level-03", description: "声音洪亮、勇气十足。" },
  { id: "zhaoyun", name: "赵云", faction: "蜀", trait: "沉着", unlockLevelId: "level-04", description: "冷静又勇敢的将军。" },
  { id: "caocao", name: "曹操", faction: "魏", trait: "谋略", unlockLevelId: "level-05", description: "善于思考和安排。" },
  { id: "zhugeliang", name: "诸葛亮", faction: "蜀", trait: "智慧", unlockLevelId: "level-06", description: "聪明、细心、善用计策。" },
  { id: "huangyueying", name: "黄月英", faction: "蜀", trait: "巧思", unlockLevelId: "level-07", description: "喜欢发明和解决难题。" },
  { id: "zhouyu", name: "周瑜", faction: "吴", trait: "统筹", unlockLevelId: "level-08", description: "会带领大家合作作战。" },
  { id: "sunquan", name: "孙权", faction: "吴", trait: "判断", unlockLevelId: "level-09", description: "年轻但善于做决定。" },
  { id: "huangzhong", name: "黄忠", faction: "蜀", trait: "专注", unlockLevelId: "level-10", description: "经验丰富、做事专心。" },
  { id: "machao", name: "马超", faction: "蜀", trait: "迅捷", unlockLevelId: "level-11", description: "行动迅速，冲劲十足。" },
  { id: "jiangwei", name: "姜维", faction: "蜀", trait: "坚持", unlockLevelId: "level-12", description: "爱学习，也能坚持到底。" }
];
```

- [ ] **Step 4: Add level data**

Create `src/data/levels.js`. Each level must reference 10 sequential question IDs:

```js
const makeQuestionIds = (levelNumber) => {
  const start = (levelNumber - 1) * 10 + 1;
  return Array.from({ length: 10 }, (_, index) => `q-${String(start + index).padStart(3, "0")}`);
};

export const levels = [
  { id: "level-01", order: 1, title: "桃园结义", description: "从桃园开始你的三国知识冒险。", unlockWarriorId: "liubei", questions: makeQuestionIds(1) },
  { id: "level-02", order: 2, title: "黄巾初战", description: "小将军第一次出战，试试基础知识。", unlockWarriorId: "guanyu", questions: makeQuestionIds(2) },
  { id: "level-03", order: 3, title: "虎牢关前", description: "来到雄关之前，继续积累本领。", unlockWarriorId: "zhangfei", questions: makeQuestionIds(3) },
  { id: "level-04", order: 4, title: "三英战吕布", description: "勇气和知识都要准备好。", unlockWarriorId: "zhaoyun", questions: makeQuestionIds(4) },
  { id: "level-05", order: 5, title: "官渡风云", description: "用细心判断赢得挑战。", unlockWarriorId: "caocao", questions: makeQuestionIds(5) },
  { id: "level-06", order: 6, title: "三顾茅庐", description: "带着诚意去寻找智慧。", unlockWarriorId: "zhugeliang", questions: makeQuestionIds(6) },
  { id: "level-07", order: 7, title: "草船借箭", description: "观察天气，也观察题目。", unlockWarriorId: "huangyueying", questions: makeQuestionIds(7) },
  { id: "level-08", order: 8, title: "赤壁之战", description: "合作和知识都能带来胜利。", unlockWarriorId: "zhouyu", questions: makeQuestionIds(8) },
  { id: "level-09", order: 9, title: "华容道", description: "在岔路中选出正确答案。", unlockWarriorId: "sunquan", questions: makeQuestionIds(9) },
  { id: "level-10", order: 10, title: "取西川", description: "保持专注，向新的城池前进。", unlockWarriorId: "huangzhong", questions: makeQuestionIds(10) },
  { id: "level-11", order: 11, title: "七擒孟获", description: "用耐心解决连续挑战。", unlockWarriorId: "machao", questions: makeQuestionIds(11) },
  { id: "level-12", order: 12, title: "五丈原", description: "完成最后的知识远征。", unlockWarriorId: "jiangwei", questions: makeQuestionIds(12) }
];
```

- [ ] **Step 5: Add the built-in question bank**

Create `src/data/questions.js` with 120 objects. Use this shape for every object:

```js
export const questions = [
  {
    id: "q-001",
    levelId: "level-01",
    subject: "chinese",
    prompt: "下面哪个词语表示朋友之间很讲义气？",
    options: ["三心二意", "情同手足", "东张西望", "自言自语"],
    answerIndex: 1,
    explanation: "情同手足形容关系像兄弟一样亲密。"
  }
];
```

Populate all IDs from `q-001` through `q-120`. For every 10-question level, include 2 Chinese, 2 math, 2 English, 2 science/common-knowledge, and 2 Three Kingdoms history questions. Keep the wording third-grade appropriate and avoid violent detail in history questions.

- [ ] **Step 6: Run data tests**

Run: `npm test -- tests/data-integrity.test.js`

Expected: PASS.

## Task 3: Progress and Quiz Domain Logic

**Files:**
- Create: `src/domain/progress.js`
- Create: `src/domain/quiz-session.js`
- Create: `tests/progress.test.js`
- Create: `tests/quiz-session.test.js`

- [ ] **Step 1: Write progress tests**

Create `tests/progress.test.js`:

```js
import { describe, expect, it } from "vitest";
import {
  createDefaultProgress,
  completeLevel,
  recordAnswer,
  recordWrongQuestion
} from "../src/domain/progress.js";

describe("progress domain", () => {
  it("starts with only level 1 unlocked and no warriors", () => {
    const progress = createDefaultProgress();
    expect(progress.unlockedLevel).toBe(1);
    expect(progress.completedLevels).toEqual([]);
    expect(progress.unlockedWarriors).toEqual([]);
    expect(progress.parentPasscode).toBe("1234");
  });

  it("records subject stats", () => {
    const progress = createDefaultProgress();
    const updated = recordAnswer(progress, "math", true);
    expect(updated.subjectStats.math).toEqual({ correct: 1, total: 1 });
  });

  it("unlocks next level and warrior after completion", () => {
    const progress = createDefaultProgress();
    const updated = completeLevel(progress, {
      levelId: "level-01",
      levelOrder: 1,
      warriorId: "liubei",
      completedAt: "2026-06-22T10:00:00.000Z"
    });

    expect(updated.unlockedLevel).toBe(2);
    expect(updated.completedLevels).toContain("level-01");
    expect(updated.unlockedWarriors).toContain("liubei");
    expect(updated.recentCompletions[0].levelId).toBe("level-01");
  });

  it("stores wrong questions with answer details", () => {
    const progress = createDefaultProgress();
    const updated = recordWrongQuestion(progress, {
      questionId: "q-001",
      levelId: "level-01",
      subject: "chinese",
      prompt: "测试题",
      selectedAnswer: "A",
      correctAnswer: "B",
      explanation: "解释",
      answeredAt: "2026-06-22T10:00:00.000Z"
    });

    expect(updated.wrongQuestions).toHaveLength(1);
    expect(updated.wrongQuestions[0].questionId).toBe("q-001");
  });
});
```

- [ ] **Step 2: Write quiz session tests**

Create `tests/quiz-session.test.js`:

```js
import { describe, expect, it } from "vitest";
import { createQuizSession, answerCurrentQuestion } from "../src/domain/quiz-session.js";

const questions = [
  {
    id: "q-001",
    subject: "math",
    prompt: "3 + 4 = ?",
    options: ["6", "7", "8", "9"],
    answerIndex: 1,
    explanation: "3 + 4 = 7。"
  }
];

describe("quiz session", () => {
  it("accepts a correct first answer", () => {
    const session = createQuizSession("level-01", questions);
    const result = answerCurrentQuestion(session, 1);
    expect(result.feedback).toBe("correct");
    expect(result.session.answers[0].isCorrect).toBe(true);
    expect(result.session.currentIndex).toBe(1);
  });

  it("allows one retry after a wrong answer", () => {
    const session = createQuizSession("level-01", questions);
    const first = answerCurrentQuestion(session, 0);
    expect(first.feedback).toBe("retry");
    expect(first.session.retryQuestionId).toBe("q-001");

    const second = answerCurrentQuestion(first.session, 1);
    expect(second.feedback).toBe("correct-after-retry");
    expect(second.session.answers[0].attempts).toBe(2);
    expect(second.session.currentIndex).toBe(1);
  });

  it("marks a question wrong after the retry fails", () => {
    const session = createQuizSession("level-01", questions);
    const first = answerCurrentQuestion(session, 0);
    const second = answerCurrentQuestion(first.session, 2);
    expect(second.feedback).toBe("wrong");
    expect(second.session.answers[0].isCorrect).toBe(false);
    expect(second.session.answers[0].correctAnswer).toBe("7");
  });
});
```

- [ ] **Step 3: Run tests to verify domain modules are missing**

Run: `npm test -- tests/progress.test.js tests/quiz-session.test.js`

Expected: FAIL because `progress.js` and `quiz-session.js` do not exist yet.

- [ ] **Step 4: Implement progress helpers**

Create `src/domain/progress.js`:

```js
const SUBJECTS = ["chinese", "math", "english", "science", "history"];

const createSubjectStats = () =>
  Object.fromEntries(SUBJECTS.map((subject) => [subject, { correct: 0, total: 0 }]));

export const createDefaultProgress = () => ({
  unlockedLevel: 1,
  completedLevels: [],
  unlockedWarriors: [],
  subjectStats: createSubjectStats(),
  wrongQuestions: [],
  recentCompletions: [],
  parentPasscode: "1234",
  soundEnabled: true
});

export const recordAnswer = (progress, subject, isCorrect) => {
  const current = progress.subjectStats[subject] ?? { correct: 0, total: 0 };
  return {
    ...progress,
    subjectStats: {
      ...progress.subjectStats,
      [subject]: {
        correct: current.correct + (isCorrect ? 1 : 0),
        total: current.total + 1
      }
    }
  };
};

export const recordWrongQuestion = (progress, wrongQuestion) => ({
  ...progress,
  wrongQuestions: [
    {
      questionId: wrongQuestion.questionId,
      levelId: wrongQuestion.levelId,
      subject: wrongQuestion.subject,
      prompt: wrongQuestion.prompt,
      selectedAnswer: wrongQuestion.selectedAnswer,
      correctAnswer: wrongQuestion.correctAnswer,
      explanation: wrongQuestion.explanation,
      answeredAt: wrongQuestion.answeredAt
    },
    ...progress.wrongQuestions.filter((item) => item.questionId !== wrongQuestion.questionId)
  ].slice(0, 60)
});

export const completeLevel = (progress, completion) => {
  const completedLevels = new Set(progress.completedLevels);
  completedLevels.add(completion.levelId);

  const unlockedWarriors = new Set(progress.unlockedWarriors);
  unlockedWarriors.add(completion.warriorId);

  return {
    ...progress,
    unlockedLevel: Math.max(progress.unlockedLevel, completion.levelOrder + 1),
    completedLevels: [...completedLevels],
    unlockedWarriors: [...unlockedWarriors],
    recentCompletions: [
      {
        levelId: completion.levelId,
        levelOrder: completion.levelOrder,
        warriorId: completion.warriorId,
        completedAt: completion.completedAt
      },
      ...progress.recentCompletions
    ].slice(0, 10)
  };
};
```

- [ ] **Step 5: Implement quiz session helpers**

Create `src/domain/quiz-session.js`:

```js
export const createQuizSession = (levelId, questions) => ({
  levelId,
  questions,
  currentIndex: 0,
  retryQuestionId: null,
  answers: []
});

export const getCurrentQuestion = (session) => session.questions[session.currentIndex] ?? null;

export const answerCurrentQuestion = (session, selectedIndex) => {
  const question = getCurrentQuestion(session);
  if (!question) {
    return { feedback: "complete", session };
  }

  const isCorrect = selectedIndex === question.answerIndex;
  const isRetry = session.retryQuestionId === question.id;

  if (isCorrect) {
    return {
      feedback: isRetry ? "correct-after-retry" : "correct",
      session: {
        ...session,
        currentIndex: session.currentIndex + 1,
        retryQuestionId: null,
        answers: [
          ...session.answers,
          {
            questionId: question.id,
            subject: question.subject,
            selectedIndex,
            selectedAnswer: question.options[selectedIndex],
            correctAnswer: question.options[question.answerIndex],
            isCorrect: true,
            attempts: isRetry ? 2 : 1
          }
        ]
      }
    };
  }

  if (!isRetry) {
    return {
      feedback: "retry",
      session: {
        ...session,
        retryQuestionId: question.id
      }
    };
  }

  return {
    feedback: "wrong",
    session: {
      ...session,
      currentIndex: session.currentIndex + 1,
      retryQuestionId: null,
      answers: [
        ...session.answers,
        {
          questionId: question.id,
          subject: question.subject,
          selectedIndex,
          selectedAnswer: question.options[selectedIndex],
          correctAnswer: question.options[question.answerIndex],
          explanation: question.explanation,
          isCorrect: false,
          attempts: 2
        }
      ]
    }
  };
};
```

- [ ] **Step 6: Run domain tests**

Run: `npm test -- tests/progress.test.js tests/quiz-session.test.js`

Expected: PASS.

## Task 4: Storage and App State

**Files:**
- Create: `src/storage/local-store.js`
- Modify: `src/main.js`

- [ ] **Step 1: Implement storage wrapper**

Create `src/storage/local-store.js`:

```js
import { createDefaultProgress } from "../domain/progress.js";

const STORAGE_KEY = "knowledge-quest-progress-v1";

export const loadProgress = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProgress();
    return { ...createDefaultProgress(), ...JSON.parse(raw) };
  } catch {
    return createDefaultProgress();
  }
};

export const saveProgress = (progress) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    return false;
  }
  return true;
};

export const resetProgress = () => {
  window.localStorage.removeItem(STORAGE_KEY);
  return createDefaultProgress();
};
```

- [ ] **Step 2: Replace temporary bootstrap with app state shell**

Modify `src/main.js`:

```js
import "./styles.css";
import { levels } from "./data/levels.js";
import { questions } from "./data/questions.js";
import { warriors } from "./data/warriors.js";
import { loadProgress, saveProgress } from "./storage/local-store.js";
import { renderApp } from "./ui/render.js";

const app = document.querySelector("#app");

const state = {
  route: { name: "map" },
  progress: loadProgress(),
  levels,
  questions,
  warriors,
  activeSession: null,
  lastResult: null
};

const setState = (patch) => {
  Object.assign(state, patch);
  saveProgress(state.progress);
  renderApp(app, state, actions);
};

const actions = {
  navigate(route) {
    setState({ route });
  },
  updateProgress(progress) {
    setState({ progress });
  },
  updateSession(activeSession) {
    setState({ activeSession });
  },
  finishLevel(lastResult, progress) {
    setState({ route: { name: "result" }, lastResult, activeSession: null, progress });
  }
};

renderApp(app, state, actions);
```

- [ ] **Step 3: Run tests and build**

Run: `npm test && npm run build`

Expected: tests pass; build fails only if `src/ui/render.js` is not created yet. If it fails for missing render module, continue to Task 5.

## Task 5: UI Rendering and Core Flow

**Files:**
- Create: `src/ui/render.js`
- Modify: `src/styles.css`
- Modify: `src/main.js`

- [ ] **Step 1: Implement render module**

Create `src/ui/render.js` with named render functions and event delegation:

```js
import { createQuizSession, answerCurrentQuestion, getCurrentQuestion } from "../domain/quiz-session.js";
import { completeLevel, recordAnswer, recordWrongQuestion } from "../domain/progress.js";
import { playSound } from "../audio/sounds.js";

const byId = (items, id) => items.find((item) => item.id === id);

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
      <nav class="top-actions">
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
      <h2>${level.title}</h2>
      <p>${level.description}</p>
      <p class="reward">奖励：${warrior.name}卡</p>
      <button data-action="start-level" data-level-id="${level.id}" ${locked ? "disabled" : ""}>
        ${locked ? "未解锁" : completed ? "再玩一次" : "开始闯关"}
      </button>
    </article>
  `;
};

const renderQuiz = (state) => {
  const question = getCurrentQuestion(state.activeSession);
  if (!question) return `<main class="app-shell"><section class="panel">题目已完成。</section></main>`;

  return `
    <main class="app-shell quiz-shell">
      <section class="panel quiz-card">
        <p class="eyebrow">第 ${state.activeSession.currentIndex + 1} / ${state.activeSession.questions.length} 题</p>
        <h1>${question.prompt}</h1>
        <div class="option-grid">
          ${question.options.map((option, index) => `
            <button class="option-button" data-action="answer" data-answer-index="${index}">
              ${option}
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
        <h1>解锁 ${warrior.name}</h1>
        <p>${warrior.description}</p>
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
            <div class="warrior-avatar">${unlocked ? warrior.name.slice(0, 1) : "?"}</div>
            <h2>${unlocked ? warrior.name : "未解锁"}</h2>
            <p>${unlocked ? `${warrior.trait}：${warrior.description}` : "继续闯关收集武将卡。"}</p>
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
          <strong>${subject}</strong>
          <span>${percent(stat)}</span>
        </article>
      `).join("")}
    </section>
    <section class="panel">
      <h2>最近通关</h2>
      ${state.progress.recentCompletions.length === 0 ? "<p>还没有通关记录。</p>" : state.progress.recentCompletions.map((item) => `<p>第 ${item.levelOrder} 关，${new Date(item.completedAt).toLocaleString()}</p>`).join("")}
    </section>
    <section class="panel">
      <h2>错题记录</h2>
      ${state.progress.wrongQuestions.length === 0 ? "<p>还没有错题。</p>" : state.progress.wrongQuestions.map((item) => `<article class="wrong-item"><strong>${item.prompt}</strong><p>正确答案：${item.correctAnswer}</p><p>${item.explanation}</p></article>`).join("")}
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
      actions.updateSession(createQuizSession(level.id, levelQuestions));
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
```

- [ ] **Step 2: Expand CSS for all screens**

Append to `src/styles.css`:

```css
.topbar {
  max-width: 1120px;
  margin: 0 auto 18px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.topbar h1,
.panel h1 {
  margin: 0;
  color: #562b16;
}

.top-actions,
.action-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  min-height: 44px;
  border: 0;
  border-radius: 8px;
  padding: 10px 16px;
  color: #fffaf0;
  background: #9b2c2c;
  font-weight: 700;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  background: #9ca3af;
}

.notice {
  max-width: 1120px;
  margin: 0 auto 18px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #fef3c7;
  color: #713f12;
  font-weight: 700;
}

.map-grid,
.warrior-grid,
.stats-grid {
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.level-node,
.warrior-card,
.stat-card {
  min-height: 190px;
  padding: 18px;
  border: 2px solid #7b341e;
  border-radius: 8px;
  background: #fffaf0;
  box-shadow: 0 10px 22px rgba(77, 45, 20, 0.12);
}

.level-node h2,
.warrior-card h2 {
  margin: 8px 0;
  color: #562b16;
}

.flag,
.reward {
  color: #9b2c2c;
  font-weight: 700;
}

.is-locked {
  opacity: 0.62;
}

.is-complete {
  border-color: #2f855a;
}

.quiz-card {
  max-width: 760px;
}

.option-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 20px;
}

.option-button {
  width: 100%;
  color: #1f2933;
  background: #fef3c7;
  border: 2px solid #b45309;
  text-align: left;
}

.feedback {
  min-height: 24px;
  color: #9b2c2c;
  font-weight: 700;
}

.warrior-avatar {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f6ad55;
  color: #562b16;
  font-size: 30px;
  font-weight: 800;
}

.passcode-input {
  width: 160px;
  height: 48px;
  margin: 14px 0;
  padding: 8px 12px;
  border: 2px solid #7b341e;
  border-radius: 8px;
  font-size: 24px;
  letter-spacing: 4px;
}

.stat-card {
  min-height: 110px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-card span {
  font-size: 28px;
  color: #2f855a;
  font-weight: 800;
}

.wrong-item {
  padding: 12px 0;
  border-top: 1px solid #e2c083;
}

@media (max-width: 640px) {
  .app-shell {
    padding: 14px;
  }

  .topbar {
    align-items: stretch;
    flex-direction: column;
  }
}
```

- [ ] **Step 3: Run build**

Run: `npm run build`

Expected: build completes if Task 6 audio module exists. If it fails for missing `src/audio/sounds.js`, continue to Task 6.

## Task 6: Audio Effects

**Files:**
- Create: `src/audio/sounds.js`

- [ ] **Step 1: Implement generated sound effects**

Create `src/audio/sounds.js`:

```js
const tones = {
  correct: [660, 880],
  wrong: [220, 180],
  complete: [523, 659, 784]
};

export const playSound = (name, enabled = true) => {
  if (!enabled || typeof window === "undefined") return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const frequencies = tones[name] ?? tones.correct;

  frequencies.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.001, context.currentTime + index * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.14, context.currentTime + index * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + index * 0.12 + 0.11);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(context.currentTime + index * 0.12);
    oscillator.stop(context.currentTime + index * 0.12 + 0.12);
  });
};
```

- [ ] **Step 2: Run build**

Run: `npm run build`

Expected: PASS.

## Task 7: Verification and Polish

**Files:**
- Modify as needed: `src/styles.css`
- Modify as needed: `src/ui/render.js`
- Modify as needed: `src/data/questions.js`

- [ ] **Step 1: Run all automated checks**

Run: `npm test`

Expected: PASS for data, quiz-session, and progress tests.

- [ ] **Step 2: Build production output**

Run: `npm run build`

Expected: PASS and `dist/` is generated.

- [ ] **Step 3: Start local dev server**

Run: `npm run dev -- --port 5173`

Expected: Vite prints a local URL like `http://127.0.0.1:5173/`.

- [ ] **Step 4: Manual browser verification**

Open the local URL and verify:

- Map page shows 12 三国-themed level nodes.
- Level 1 starts a 10-question quiz.
- A wrong answer shows one retry chance.
- A second wrong answer moves forward and records the wrong question.
- Completing Level 1 unlocks Level 2 and a warrior card.
- Refreshing the browser keeps the progress.
- Warrior gallery shows unlocked and locked cards.
- Parent stats page rejects a wrong passcode.
- Parent stats page accepts `1234`.
- Parent stats page shows subject percentages, completions, and wrong questions.
- The layout remains readable on a narrow mobile-sized viewport.

- [ ] **Step 5: Fix any verification failures**

For each failure, make the smallest targeted change in the relevant file, then rerun:

```bash
npm test
npm run build
```

Expected: both commands pass after fixes.

## Self-Review

- Spec coverage: The plan covers map mode, 12 levels, 10 questions per level, retry-once answering, warrior collection, parent passcode, local progress, wrong questions, subject stats, simple audio, and browser prototype structure.
- Placeholder scan: The only flexible item is the 120-question content-writing step; it has exact required shape, IDs, per-level distribution, and grade-level constraints.
- Type consistency: Level, question, warrior, progress, and quiz session fields are consistently named across tests, implementation, and UI.
