import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
import InitialInput from "@/components/inital-input";
// import FeatureList from "@/components/feature-list";
import { useState } from "react";
import type { AiMsgType, MsgType, UserMsgType } from "@/types/message";
import { determineGoal } from "@/lib/gemini";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [messages, setMessages] = useState<MsgType[]>([]);
  const [pendingMsg, setPendingMsg] = useState<UserMsgType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleNewMessage = async (text: string) => {
    const newUserMsg: UserMsgType = {
      type: "user",
      text,
      time: new Date(),
      imageList: [],
    };
    setPendingMsg(newUserMsg);
    setMessages([...messages, newUserMsg]);

    try {
      const result = await determineGoal.initial(newUserMsg.text);
      if (result.success && result.data) {
        console.log(result.data);

        const newAiMsg: AiMsgType = {
          type: "ai",
          text: JSON.stringify(result.data),
          time: new Date(),
        };
        setMessages([...messages, newUserMsg, newAiMsg]);
        setPendingMsg(null);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setPendingMsg(null);
    }
  };

  return (
    
      <div className="w-full max-w-md h-[650px] mx-auto overflow-hidden rounded-3xl">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-5xl font-bold my-4">ChatGUI</h1>
          <h1 className="text-xl font-bold my-1">환영합니다!</h1>
          <p>브라우저에서 하고 싶은게 있다면 알려주세요!! </p>
          <div className="py-4 px-2 w-full">
            <InitialInput
              placeholder="어떻게 도와드릴까요?"
              onNewMessage={handleNewMessage}
              disabled={!!pendingMsg}
            />
          </div>
        </div>
      </div>
    
  );
}
