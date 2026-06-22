import "./styles.css";
import { levels } from "./data/levels.js";
import { questions } from "./data/questions.js";
import { warriors } from "./data/warriors.js";
import { loadProgress, resetProgress as resetStoredProgress, saveProgress } from "./storage/local-store.js";
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
  },
  resetProgress() {
    setState({
      route: { name: "map" },
      progress: resetStoredProgress(),
      activeSession: null,
      lastResult: null
    });
  }
};

renderApp(app, state, actions);
