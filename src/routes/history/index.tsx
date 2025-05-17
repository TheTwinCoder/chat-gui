import { createFileRoute } from "@tanstack/react-router";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Trash2 } from "lucide-react";
import SearchModal from "@/components/search-modal";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/history/")({
  component: RouteComponent,
});

interface ChatHistoryItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
}

function RouteComponent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Mock data for chat history
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
    {
      id: "1",
      title: "대화요약",
      startTime: "2023-5-17 오후 3:24",
      endTime: "2023-5-18 오후 10:12",
    },
    {
      id: "2",
      title: "대화요약",
      startTime: "2023-5-17 오후 3:24",
      endTime: "2023-5-18 오후 10:12",
    },
    {
      id: "3",
      title: "대화요약",
      startTime: "2023-5-17 오후 3:24",
      endTime: "2023-5-18 오후 10:12",
    },
  ]);

  const handleDelete = (id: string) => {
    setChatHistory(chatHistory.filter((item) => item.id !== id));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md h-[650px] mx-auto overflow-hidden border-2 border-black rounded-3xl">
        {/* Header */}
        <div className="px-4 py-2 border-b border-black">
          <div className="flex justify-between items-center">
            <h1>
              <Link to="/">ChatGUI</Link>
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">
                당신의 원활한 업무처리를 위한 도우미
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat History List */}
        <div className="flex flex-col p-4 space-y-3">
          {chatHistory.map((chat) => (
            <Card
              key={chat.id}
              className="border-2 border-gray-300 rounded-xl p-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{chat.title}</h3>
                  <p className="text-xs text-gray-500">
                    대화 시작: {chat.startTime} / 마지막 대화: {chat.endTime}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(chat.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
