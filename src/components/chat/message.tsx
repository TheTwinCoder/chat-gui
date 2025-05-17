import { Card } from "@/components/ui/card";
import Loading from "@/components/loading";

type UserMsgProps = {
  text?: string;
  time: Date;
  children?: React.ReactNode;
};
export function UserMsg({ text, time, children }: UserMsgProps) {
  return (
    <div className={"flex justify-end"}>
      <Card className={"max-w-[80%] p-3 rounded-xl bg-blue-100"}>
        <p className="text-sm">{text}</p>
        {children}
        <p className="text-xs text-gray-500 text-right">
          {time.toLocaleString()}
        </p>
      </Card>
    </div>
  );
}

type AiMsgProps = {
  text?: string;
  time: Date;
  children?: React.ReactNode;
};
export function AiMsg({ text, time, children }: AiMsgProps) {
  return (
    <div className={"flex justify-start"}>
      <Card
        className={"max-w-[80%] p-3 rounded-xl bg-white border border-gray-300"}
      >
        <p className="text-sm">{text}</p>
        {children}
        <p className="text-xs text-gray-500 text-right">
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
