import { GoogleGenAI } from "@google/genai";
import type {
  GenerateContentConfig,
  GenerateContentResponse,
} from "@google/genai";
import * as dotenv from "dotenv";
import { IpcApiResponse } from "./preload";

// TODO: duplicate env load code w/main.ts
dotenv.config({ path: ".env.local" });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function generateGeminiResponse(
  prompt: string,
  config?: GenerateContentConfig
): IpcApiResponse<GenerateContentResponse> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config,
    });
    console.log(response);
    return {
      success: true,
      data: response,
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
