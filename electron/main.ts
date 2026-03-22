import { app, BrowserWindow, desktopCapturer, ipcMain } from "electron";
import path from "node:path";
import { spawn, ChildProcess } from "node:child_process";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

let mainWindow: BrowserWindow | null = null;
let backendProcess: ChildProcess | null = null;

const isDev = !app.isPackaged;
const moduleDir = path.dirname(fileURLToPath(import.meta.url));

function getBackendDir() {
  return isDev
    ? path.join(process.cwd(), "backend")
    : path.join(process.resourcesPath, "backend");
}

function getRendererEntry() {
  return isDev
    ? "http://localhost:5180"
    : path.join(app.getAppPath(), "dist", "index.html");
}

function resolvePythonBinary() {
  const candidates = [
    process.env.PYTHON_BIN,
    "C:\\Program Files\\pgAdmin 4\\python\\python.exe",
    process.platform === "win32" ? "python" : "python3"
  ].filter(Boolean) as string[];

  return candidates.find((candidate) => (
    candidate.includes("python")
      ? fs.existsSync(candidate) || candidate === "python" || candidate === "python3"
      : false
  )) ?? candidates[0];
}

function startBackend() {
  if (backendProcess) {
    return;
  }

  const cwd = getBackendDir();
  const command = resolvePythonBinary();
  backendProcess = spawn(command, ["run_sidecar.py"], {
    cwd,
    stdio: "ignore",
    env: {
      ...process.env,
      PYTHONPATH: cwd
    }
  });

  backendProcess.on("exit", () => {
    backendProcess = null;
  });

  backendProcess.on("error", () => {
    backendProcess = null;
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1520,
    height: 980,
    minWidth: 1280,
    minHeight: 820,
    backgroundColor: "#0c0c10",
    title: "AI Meeting Assistant",
    webPreferences: {
      preload: path.join(moduleDir, "preload.cjs")
    }
  });

  if (isDev) {
    void mainWindow.loadURL(getRendererEntry());
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    void mainWindow.loadFile(getRendererEntry());
  }
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  ipcMain.handle("backend:health", async () => {
    const response = await fetch("http://127.0.0.1:8765/health");
    return response.json();
  });

  ipcMain.handle("desktop:listSources", async () => {
    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: { width: 0, height: 0 }
    });

    return sources.map((source) => ({
      id: source.id,
      name: source.name,
      displayId: source.display_id
    }));
  });
}).catch((error) => {
  console.error("Failed to initialize Electron app", error);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  backendProcess?.kill();
});
