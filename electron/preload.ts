import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import type { GenerateContentConfig } from "@google/genai";
import type { InteractionAction } from "../src/types/selenium";

export type IpcApiResponse<T = void> = Promise<{
  success: boolean;
  data?: T;
  message?: string;
}>;
// Custom APIs for renderer
const api = {
  geminiChat: (prompt: string, config?: GenerateContentConfig) =>
    ipcRenderer.invoke("gemini:chat", prompt, config),
  seleniumTest: () => ipcRenderer.invoke("selenium:test"),
  seleniumInit: () => ipcRenderer.invoke("selenium:init"),
  seleniumQuit: () => ipcRenderer.invoke("selenium:quit"),
  seleniumOpenUrl: (url: string) => ipcRenderer.invoke("selenium:openUrl", url),
  seleniumInteract: (action: InteractionAction) =>
    ipcRenderer.invoke("selenium:interact", action),
  seleniumGetCurrentUrl: () => ipcRenderer.invoke("selenium:getCurrentUrl"),
  seleniumGetPageHtml: () => ipcRenderer.invoke("selenium:getPageHtml"),
};
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error("Failed to expose Electron API in the renderer:", error);
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI;
  // @ts-expect-error (define in dts)
  window.api = api;
}
