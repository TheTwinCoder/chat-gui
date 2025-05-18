export function ChatHeader() {
  return (
    <div className="px-4 py-2 border-b border-black">
      <div className="flex justify-between items-center">
        <h1
          className="text-2xl font-bold cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => {
            window.location.href = "/test";
          }}
        >
          ChatGUI
        </h1>
        <p className="text-sm text-gray-600">
          손쉬운 인터넷 사용을 위한 도우미
        </p>
      </div>
    </div>
  );
}
