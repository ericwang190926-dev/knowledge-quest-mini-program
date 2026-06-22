import { describe, expect, it } from "vitest";
import { questions } from "../src/data/questions.js";

const hasSubjectPrompt = (subject, patterns) =>
  questions.some((question) =>
    question.subject === subject
    && patterns.every((pattern) => pattern.test(`${question.prompt} ${question.explanation}`))
  );

describe("question coverage", () => {
  it("includes expanded math topics for word problems, date knowledge, and perimeter", () => {
    expect(hasSubjectPrompt("math", [/一共|还剩|需要|每天|买/])).toBe(true);
    expect(hasSubjectPrompt("math", [/平年|闰年|月份|天/])).toBe(true);
    expect(hasSubjectPrompt("math", [/周长/])).toBe(true);
  });

  it("includes English sentence comprehension questions", () => {
    expect(hasSubjectPrompt("english", [/句子|意思是|选择正确的句子/])).toBe(true);
  });

  it("includes Chinese reading comprehension questions", () => {
    expect(hasSubjectPrompt("chinese", [/阅读|短文|故事/])).toBe(true);
  });
});
