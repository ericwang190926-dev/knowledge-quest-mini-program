import { describe, expect, it } from "vitest";
import { levels } from "../src/data/levels.js";
import { questions } from "../src/data/questions.js";
import { warriors } from "../src/data/warriors.js";
import { createDefaultProgress } from "../src/domain/progress.js";
import { renderApp } from "../src/ui/render.js";

const createRoot = () => ({
  innerHTML: "",
  addEventListener() {},
  removeEventListener() {}
});

describe("interactive screen copy", () => {
  it("shows commander progress and junior strategist guidance on the map", () => {
    const progress = {
      ...createDefaultProgress(),
      unlockedLevel: 3,
      completedLevels: ["level-01", "level-02"],
      unlockedWarriors: ["liubei", "guanyu"]
    };
    const root = createRoot();

    renderApp(root, {
      route: { name: "map" },
      progress,
      levels,
      questions,
      warriors,
      activeSession: null,
      lastResult: null
    }, {});

    expect(root.innerHTML).toContain("小将军进度");
    expect(root.innerHTML).toContain("小军师");
    expect(root.innerHTML).toContain("已收复城池");
  });

  it("shows a warrior entrance and next level action on the result screen", () => {
    const progress = {
      ...createDefaultProgress(),
      unlockedLevel: 2,
      completedLevels: ["level-01"],
      unlockedWarriors: ["liubei"]
    };
    const root = createRoot();

    renderApp(root, {
      route: { name: "result" },
      progress,
      levels,
      questions,
      warriors,
      activeSession: null,
      lastResult: {
        levelId: "level-01",
        levelOrder: 1,
        warriorId: "liubei",
        correctCount: 8,
        totalCount: 10
      }
    }, {});

    expect(root.innerHTML).toContain("武将登场");
    expect(root.innerHTML).toContain("继续下一关");
    expect(root.innerHTML).toContain("下一站");
  });
});
