import type { QuestionWithAnswerType } from "./\bgoal-determination";

export type ProjectType = {
  id: string;
  goalInfo: {
    goal: string;
    constraints: {
      title: string;
      detail: string;
    }[];
  };
  title: string;
  description: string;
  conversation: ConversationType[];
  createdAt: Date;
  updatedAt: Date;
};

export type ConversationType = {
  id: string;
  role: "user" | "assistant";
  content: string | QuestionWithAnswerType;
  createdAt: Date;
};
