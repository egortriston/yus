import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("desktopApi", {
  checkBackend: () => ipcRenderer.invoke("backend:health"),
  listDesktopSources: () => ipcRenderer.invoke("desktop:listSources")
});
