export type GoalDeterminationResultType =
  | {
      isStructuredResult: true;
      structuredResult: StructuredGoalType;
    }
  | {
      isStructuredResult: false;
      questions: QuestionType[];
    };

export type QuestionType = {
  question: string;
  answerCandidate: string[];
  answerUnit?: string;
};

export type QuestionWithAnswerType = {
  question: string;
  answer: string;
  answerCandidate: string[];
  answerUnit?: string;
};

export type StructuredGoalType = {
  goal: string;
  constraints: {
    title: string;
    detail: string;
  }[];
};
