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
