import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    api: {
      geminiChat: (prompt: string) => Promise<{
        success: boolean;
        data?: string;
        message?: string;
      }>;
    };
  }
}

export const Route = createFileRoute("/test/gemini")({
  component: TestGeminiAPI,
});

function TestGeminiAPI() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await window.api.geminiChat(prompt);
      if (result.success && result.data) {
        setResponse(result.data);
      } else {
        setError(result.message || "알 수 없는 오류가 발생했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gemini API 테스트</h1>
        <Link to="/test">
          <Button variant="outline">테스트 메인으로</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            프롬프트
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border rounded-md min-h-[100px]"
            placeholder="Gemini에게 물어보고 싶은 것을 입력하세요..."
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full sm:w-auto"
        >
          {isLoading ? "응답 대기 중..." : "전송"}
        </Button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">응답:</h2>
          <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}
    </div>
  );
}
