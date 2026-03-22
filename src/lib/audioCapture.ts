export type CaptureSource = "mic" | "desktop";

export interface AudioChunkPayload {
  source: CaptureSource;
  audioBase64: string;
  mimeType: string;
  sampleRateHz: number;
}

export interface CaptureStartOptions {
  enableMic: boolean;
  enableDesktop: boolean;
  desktopSourceId?: string | null;
  chunkMs?: number;
  onChunk: (payload: AudioChunkPayload) => Promise<void> | void;
  onLevel: (source: CaptureSource, level: number) => void;
}

interface ActiveRecorder {
  source: CaptureSource;
  recorder: MediaRecorder;
  stream: MediaStream;
  rootStream: MediaStream;
  audioContext: AudioContext;
  analyser: AnalyserNode;
  rafId: number;
}

function ensureMimeType(): string {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return candidates.find((item) => MediaRecorder.isTypeSupported(item)) ?? "audio/webm";
}

async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let index = 0; index < bytes.byteLength; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return btoa(binary);
}

function watchLevel(source: CaptureSource, stream: MediaStream, onLevel: (source: CaptureSource, level: number) => void) {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  const mediaSource = audioContext.createMediaStreamSource(stream);
  mediaSource.connect(analyser);
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  const tick = () => {
    analyser.getByteFrequencyData(dataArray);
    const sum = dataArray.reduce((acc, value) => acc + value, 0);
    const level = Math.min(100, Math.round(sum / dataArray.length / 2.55));
    onLevel(source, level);
    rafId = window.requestAnimationFrame(tick);
  };

  let rafId = window.requestAnimationFrame(tick);
  return { audioContext, analyser, rafId };
}

async function createRecorder(
  source: CaptureSource,
  rootStream: MediaStream,
  stream: MediaStream,
  chunkMs: number,
  onChunk: (payload: AudioChunkPayload) => Promise<void> | void,
  onLevel: (source: CaptureSource, level: number) => void
): Promise<ActiveRecorder> {
  const mimeType = ensureMimeType();
  const recorder = new MediaRecorder(stream, { mimeType });
  recorder.addEventListener("dataavailable", async (event) => {
    if (!event.data || event.data.size === 0) {
      return;
    }
    const audioBase64 = await blobToBase64(event.data);
    await onChunk({
      source,
      audioBase64,
      mimeType: event.data.type || mimeType,
      sampleRateHz: 16000
    });
  });

  const meter = watchLevel(source, stream, onLevel);
  recorder.start(chunkMs);
  return {
    source,
    recorder,
    stream,
    rootStream,
    audioContext: meter.audioContext,
    analyser: meter.analyser,
    rafId: meter.rafId
  };
}

async function stopRecorder(item: ActiveRecorder): Promise<void> {
  await new Promise<void>((resolve) => {
    if (item.recorder.state === "inactive") {
      resolve();
      return;
    }

    item.recorder.addEventListener("stop", () => resolve(), { once: true });
    item.recorder.stop();
  });

  window.cancelAnimationFrame(item.rafId);
  item.analyser.disconnect();
  await item.audioContext.close();
  item.stream.getTracks().forEach((track) => track.stop());
  item.rootStream.getTracks().forEach((track) => track.stop());
}

async function captureDesktopSource(sourceId: string): Promise<{ rootStream: MediaStream; stream: MediaStream }> {
  const rootStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: sourceId
      }
    } as MediaTrackConstraints,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: sourceId,
        maxWidth: 1920,
        maxHeight: 1080,
        maxFrameRate: 15
      }
    } as MediaTrackConstraints
  } as MediaStreamConstraints);

  const audioTracks = rootStream.getAudioTracks();
  if (audioTracks.length === 0) {
    rootStream.getTracks().forEach((track) => track.stop());
    throw new Error("Системный звук не был получен от выбранного экрана. Выберите экран целиком, а не окно, и убедитесь, что в системе реально идёт воспроизведение звука.");
  }

  return {
    rootStream,
    stream: new MediaStream(audioTracks)
  };
}

export class AudioCaptureController {
  private recorders: ActiveRecorder[] = [];

  async start(options: CaptureStartOptions): Promise<void> {
    const chunkMs = options.chunkMs ?? 2000;
    if (!options.enableMic && !options.enableDesktop) {
      throw new Error("Выберите хотя бы один источник аудио.");
    }

    if (options.enableMic) {
      const micRoot = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const micStream = new MediaStream(micRoot.getAudioTracks());
      this.recorders.push(await createRecorder("mic", micRoot, micStream, chunkMs, options.onChunk, options.onLevel));
    }

    if (options.enableDesktop) {
      if (!options.desktopSourceId) {
        throw new Error("Сначала выберите экран для захвата системного звука.");
      }

      const { rootStream, stream } = await captureDesktopSource(options.desktopSourceId);
      this.recorders.push(await createRecorder("desktop", rootStream, stream, chunkMs, options.onChunk, options.onLevel));
    }
  }

  async stop(): Promise<void> {
    const active = [...this.recorders];
    this.recorders = [];
    await Promise.all(active.map((item) => stopRecorder(item)));
  }
}
