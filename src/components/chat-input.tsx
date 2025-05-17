import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface ChatInputProps {
  meassages: string[];
  placeholder?: string;
  setMessages: (message: string[]) => void;
}

export default function ChatInput({
  meassages,
  placeholder = "메시지를 입력하세요...",
  setMessages,
}: ChatInputProps) {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && setMessages) {
      setMessages([...meassages, message]);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border-2 border-gray-300 rounded-xl"
      />
      <Button
        type="submit"
        size="icon"
        className="rounded-full bg-gray-100 border-2 border-gray-300 hover:bg-gray-200"
      >
        <ChevronRight className="h-5 w-5 text-gray-700" />
      </Button>
    </form>
  );
}
