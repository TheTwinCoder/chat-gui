import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/test/")({
  component: RouteComponent,
});

function RouteComponent() {
  const testPages = [
    { path: "/", label: "테스트 나가기" },
    { path: "/test", label: "테스트 메인" },
    { path: "/test/gemini", label: "Gemini API 테스트" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">테스트 페이지</h1>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {testPages.map((page) => (
            <Link key={page.path} to={page.path}>
              <Button variant="outline" className="w-full">
                {page.label}
              </Button>
            </Link>
          ))}
        </div>
        <div className="mt-8 p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">
            현재 페이지: 테스트 메인
          </h2>
          <p>이 페이지는 테스트 기능 네비게이션 허브입니다.</p>
        </div>
      </div>
    </div>
  );
}
