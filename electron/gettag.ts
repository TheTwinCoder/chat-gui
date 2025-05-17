import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import { IpcApiResponse } from "./preload";
import fs from "fs";

// TODO: duplicate env load code w/main.ts
dotenv.config({ path: ".env.local" });
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");
const prompt = JSON.parse(
  fs.readFileSync("./electron/prompt.json", "utf-8")
).prompt;

export default async function getTag(
  html: string,
  purpose: string
): IpcApiResponse<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-04-17",
    });
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 100,
      },
    });
    const msg = purpose + "\n\n" + html;
    const result = await chat.sendMessage(msg);
    console.log(result);
    return {
      success: true,
      data: String(result),
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
