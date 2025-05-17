import type { AiMsgType, UserMsgType } from "@/types/message";
import { Card } from "@/components/ui/card";
import Loading from "@/components/loading";

type UserMsgProps = Pick<UserMsgType, "text" | "time">;
export function UserMsg({ text, time }: UserMsgProps) {
  return (
    <div className={"flex justify-end"}>
      <Card className={"max-w-[80%] p-3 rounded-xl bg-blue-100"}>
        <p className="text-sm">{text}</p>
        <p className="text-xs text-gray-500 mt-1 text-right">
          {time.toLocaleString()}
        </p>
      </Card>
    </div>
  );
}

type AiMsgProps = Pick<AiMsgType, "text" | "time">;
export function AiMsg({ text, time }: AiMsgProps) {
  return (
    <div className={"flex justify-start"}>
      <Card
        className={"max-w-[80%] p-3 rounded-xl bg-white border border-gray-300"}
      >
        <p className="text-sm">{text}</p>
        <p className="text-xs text-gray-500 mt-1 text-right">
          {time.toLocaleString()}
        </p>
      </Card>
    </div>
  );
}

export function LoadingMsg() {
  return (
    <div className={"flex justify-start"}>
      <Card
        className={"max-w-[80%] p-3 rounded-xl bg-white border border-gray-300"}
      >
        <Loading />
      </Card>
    </div>
  );
}
