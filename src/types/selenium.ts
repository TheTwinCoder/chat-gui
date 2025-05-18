export type LocatorType = "id" | "css";

export type InteractionActionType = "click" | "input" | "submit";

export interface InteractionAction {
  type: InteractionActionType;
  locatorType: LocatorType;
  locator: string;
  value?: string;
  waitTime?: number;
}

export interface SeleniumActionResult<T = void> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    type:
      | "DRIVER_NOT_INITIALIZED"
      | "ELEMENT_NOT_FOUND"
      | "TIMEOUT"
      | "UNKNOWN";
    message: string;
    originalError?: unknown;
  };
}
