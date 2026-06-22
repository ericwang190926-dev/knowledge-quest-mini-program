import { describe, expect, it } from "vitest";
import {
  completeLevel,
  createDefaultProgress,
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
