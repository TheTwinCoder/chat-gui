import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import path from "path";
import { JSDOM } from "jsdom";

const URL = "https://www.google.com/";
export async function testChromeDriver() {
  // const chromedriverPath = "C:\\chatgui\\chat-gui\\electron\\chromedriver.exe";
  const chromedriverPath = path.join(
    __dirname,
    "..",
    "..",
    "electron",
    "chromedriver.exe"
  );
  const serviceBuilder = new chrome.ServiceBuilder(chromedriverPath);

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeService(serviceBuilder)
    .build();
  let cleanedHTML = "";
  try {
    await driver.get(URL);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const pageSource = await driver.getPageSource();
    // jsdom 사용해서 스타일 제거
    const dom = new JSDOM(pageSource);
    const document = dom.window.document;

    // <style> 태그 제거
    document.querySelectorAll("style").forEach((el) => el.remove());

    // <link rel="stylesheet"> 제거
    document
      .querySelectorAll('link[rel="stylesheet"]')
      .forEach((el) => el.remove());

    // style 속성 제거
    document
      .querySelectorAll("[style]")
      .forEach((el) => el.removeAttribute("style"));

    // 정제된 HTML
    cleanedHTML = document.documentElement.outerHTML;
    console.log("Cleaned HTML:", cleanedHTML);
  } finally {
    await driver.quit();
  }
  return {
    success: true,
    message: "Chrome driver test successful",
    html: cleanedHTML,
  };
}
