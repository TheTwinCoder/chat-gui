import type { GoalType, QuestionWithAnswerType } from "./\bgoal-determination";

export type InitMsgType = {
  type: "init";
  text: string;
  time: Date;
};

export type QuestionMsgType = {
  type: "question";
  questions: QuestionWithAnswerType[];
  time: Date;
};

export type GoalMsgType = {
  type: "goal";
  goal: GoalType;
  time: Date;
};

export type MsgType = InitMsgType | QuestionMsgType | GoalMsgType;
