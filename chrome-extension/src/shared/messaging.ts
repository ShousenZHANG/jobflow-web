import type { MessageType, MessageResponse } from "./types";

/** Type-safe wrapper for sending messages to the background service worker. */
export function sendMessage<T = unknown>(
  message: MessageType,
  timeoutMs = 10_000,
): Promise<MessageResponse<T>> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve({
        success: false,
        error: "Request timed out",
      });
    }, timeoutMs);

    chrome.runtime.sendMessage(message, (response: MessageResponse<T>) => {
      clearTimeout(timer);
      if (chrome.runtime.lastError) {
        resolve({
          success: false,
          error: chrome.runtime.lastError.message ?? "Unknown error",
        });
        return;
      }
      resolve(response);
    });
  });
}
