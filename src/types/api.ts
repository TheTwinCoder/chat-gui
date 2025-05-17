export interface IpcApiResponse<T = void> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ElectronApi {
  geminiChat: (prompt: string) => Promise<IpcApiResponse<string>>;
  seleniumTest: () => Promise<IpcApiResponse<void>>;
}

declare global {
  interface Window {
    api: ElectronApi;
  }
}
