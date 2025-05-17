import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
import ChatInput from "@/components/chat-input";
// import FeatureList from "@/components/feature-list";
import { useEffect, useRef, useState } from "react";
import { UserMsg, AiMsg, LoadingMsg } from "@/components/chat/message";
import type { AiMsgType, MsgType, UserMsgType } from "@/types/message";

export const Route = createFileRoute("/chat/index/$initMessage")({
  component: RouteComponent,
});

function RouteComponent() {
  const { initMessage } = Route.useParams();
  const [messages, setMessages] = useState<MsgType[]>([]);
  const [pendingMsg, setPendingMsg] = useState<UserMsgType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initMessage) {
      const initalUserMsg: UserMsgType = {
        type: "user",
        text: initMessage,
        time: new Date(),
        imageList: [],
      };
      setPendingMsg(initalUserMsg);
      setMessages([initalUserMsg]);
    }
  }, [initMessage]);

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

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
              손쉬운 컴퓨터 사용을 위한 도우미
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col h-[700px] overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className="px-4 py-2">
              {msg.type === "user" ? (
                <UserMsg text={msg.text} time={msg.time} />
              ) : (
                <AiMsg text={msg.text} time={msg.time} />
              )}
            </div>
          ))}
          {pendingMsg && (
            <div className="px-4 py-2">
              <LoadingMsg />
            </div>
          )}
          {error && <div className="px-4 py-2 text-red-500">{error}</div>}
          <div ref={bottomRef} />
        </div>
        <div className="sticky bottom-0 p-2 border-t border-gray-200 bg-white">
          <ChatInput
            placeholder="어떻게 도와드릴까요?"
            onNewMessage={handleNewMessage}
            disabled={!!pendingMsg}
          />
        </div>
      </Card>
    </div>
  );
}
