import { Builder, By, until, WebDriver, WebElement } from "selenium-webdriver";
import type { InteractionAction, LocatorType } from "../src/types/selenium";

// 에러 타입 정의
export type SeleniumErrorType =
  | "DRIVER_NOT_INITIALIZED"
  | "ELEMENT_NOT_FOUND"
  | "TIMEOUT"
  | "UNKNOWN";

export interface SeleniumError {
  type: SeleniumErrorType;
  message: string;
  originalError?: unknown;
}

// 결과 타입 정의
export type SeleniumResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
  error?: SeleniumError;
};

// 드라이버 관리 클래스
class SeleniumDriver {
  private static instance: WebDriver | null = null;
  private static isProcessing = false;

  static async getInstance(): Promise<WebDriver> {
    if (!this.instance) {
      this.instance = await new Builder().forBrowser("chrome").build();
    }
    return this.instance;
  }

  static async quit(): Promise<void> {
    if (this.instance) {
      await this.instance.quit();
      this.instance = null;
    }
  }

  static async withDriver<T>(
    operation: (driver: WebDriver) => Promise<T>
  ): Promise<SeleniumResult<T>> {
    if (this.isProcessing) {
      return {
        success: false,
        message: "Another selenium operation is in progress",
        error: {
          type: "UNKNOWN",
          message: "Another selenium operation is in progress",
        },
      };
    }

    try {
      this.isProcessing = true;
      const driver = await this.getInstance();
      const result = await operation(driver);
      return {
        success: true,
        message: "Operation completed successfully",
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: "Operation failed",
        error: handleSeleniumError(error),
      };
    } finally {
      this.isProcessing = false;
    }
  }
}

// 에러 처리 함수
function handleSeleniumError(error: unknown): SeleniumError {
  if (error instanceof Error) {
    if (error.message.includes("no such element")) {
      return {
        type: "ELEMENT_NOT_FOUND",
        message: error.message,
        originalError: error,
      };
    }
    if (error.message.includes("timeout")) {
      return { type: "TIMEOUT", message: error.message, originalError: error };
    }
    if (error.message.includes("Driver not initialized")) {
      return {
        type: "DRIVER_NOT_INITIALIZED",
        message: error.message,
        originalError: error,
      };
    }
  }
  return {
    type: "UNKNOWN",
    message: "Unknown error occurred",
    originalError: error,
  };
}

// 타임아웃 상수
const DEFAULT_TIMEOUT = 10000;
const DEFAULT_POLLING_INTERVAL = 500;

// 요소 대기 함수
async function waitForElement(
  driver: WebDriver,
  by: By,
  timeout = DEFAULT_TIMEOUT,
  pollingInterval = DEFAULT_POLLING_INTERVAL
): Promise<WebElement> {
  return await driver.wait(
    until.elementLocated(by),
    timeout,
    `Element not found: ${by.toString()}`,
    pollingInterval
  );
}

// 요소 찾기 함수
async function getElement(
  driver: WebDriver,
  locatorType: LocatorType,
  locator: string,
  timeout = DEFAULT_TIMEOUT
): Promise<WebElement> {
  const by = locatorType === "id" ? By.id(locator) : By.css(locator);
  return await waitForElement(driver, by, timeout);
}

// 드라이버 초기화
export async function initDriver(): Promise<SeleniumResult<void>> {
  return await SeleniumDriver.withDriver(async () => {
    // 드라이버가 이미 초기화되어 있으므로 추가 작업이 필요 없음
  });
}

// 드라이버 종료
export async function quitDriver(): Promise<SeleniumResult<void>> {
  try {
    await SeleniumDriver.quit();
    return {
      success: true,
      message: "Chrome driver closed successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to close driver",
      error: handleSeleniumError(error),
    };
  }
}

// URL 열기
export async function openUrl(url: string): Promise<SeleniumResult<void>> {
  return await SeleniumDriver.withDriver(async (driver) => {
    await driver.get(url);
    await driver.wait(
      until.evaluate(() => document.readyState === "complete"),
      DEFAULT_TIMEOUT,
      "Page load timeout"
    );
  });
}

// 상호작용 액션 실행
export async function performInteraction(
  action: InteractionAction
): Promise<SeleniumResult<void>> {
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

// 기존 함수들은 유지하되 내부적으로 performInteraction 사용
export async function clickElement(
  locatorType: LocatorType,
  locator: string,
  waitTime?: number
): Promise<SeleniumResult<void>> {
  return await performInteraction({
    type: "click",
    locatorType,
    locator,
    waitTime,
  });
}

export async function inputText(
  locatorType: LocatorType,
  locator: string,
  value: string
): Promise<SeleniumResult<void>> {
  return await performInteraction({
    type: "input",
    locatorType,
    locator,
    value,
  });
}

export async function submitForm(
  locatorType: LocatorType,
  locator: string,
  waitTime?: number
): Promise<SeleniumResult<void>> {
  return await performInteraction({
    type: "submit",
    locatorType,
    locator,
    waitTime,
  });
}

// 현재 URL 가져오기
export async function getCurrentUrl(): Promise<SeleniumResult<string>> {
  return await SeleniumDriver.withDriver(async (driver) => {
    return await driver.getCurrentUrl();
  });
}

// HTML 가져오기
export async function getPageHtml(
  waitForLoad = true
): Promise<SeleniumResult<string>> {
  return await SeleniumDriver.withDriver(async (driver) => {
    if (waitForLoad) {
      // 페이지 로딩 대기 방식 변경
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

    // HTML 가져오기
    const html = (await driver.executeScript(
      "return document.documentElement.outerHTML"
    )) as string;

    return html;
  });
}

// 테스트 함수
export async function testChromeDriver(): Promise<SeleniumResult<void>> {
  try {
    const initResult = await initDriver();
    if (!initResult.success) {
      return initResult;
    }

    const openResult = await openUrl("https://www.example.com");
    if (!openResult.success) {
      return openResult;
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
    await quitDriver();

    return {
      success: true,
      message: "Chrome driver test successful",
    };
  } catch (error) {
    return {
      success: false,
      message: "Chrome driver test failed",
      error: handleSeleniumError(error),
    };
  }
}
