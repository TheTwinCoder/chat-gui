import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
import InitialInput from "@/components/inital-input";
// import FeatureList from "@/components/feature-list";
import { useState } from "react";
import type { AiMsgType, MsgType, UserMsgType } from "@/types/message";

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
      const result = await window.api.geminiChat(newUserMsg.text);
      if (result.success && result.data) {
        const newAiMsg: AiMsgType = {
          type: "ai",
          text: result.data,
          time: new Date(),
        };
        setMessages([...messages, newUserMsg, newAiMsg]);
        setPendingMsg(null);
      } else {
        setError(result.message || "알 수 없는 오류가 발생했습니다.");
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md h-[650px] mx-auto overflow-hidden border-2 border-black rounded-3xl">
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
              손쉬운 컴퓨터 사용을 위한 도우미
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-xl font-bold my-1">환영합니다!</h1>
          <p>브라우저에서 하고 싶은게 있다면 알려주세요!! </p>
          <div className="p-2 border-t border-gray-200 bg-white w-full">
            <InitialInput
              placeholder="어떻게 도와드릴까요?"
              onNewMessage={handleNewMessage}
              disabled={!!pendingMsg}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
