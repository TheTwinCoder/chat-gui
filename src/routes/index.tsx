import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chat GUI</h1>
      <Link
        to="/test-geminiapi"
        className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Gemini API 테스트하기
      </Link>
    </div>
  );
}
