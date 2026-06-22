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
    const startAt = context.currentTime + index * 0.12;

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.14, startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.11);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + 0.12);
  });
};
