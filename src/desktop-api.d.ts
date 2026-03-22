export interface DesktopSourceOption {
  id: string;
  name: string;
  displayId: string;
}

declare global {
  interface Window {
    desktopApi?: {
      checkBackend: () => Promise<{ status: string }>;
      listDesktopSources: () => Promise<DesktopSourceOption[]>;
    };
  }
}

export {};
