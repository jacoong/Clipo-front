/// <reference types="react-scripts" />

declare global {
  interface Window {
    sseConnection: EventSource | null;
  }
}
