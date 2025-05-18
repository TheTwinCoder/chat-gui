import { ActionMsg, HtmlMsg, UserMsg } from "@/components/chat/message";
import { GoalMsg } from "@/components/goal/goal-msg";
import { QuestionMsg } from "@/components/question-msg";
import type { HistoryType } from "@/routes";
import type {
  GoalMsgType,
  InitMsgType,
  QuestionMsgType,
} from "@/types/message";
import { useEffect, useRef } from "react";
import Loading from "../loading";

interface ChatAreaProps {
  initialMsg: InitMsgType | null;
  questionMsg: QuestionMsgType | null;
  goalMsg: GoalMsgType | null;
  initialQuery: string | null;
  isLoading: boolean;
  error: string | null;
  onAnswer: (index: number, answer: string) => void;
  history: HistoryType[];
  actionIdx: number;
}

export function ChatArea({
  initialMsg,
  questionMsg,
  goalMsg,
  initialQuery,
  isLoading,
  error,
  onAnswer,
  history,
  actionIdx,
}: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [goalMsg, isLoading, initialQuery, history]);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-2 gap-2">
      {initialMsg && <UserMsg text={initialMsg.text} time={initialMsg.time} />}
      {questionMsg && (
        <QuestionMsg
          data={questionMsg}
          onAnswer={onAnswer}
          disabled={isLoading}
        />
      )}
      {goalMsg && <GoalMsg data={goalMsg} />}
      {!!initialQuery &&
        (initialQuery === "" ? (
          <Loading text="생각 중..." />
        ) : (
          <Loading text={initialQuery + " 접속..."} />
        ))}
      {history.map((item, index) => (
        <div key={index} className="flex flex-col gap-2">
          {item.page.description && (
            <HtmlMsg
              description={item.page.description ?? "?"}
              time={new Date()}
            />
          )}
          {item.action &&
            item.action.length > 0 &&
            (index === history.length - 1 ? (
              <Loading text={`행동(${actionIdx + 1}/${item.action.length})`} />
            ) : (
              <ActionMsg count={item.action.length} time={new Date()} />
            ))}
        </div>
      ))}
      {isLoading && <Loading />}
      {error && <div className="px-4 py-2 text-red-500">{error}</div>}
      <div ref={bottomRef} />
    </div>
  );
}
