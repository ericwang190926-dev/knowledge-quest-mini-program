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
