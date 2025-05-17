import { ipcMain, app, BrowserWindow, shell } from "electron";
import path from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import * as dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { JSDOM } from "jsdom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
dotenv.config({ path: ".env.local" });
const GEMINI_API_KEY$1 = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY$1 });
async function generateGeminiResponse(prompt2) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt2
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
dotenv.config({ path: ".env.local" });
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");
const prompt = JSON.parse(
  fs.readFileSync("./electron/prompt.json", "utf-8")
).prompt;
async function getTag(html, purpose) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-04-17"
    });
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 100
      }
    });
    const msg = purpose + "\n\n" + html;
    const result = await chat.sendMessage(msg);
    console.log(result);
    return {
      success: true,
      data: String(result)
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
const URL = "https://www.google.com/";
async function testChromeDriver() {
  const chromedriverPath = path.join(
    __dirname,
    "..",
    "..",
    "electron",
    "chromedriver.exe"
  );
  const serviceBuilder = new chrome.ServiceBuilder(chromedriverPath);
  const driver = await new Builder().forBrowser("chrome").setChromeService(serviceBuilder).build();
  let cleanedHTML = "";
  try {
    await driver.get(URL);
    await new Promise((resolve) => setTimeout(resolve, 3e3));
    const pageSource = await driver.getPageSource();
    const dom = new JSDOM(pageSource);
    const document = dom.window.document;
    document.querySelectorAll("style").forEach((el) => el.remove());
    document.querySelectorAll('link[rel="stylesheet"]').forEach((el) => el.remove());
    document.querySelectorAll("[style]").forEach((el) => el.removeAttribute("style"));
    cleanedHTML = document.documentElement.outerHTML;
    console.log("Cleaned HTML:", cleanedHTML);
    getTag(cleanedHTML, "나는 gemail을 사용하고 싶어!");
  } finally {
    await driver.quit();
  }
  return {
    success: true,
    message: "Chrome driver test successful",
    html: cleanedHTML
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
ipcMain.handle("gemini:chat", async (_, prompt2) => {
  return generateGeminiResponse(prompt2);
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
