import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface ChatMessageProps {
  message: string
  isUser?: boolean
  timestamp?: string
}

export default function ChatMessage({ message, isUser = false, timestamp }: ChatMessageProps) {
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <Card className={cn("max-w-[80%] p-3 rounded-xl", isUser ? "bg-blue-100" : "bg-white border border-gray-300")}>
        <p className="text-sm">{message}</p>
        {timestamp && <p className="text-xs text-gray-500 mt-1 text-right">{timestamp}</p>}
      </Card>
    </div>
  )
}
