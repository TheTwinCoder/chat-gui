import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/chat-message";
import ChatInput from "@/components/chat-input";
import FeatureList from "@/components/feature-list";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md mx-auto overflow-hidden border-2 border-black rounded-3xl">
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
        <div className="flex flex-col h-[600px]">
          {/* Message Display */}
          <div className="p-4">
            <ChatMessage
              message="지금 페이지에서 무엇에서 궁금하를 하고 싶으신 어떻게 하면 좋을까요?"
              isUser={false}
              timestamp="2023-5-17 오후 3:24"
            />
          </div>

          {/* Dotted Separator */}
          <div className="border-t border-dotted border-gray-400 mx-4"></div>

          {/* Features Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <h2 className="font-bold text-center">
                「ChatGUI」를 만나보고 있습니다!!
              </h2>

              <p className="text-sm text-gray-700">
                챗봇에서 도움말을 그래하는 방법은 다음과 같습니다. 다음과 같은
                방법으로 제 질문을 더 잘 전달할 수 있을 것입니다, 화면 우측에
                도움말 더 볼 있습니다.
              </p>

              <FeatureList />
            </div>
          </ScrollArea>

          {/* Dotted Separator */}
          <div className="border-t border-dotted border-gray-400 mx-4"></div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <ChatInput placeholder="어떻게 도와드릴까요?" />
          </div>
        </div>
      </Card>
    </div>
  );
}
