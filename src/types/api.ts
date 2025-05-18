import type {
  GenerateContentConfig,
  GenerateContentResponse,
} from "@google/genai";
import type { InteractionAction } from "./selenium";

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
  seleniumInit: () => Promise<IpcApiResponse<void>>;
  seleniumQuit: () => Promise<IpcApiResponse<void>>;
  seleniumOpenUrl: (url: string) => Promise<IpcApiResponse<string>>;
  seleniumInteract: (
    action: InteractionAction
  ) => Promise<IpcApiResponse<void>>;
  seleniumGetCurrentUrl: () => Promise<IpcApiResponse<string>>;
  seleniumGetPageHtml: () => Promise<IpcApiResponse<string>>;
}

declare global {
  interface Window {
    api: ElectronApi;
  }
}
