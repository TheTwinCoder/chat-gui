import { ipcMain, app, BrowserWindow, shell } from "electron";
import path from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import * as dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
dotenv.config({ path: ".env.local" });
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
async function generateGeminiResponse(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt
    });
    return {
      success: true,
      data: response.text
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
async function testChromeDriver() {
  const chromedriverPath = "C:\\chatgui\\chat-gui\\electron\\chromedriver.exe";
  const serviceBuilder = new chrome.ServiceBuilder(chromedriverPath);
  const driver = await new Builder().forBrowser("chrome").setChromeService(serviceBuilder).build();
  try {
    await driver.get("https://www.example.com");
    await new Promise((resolve) => setTimeout(resolve, 3e3));
  } finally {
    await driver.quit();
  }
  return {
    success: true,
    message: "Chrome driver test successful"
  };
}
dotenv.config({ path: ".env.local" });
function createWindow() {
  const preloadPath = path.join(__dirname, "../preload/index.mjs");
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 700,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? {} : {},
    //app-icon
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: true
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
ipcMain.handle("gemini:chat", async (_, prompt) => {
  return generateGeminiResponse(prompt);
});
ipcMain.handle("selenium:test", async () => {
  return testChromeDriver();
});
app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
