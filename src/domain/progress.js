const SUBJECTS = ["chinese", "math", "english", "science", "history"];

const createSubjectStats = () =>
  Object.fromEntries(SUBJECTS.map((subject) => [subject, { correct: 0, total: 0 }]));

export const createDefaultProgress = () => ({
  unlockedLevel: 1,
  completedLevels: [],
  unlockedWarriors: [],
  subjectStats: createSubjectStats(),
  wrongQuestions: [],
  recentCompletions: [],
  parentPasscode: "1234",
  soundEnabled: true
});

export const recordAnswer = (progress, subject, isCorrect) => {
  const current = progress.subjectStats[subject] ?? { correct: 0, total: 0 };
  return {
    ...progress,
    subjectStats: {
      ...progress.subjectStats,
      [subject]: {
        correct: current.correct + (isCorrect ? 1 : 0),
        total: current.total + 1
      }
    }
  };
};

export const recordWrongQuestion = (progress, wrongQuestion) => ({
  ...progress,
  wrongQuestions: [
    {
      questionId: wrongQuestion.questionId,
      levelId: wrongQuestion.levelId,
      subject: wrongQuestion.subject,
      prompt: wrongQuestion.prompt,
      selectedAnswer: wrongQuestion.selectedAnswer,
      correctAnswer: wrongQuestion.correctAnswer,
      explanation: wrongQuestion.explanation,
      answeredAt: wrongQuestion.answeredAt
    },
    ...progress.wrongQuestions.filter((item) => item.questionId !== wrongQuestion.questionId)
  ].slice(0, 60)
});

export const completeLevel = (progress, completion) => {
  const completedLevels = new Set(progress.completedLevels);
  completedLevels.add(completion.levelId);

  const unlockedWarriors = new Set(progress.unlockedWarriors);
  unlockedWarriors.add(completion.warriorId);

  return {
    ...progress,
    unlockedLevel: Math.max(progress.unlockedLevel, completion.levelOrder + 1),
    completedLevels: [...completedLevels],
    unlockedWarriors: [...unlockedWarriors],
    recentCompletions: [
      {
        levelId: completion.levelId,
        levelOrder: completion.levelOrder,
        warriorId: completion.warriorId,
        completedAt: completion.completedAt
      },
      ...progress.recentCompletions
    ].slice(0, 10)
  };
};
