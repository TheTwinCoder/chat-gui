// components/Loading.tsx
import { Loader2 } from "lucide-react";

interface LoadingProps {
  text?: string;
}

export default function Loading({ text }: LoadingProps) {
  return (
    <div className="w-full flex flex-col gap-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/50">
      {/* 헤더 */}
      <div className="flex items-center gap-2 p-3 text-blue-700 dark:text-blue-300">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-semibold">처리 중</span>
        <span className="text-xs text-blue-500 dark:text-blue-400 ml-auto">
          {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* 컨텐츠 */}
      {text && (
        <div className="flex items-start gap-1.5 p-3 pt-0">
          <div className="flex-shrink-0 w-4 h-4 mt-0.5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <span className="text-[10px] font-medium text-blue-600 dark:text-blue-300">
              L
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-800 dark:text-gray-200">{text}</p>
          </div>
        </div>
      )}
    </div>
  );
}
