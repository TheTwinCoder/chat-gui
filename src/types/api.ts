import type {
  GenerateContentConfig,
  GenerateContentResponse,
} from "@google/genai";
export interface IpcApiResponse<T = void> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ElectronApi {
  geminiChat: (
    prompt: string,
    config?: GenerateContentConfig
  ) => Promise<IpcApiResponse<GenerateContentResponse>>;
  seleniumTest: () => Promise<IpcApiResponse<void>>;
}

declare global {
  interface Window {
    api: ElectronApi;
  }
}
