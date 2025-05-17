import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
const api = {
  geminiChat: (prompt, config) => ipcRenderer.invoke("gemini:chat", prompt, config),
  seleniumTest: () => ipcRenderer.invoke("selenium:test")
};
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error("Failed to expose Electron API in the renderer:", error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
