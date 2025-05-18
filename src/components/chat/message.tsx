import { Card } from "@/components/ui/card";
import Loading from "@/components/loading";
import { Globe, PlayCircle } from "lucide-react";

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

type HtmlMsgProps = {
  description: string;
  time: Date;
};

export function HtmlMsg({ description, time }: HtmlMsgProps) {
  return (
    <div className="flex justify-start">
      <Card className="max-w-[80%] p-3 rounded-xl bg-white border border-gray-300">
        <div className="flex items-center gap-2 text-blue-600">
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">{description} 페이지 접속</span>
        </div>
        <p className="text-xs text-gray-500 text-right mt-1">
          {time.toLocaleTimeString()}
        </p>
      </Card>
    </div>
  );
}

type ActionMsgProps = {
  count: number;
  time: Date;
};

export function ActionMsg({ count, time }: ActionMsgProps) {
  return (
    <div className="flex justify-start">
      <Card className="max-w-[80%] p-3 rounded-xl bg-white border border-gray-300">
        <div className="flex items-center gap-2 text-green-600">
          <PlayCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{count}개 액션 실행</span>
        </div>
        <p className="text-xs text-gray-500 text-right mt-1">
          {time.toLocaleTimeString()}
        </p>
      </Card>
    </div>
  );
}
