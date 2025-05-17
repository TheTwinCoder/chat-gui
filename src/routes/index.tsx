import { Card } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
// import { ScrollArea } from "@/components/ui/scroll-area";
import ChatInput from "@/components/chat-input";
// import FeatureList from "@/components/feature-list";
import { AiMsg, LoadingMsg, UserMsg } from "@/components/chat/message";
import { QuestionMsg } from "@/components/question-msg";
import { determineGoal } from "@/lib/gemini";
import type {
  GoalMsgType,
  InitMsgType,
  QuestionMsgType,
} from "@/types/message";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [initialMsg, setInitialMsg] = useState<InitMsgType | null>(null);
  const [questionMsg, setQuestionMsg] = useState<QuestionMsgType | null>(null);
  const [isQuestionAllAnswered, setIsQuestionAllAnswered] =
    useState<boolean>(false);
  const [goalMsg, setGoalMsg] = useState<GoalMsgType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (questionMsg && !isQuestionAllAnswered) {
      setIsQuestionAllAnswered(
        questionMsg.questions.every((question) => question.answer)
      );

      (async () => {
        const result = await determineGoal.initial(
          `${initialMsg!.text}

${questionMsg.questions.map((question) => question.question + " " + question.answer).join("\n")}`
        );
        if (result.success && result.data) {
          if (result.type === "goal") {
            setGoalMsg({
              type: "goal",
              goal: result.data,
              time: new Date(),
            });
          }
        }
      })();
    }
  }, [questionMsg, isQuestionAllAnswered]);

  const handleNewMessage = async (text: string) => {
    setIsLoading(true);

    if (!initialMsg) {
      setInitialMsg({
        type: "init",
        text,
        time: new Date(),
      });

      try {
        const result = await determineGoal.initial(text);
        if (result.success && result.data) {
          if (result.type === "question") {
            setQuestionMsg({
              type: "question",
              questions: result.data,
              time: new Date(),
            });
          } else {
            setGoalMsg({
              type: "goal",
              goal: result.data,
              time: new Date(),
            });
          }
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    }

    setIsLoading(false);
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [goalMsg]);

  function handleAnswer(index: number, answer: string) {
    if (questionMsg) {
      const newQuestionMsg = { ...questionMsg };
      newQuestionMsg.questions[index].answer = answer;
      setQuestionMsg(newQuestionMsg);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md h-[650px] mx-auto overflow-hidden border-2 border-black rounded-3xl">
        {/* Header */}
        <div className="px-4 py-2 border-b border-black">
          <div className="flex justify-between items-center">
            <h1
              className="text-2xl font-bold"
              onClick={() => {
                window.location.href = "/test";
              }}
            >
              ChatGUI
            </h1>
            <p className="text-sm text-gray-600">
              손쉬운 인터넷 사용을 위한 도우미
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col h-[700px] overflow-y-auto p-2 gap-2">
          {initialMsg && (
            <UserMsg text={initialMsg.text} time={initialMsg.time} />
          )}
          {questionMsg && (
            <QuestionMsg
              data={questionMsg}
              onAnswer={handleAnswer}
              disabled={false}
            />
          )}
          {isLoading && (
            <div className="px-4 py-2">
              <LoadingMsg />
            </div>
          )}
          {goalMsg && (
            <AiMsg text={"목표가 설정되었습니다"} time={goalMsg.time} />
          )}
          {error && <div className="px-4 py-2 text-red-500">{error}</div>}
          <div ref={bottomRef} />
        </div>
        <div className="sticky bottom-0 p-2 border-t border-gray-200 bg-white">
          <ChatInput
            placeholder="어떻게 도와드릴까요?"
            onNewMessage={handleNewMessage}
            disabled={isLoading}
          />
        </div>
      </Card>
    </div>
  );
}
