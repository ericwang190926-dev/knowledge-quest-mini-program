import { describe, expect, it } from "vitest";
import { levels } from "../src/data/levels.js";
import { questions } from "../src/data/questions.js";
import { warriors } from "../src/data/warriors.js";
import { createDefaultProgress } from "../src/domain/progress.js";
import { renderApp } from "../src/ui/render.js";

const createFakeRoot = () => {
  const listeners = new Set();
  return {
    innerHTML: "",
    addEventListener(type, listener) {
      if (type === "click") listeners.add(listener);
    },
    removeEventListener(type, listener) {
      if (type === "click") listeners.delete(listener);
    },
    querySelector() {
      return null;
    },
    click(action) {
      const target = {
        dataset: { action },
        closest() {
          return target;
        }
      };
      for (const listener of listeners) {
        listener({ target });
      }
    }
  };
};

describe("render event binding", () => {
  it("does not process one click multiple times after rerenders", () => {
    const root = createFakeRoot();
    const state = {
      route: { name: "map" },
      progress: createDefaultProgress(),
      levels,
      questions,
      warriors,
      activeSession: null,
      lastResult: null
    };
    let navigationCount = 0;
    const actions = {
      navigate() {
        navigationCount += 1;
      },
      updateProgress() {},
      updateSession() {},
      finishLevel() {}
    };

    renderApp(root, state, actions);
    renderApp(root, state, actions);
    renderApp(root, state, actions);
    root.click("warriors");

    expect(navigationCount).toBe(1);
  });
});
