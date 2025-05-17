import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/test/selenium")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
  } | null>(null);

  const handleTest = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await window.api.seleniumTest();
      setResult({
        success: response.success,
        message: response.message,
      });
    } catch (err) {
      setResult({
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Selenium 테스트</h1>
        <Link to="/test">
          <Button variant="outline">테스트 메인으로</Button>
        </Link>
      </div>

      <div className="space-y-6">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">테스트 설명</h2>
          <p className="text-gray-600">
            이 페이지는 Selenium을 사용한 웹 자동화 테스트를 실행합니다. 테스트
            버튼을 클릭하면 자동화된 테스트가 실행됩니다.
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleTest}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "테스트 실행 중..." : "테스트 실행"}
          </Button>
        </div>

        {result && (
          <div
            className={`p-4 rounded-lg ${
              result.success
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            <h3 className="font-semibold mb-2">
              {result.success ? "테스트 성공" : "테스트 실패"}
            </h3>
            {result.message && <p>{result.message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
