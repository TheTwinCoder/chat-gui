import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import path from "path";
export async function testChromeDriver() {
  const chromedriverPath = "C:\\chatgui\\chat-gui\\electron\\chromedriver.exe";
  // build() 호출 빼고 ServiceBuilder 객체 그대로 사용
  const serviceBuilder = new chrome.ServiceBuilder(chromedriverPath);
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeService(serviceBuilder) // build() 하지 않고 ServiceBuilder 넘김
    .build();
  try {
    await driver.get("https://www.example.com");
    await new Promise((resolve) => setTimeout(resolve, 3000));
  } finally {
    await driver.quit();
  }
  return {
    success: true,
    message: "Chrome driver test successful",
  };
}
