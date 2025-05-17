import { Builder, By } from "selenium-webdriver";

export async function testChromeDriver() {
  const driver = await new Builder().forBrowser("chrome").build();

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
