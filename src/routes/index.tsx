import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/chat-message";
import ChatInput from "@/components/chat-input";
// import FeatureList from "@/components/feature-list";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [messages, setMessages] = useState<string[]>([""]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md h-[650px] mx-auto overflow-hidden border-2 border-black rounded-3xl">
        {/* Header */}
        <div className="p-4 border-b border-black">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">ChatGUI</h1>
            <p className="text-sm text-gray-600">
              당신의 원활한 업무처리를 위한 도우미
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col h-[600px] overflow-y-auto">
          {messages.map((message, index) => (
            <>
              {/* user's question*/}
              <div key={index} className="px-4 py-2">
                <ChatMessage
                  message={message}
                  isUser={true}
                  timestamp="2023-5-17 오후 3:24"
                />
              </div>
              {/* assistant's answer*/}
              <div key={index} className="px-4 py-2">
                <ChatMessage
                  message={message}
                  isUser={false}
                  timestamp="2023-5-17 오후 3:24"
                />
              </div>
              <div className="border-t border-dotted border-gray-400 mx-4" />
            </>
          ))}

          <div className="sticky bottom-0 p-4 border-t border-gray-200 bg-white">
            <ChatInput
              placeholder="어떻게 도와드릴까요?"
              setMessages={setMessages}
              meassages={messages}
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </Card>
    </div>
  );
}
