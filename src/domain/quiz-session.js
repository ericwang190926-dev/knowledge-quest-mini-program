export const createQuizSession = (levelId, questions) => ({
  levelId,
  questions,
  currentIndex: 0,
  retryQuestionId: null,
  answers: []
});

export const getCurrentQuestion = (session) => session.questions[session.currentIndex] ?? null;

export const answerCurrentQuestion = (session, selectedIndex) => {
  const question = getCurrentQuestion(session);
  if (!question) {
    return { feedback: "complete", session };
  }

  const isCorrect = selectedIndex === question.answerIndex;
  const isRetry = session.retryQuestionId === question.id;

  if (isCorrect) {
    return {
      feedback: isRetry ? "correct-after-retry" : "correct",
      session: {
        ...session,
        currentIndex: session.currentIndex + 1,
        retryQuestionId: null,
        answers: [
          ...session.answers,
          {
            questionId: question.id,
            subject: question.subject,
            selectedIndex,
            selectedAnswer: question.options[selectedIndex],
            correctAnswer: question.options[question.answerIndex],
            isCorrect: true,
            attempts: isRetry ? 2 : 1
          }
        ]
      }
    };
  }

  if (!isRetry) {
    return {
      feedback: "retry",
      session: {
        ...session,
        retryQuestionId: question.id
      }
    };
  }

  return {
    feedback: "wrong",
    session: {
      ...session,
      currentIndex: session.currentIndex + 1,
      retryQuestionId: null,
      answers: [
        ...session.answers,
        {
          questionId: question.id,
          subject: question.subject,
          selectedIndex,
          selectedAnswer: question.options[selectedIndex],
          correctAnswer: question.options[question.answerIndex],
          explanation: question.explanation,
          isCorrect: false,
          attempts: 2
        }
      ]
    }
  };
};
