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
