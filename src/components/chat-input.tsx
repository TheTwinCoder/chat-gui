import type React from "react";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

type ChatInputProps = {
  placeholder?: string;
  onNewMessage: (text: string) => void;
  disabled: boolean;
};

export default function ChatInput({
  placeholder = "메시지를 입력하세요...",
  onNewMessage,
  disabled,
}: ChatInputProps) {
  const [input, setInput] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isDisabled) return;

    onNewMessage(input.trim());
    setInput("");
  };

  const isDisabled = useMemo(
    () => disabled || input.trim().length === 0,
    [disabled, input]
  );

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border-2 border-gray-300 rounded-xl h-12 text-base"
      />
      <Button
        type="submit"
        size="icon"
        className="rounded-full bg-gray-100 border-2 border-gray-300 hover:bg-gray-200 h-12 w-12"
        disabled={isDisabled}
      >
        <ChevronRight className="h-6 w-6 text-gray-700" />
      </Button>
    </form>
  );
}
