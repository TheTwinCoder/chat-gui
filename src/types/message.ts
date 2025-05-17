export type UserMsgType = {
  type: "user";
  text: string;
  time: Date;
  imageList: string[];
};
export type AiMsgType = {
  type: "ai";
  text: string;
  time: Date;
};

export type MsgType = UserMsgType | AiMsgType;
