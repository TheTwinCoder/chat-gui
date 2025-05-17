import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <div className="flex flex-col justify-center items-center min-h-screen gradation bg-gradient-to-b from-blue-500 absolute w-full top-0 h-36 z-50">
        <div className="w-[450px] flex justify-between items-center px-4 py-2 mx-2  border-b border-white">
          <h1
            className="text-2xl font-bold text-white"
            onClick={() => {
              window.location.href = "/test";
            }}
          >
            ChatGUI
          </h1>
          <p className="text-sm text-white">손쉬운 컴퓨터 사용을 위한 도우미</p>
        </div>
        
        <Outlet />
      </div>
    </React.Fragment>
  );
}
