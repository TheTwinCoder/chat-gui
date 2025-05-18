import { ipcMain, app, BrowserWindow, shell } from "electron";
import path from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import * as dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { Builder, until, By } from "selenium-webdriver";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
dotenv.config({ path: ".env.local" });
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
async function generateGeminiResponse(prompt, config) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config
    });
    console.log(response);
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
class SeleniumDriver {
  static {
    this.instance = null;
  }
  static {
    this.isProcessing = false;
  }
  static async getInstance() {
    if (!this.instance) {
      this.instance = await new Builder().forBrowser("chrome").build();
    }
    return this.instance;
  }
  static async quit() {
    if (this.instance) {
      await this.instance.quit();
      this.instance = null;
    }
  }
  static async withDriver(operation) {
    if (this.isProcessing) {
      return {
        success: false,
        message: "Another selenium operation is in progress",
        error: {
          type: "UNKNOWN",
          message: "Another selenium operation is in progress"
        }
      };
    }
    try {
      this.isProcessing = true;
      const driver = await this.getInstance();
      const result = await operation(driver);
      return {
        success: true,
        message: "Operation completed successfully",
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: "Operation failed",
        error: handleSeleniumError(error)
      };
    } finally {
      this.isProcessing = false;
    }
  }
}
function handleSeleniumError(error) {
  if (error instanceof Error) {
    if (error.message.includes("no such element")) {
      return {
        type: "ELEMENT_NOT_FOUND",
        message: error.message,
        originalError: error
      };
    }
    if (error.message.includes("timeout")) {
      return { type: "TIMEOUT", message: error.message, originalError: error };
    }
    if (error.message.includes("Driver not initialized")) {
      return {
        type: "DRIVER_NOT_INITIALIZED",
        message: error.message,
        originalError: error
      };
    }
  }
  return {
    type: "UNKNOWN",
    message: "Unknown error occurred",
    originalError: error
  };
}
const DEFAULT_TIMEOUT = 1e4;
const DEFAULT_POLLING_INTERVAL = 500;
async function waitForElement(driver, by, timeout = DEFAULT_TIMEOUT, pollingInterval = DEFAULT_POLLING_INTERVAL) {
  return await driver.wait(
    until.elementLocated(by),
    timeout,
    `Element not found: ${by.toString()}`,
    pollingInterval
  );
}
async function getElement(driver, locatorType, locator, timeout = DEFAULT_TIMEOUT) {
  const by = locatorType === "id" ? By.id(locator) : By.css(locator);
  return await waitForElement(driver, by, timeout);
}
async function initDriver() {
  return await SeleniumDriver.withDriver(async () => {
  });
}
async function quitDriver() {
  try {
    await SeleniumDriver.quit();
    return {
      success: true,
      message: "Chrome driver closed successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to close driver",
      error: handleSeleniumError(error)
    };
  }
}
async function openUrl(url) {
  return await SeleniumDriver.withDriver(async (driver) => {
    await driver.get(url);
    await driver.wait(
      until.evaluate(() => document.readyState === "complete"),
      DEFAULT_TIMEOUT,
      "Page load timeout"
    );
  });
}
async function performInteraction(action) {
  return await SeleniumDriver.withDriver(async (driver) => {
    const element = await getElement(
      driver,
      action.locatorType,
      action.locator
    );
    switch (action.type) {
      case "click":
        await element.click();
        if (action.waitTime) {
          await new Promise((resolve) => setTimeout(resolve, action.waitTime));
        }
        break;
      case "input":
        await element.clear();
        if (action.value) {
          await element.sendKeys(action.value);
        }
        break;
      case "submit":
        await element.submit();
        if (action.waitTime) {
          await new Promise((resolve) => setTimeout(resolve, action.waitTime));
        }
        break;
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  });
}
async function getCurrentUrl() {
  return await SeleniumDriver.withDriver(async (driver) => {
    return await driver.getCurrentUrl();
  });
}
async function getPageHtml(waitForLoad = true) {
  return await SeleniumDriver.withDriver(async (driver) => {
    if (waitForLoad) {
      await driver.wait(
        async () => {
          const readyState = await driver.executeScript(
            "return document.readyState"
          );
          return readyState === "complete";
        },
        DEFAULT_TIMEOUT,
        "Page load timeout"
      );
    }
    const html = await driver.executeScript(
      "return document.documentElement.outerHTML"
    );
    return html;
  });
}
async function testChromeDriver() {
  try {
    const initResult = await initDriver();
    if (!initResult.success) {
      return initResult;
    }
    const openResult = await openUrl("https://www.example.com");
    if (!openResult.success) {
      return openResult;
    }
    await new Promise((resolve) => setTimeout(resolve, 3e3));
    await quitDriver();
    return {
      success: true,
      message: "Chrome driver test successful"
    };
  } catch (error) {
    return {
      success: false,
      message: "Chrome driver test failed",
      error: handleSeleniumError(error)
    };
  }
}
dotenv.config({ path: ".env.local" });
function createWindow() {
  const preloadPath = path.join(__dirname, "../preload/index.mjs");
  const mainWindow = new BrowserWindow({
    width: 470,
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
ipcMain.handle(
  "gemini:chat",
  async (_, prompt, config) => {
    return generateGeminiResponse(prompt, config);
  }
);
ipcMain.handle("selenium:test", async () => {
  return testChromeDriver();
});
ipcMain.handle("selenium:init", async () => {
  return initDriver();
});
ipcMain.handle("selenium:quit", async () => {
  return quitDriver();
});
ipcMain.handle("selenium:openUrl", async (_, url) => {
  const result = await openUrl(url);
  if (result.success) {
    return getPageHtml();
  }
  return result;
});
ipcMain.handle("selenium:interact", async (_, action) => {
  return performInteraction(action);
});
ipcMain.handle("selenium:getCurrentUrl", async () => {
  return getCurrentUrl();
});
ipcMain.handle("selenium:getPageHtml", async () => {
  return getPageHtml();
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
app.on("window-all-closed", async () => {
  await quitDriver();
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("before-quit", async () => {
  await quitDriver();
});
