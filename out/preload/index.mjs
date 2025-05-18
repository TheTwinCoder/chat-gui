import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
const api = {
  geminiChat: (prompt, config) => ipcRenderer.invoke("gemini:chat", prompt, config),
  seleniumTest: () => ipcRenderer.invoke("selenium:test"),
  seleniumInit: () => ipcRenderer.invoke("selenium:init"),
  seleniumQuit: () => ipcRenderer.invoke("selenium:quit"),
  seleniumOpenUrl: (url) => ipcRenderer.invoke("selenium:openUrl", url),
  seleniumInteract: (action) => ipcRenderer.invoke("selenium:interact", action),
  seleniumGetCurrentUrl: () => ipcRenderer.invoke("selenium:getCurrentUrl"),
  seleniumGetPageHtml: () => ipcRenderer.invoke("selenium:getPageHtml")
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
