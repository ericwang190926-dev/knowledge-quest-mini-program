import { describe, expect, it } from "vitest";
import { answerCurrentQuestion, createQuizSession } from "../src/domain/quiz-session.js";

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
