import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Hint } from "../components/Hint";
import type { DesktopSourceOption } from "../desktop-api";
import { AudioCaptureController } from "../lib/audioCapture";
import { apiGet, apiPost } from "../lib/api";
import type { SessionSummary, StoryCard } from "../lib/types";

interface TranscriptEvent {
  type: string;
  speaker_label?: string;
  text?: string;
  story?: StoryCard;
  story_id?: string;
}

export function MeetingPage() {
  const captureRef = useRef(new AudioCaptureController());
  const [activeSession, setActiveSession] = useState<SessionSummary | null>(null);
  const [transcript, setTranscript] = useState<Array<{ speaker: string; text: string }>>([]);
  const [stories, setStories] = useState<StoryCard[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [enableMic, setEnableMic] = useState(true);
  const [enableDesktop, setEnableDesktop] = useState(true);
  const [levels, setLevels] = useState({ desktop: 0, mic: 0 });
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [desktopSources, setDesktopSources] = useState<DesktopSourceOption[]>([]);
  const [desktopSourceId, setDesktopSourceId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      void captureRef.current.stop().catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    const loadSources = async () => {
      try {
        const sources = await window.desktopApi?.listDesktopSources?.();
        const normalized = sources ?? [];
        setDesktopSources(normalized);
        setDesktopSourceId((current) => current ?? normalized[0]?.id ?? null);
      } catch {
        setDesktopSources([]);
      }
    };

    void loadSources();
  }, []);

  const sessions = useQuery({
    queryKey: ["sessions"],
    queryFn: () => apiGet<SessionSummary[]>("/api/sessions")
  });

  useEffect(() => {
    if (!activeSession) return;

    const socket = new WebSocket(`ws://127.0.0.1:8765/ws/sessions/${activeSession.id}/events`);
    socket.onmessage = (event) => {
      const payload: TranscriptEvent = JSON.parse(event.data);

      if (payload.type === "transcript.segment" && payload.text) {
        setTranscript((current) => [
          ...current,
          { speaker: payload.speaker_label ?? "Неизвестный спикер", text: payload.text! }
        ]);
      }

      if (payload.type === "story.proposed" && payload.story) {
        setStories((current) => [payload.story!, ...current]);
      }

      if (payload.type === "story.confirmed" || payload.type === "story.declined") {
        setStories((current) => current.filter((item) => item.id !== payload.story_id));
      }

      if (payload.type === "session.stopped") {
        setActiveSession(null);
        setIsRecording(false);
        setLevels({ desktop: 0, mic: 0 });
      }
    };

    return () => socket.close();
  }, [activeSession]);

  const startRecording = useMutation({
    mutationFn: async () => {
      setCaptureError(null);

      if (enableDesktop && !desktopSourceId) {
        throw new Error("Выберите экран для системного звука перед стартом записи.");
      }

      const session = await apiPost<SessionSummary>("/api/sessions", {
        title: `Meeting ${new Date().toLocaleString("ru-RU")}`
      });

      setActiveSession(session);
      setTranscript([]);
      setStories([]);

      await captureRef.current.start({
        enableMic,
        enableDesktop,
        desktopSourceId,
        chunkMs: 2000,
        onChunk: async (payload) => {
          await apiPost(`/api/sessions/${session.id}/audio-chunk`, {
            source: payload.source,
            sample_rate_hz: payload.sampleRateHz,
            mime_type: payload.mimeType,
            audio_base64: payload.audioBase64
          });
        },
        onLevel: (source, level) => {
          setLevels((current) => ({ ...current, [source]: level }));
        }
      });

      setIsRecording(true);
      return session;
    },
    onError: (error) => {
      setCaptureError(error instanceof Error ? error.message : "Не удалось начать запись.");
      setIsRecording(false);
    }
  });

  const stopSession = useMutation({
    mutationFn: async () => {
      if (!activeSession) throw new Error("No session");
      await captureRef.current.stop();
      setIsRecording(false);
      setLevels({ desktop: 0, mic: 0 });
      return apiPost(`/api/sessions/${activeSession.id}/stop`);
    },
    onError: (error) => {
      setCaptureError(error instanceof Error ? error.message : "Не удалось остановить запись.");
    }
  });

  const confirmStory = useMutation({
    mutationFn: async (story: StoryCard) => apiPost(`/api/sessions/${story.session_id}/stories/${story.id}/confirm`)
  });

  const declineStory = useMutation({
    mutationFn: async (story: StoryCard) => apiPost(`/api/sessions/${story.session_id}/stories/${story.id}/decline`)
  });

  const status = useMemo(() => {
    if (stopSession.isPending) return "Идет пост-обработка встречи";
    if (isRecording && activeSession) return `Идет запись: ${activeSession.title ?? activeSession.id}`;
    if (activeSession) return `Сессия активна: ${activeSession.title ?? activeSession.id}`;
    return "Сессия не запущена";
  }, [activeSession, isRecording, stopSession.isPending]);

  const selectedDesktopSource = desktopSources.find((source) => source.id === desktopSourceId);

  return (
    <div className="workspace-grid">
      <section className="workspace-panel workspace-panel-wide">
        <div className="workspace-panel-header">
          <div className="title-row">
            <h3>Запись встречи</h3>
            <Hint text="Запись идет двумя потоками: микрофон и системный звук. Чанки сразу уходят в backend для транскрибации и анализа." />
          </div>
          <span className="status-pill">{status}</span>
        </div>

        <div className="section-stack">
          <div className="section-head">
            <div className="title-row">
              <h4>Источники</h4>
              <Hint text="Для системного звука лучше выбирать экран целиком. Захват окна в Windows часто не отдает loopback audio." />
            </div>
            <span className="section-note">{sessions.data?.length ?? 0} сессий</span>
          </div>

          <div className="control-grid">
            <label className="toggle-card">
              <input checked={enableDesktop} disabled={isRecording} onChange={(event) => setEnableDesktop(event.target.checked)} type="checkbox" />
              <span>Захватывать системный звук</span>
            </label>

            <label className="toggle-card">
              <input checked={enableMic} disabled={isRecording} onChange={(event) => setEnableMic(event.target.checked)} type="checkbox" />
              <span>Захватывать микрофон</span>
            </label>

            <label className="field-block field-block-wide">
              <span className="field-label">
                Экран для desktop audio
                <Hint text="Если системный звук не двигается на индикаторе, сначала проверьте, что выбран экран, а не окно." />
              </span>
              <select
                className="field-input"
                disabled={isRecording || !enableDesktop}
                onChange={(event) => setDesktopSourceId(event.target.value)}
                value={desktopSourceId ?? ""}
              >
                {desktopSources.length === 0 && <option value="">Нет доступных экранов</option>}
                {desktopSources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </select>
              {selectedDesktopSource && <span className="field-help">Выбран источник: {selectedDesktopSource.name}</span>}
            </label>
          </div>

          <div className="meter-grid">
            <div className="meter-card">
              <span>Системный звук</span>
              <div className="meter"><div style={{ width: `${levels.desktop}%` }} /></div>
            </div>
            <div className="meter-card">
              <span>Микрофон</span>
              <div className="meter"><div style={{ width: `${levels.mic}%` }} /></div>
            </div>
          </div>

          <div className="button-row">
            <button className="primary" disabled={isRecording || startRecording.isPending} onClick={() => startRecording.mutate()} type="button">
              Начать запись
            </button>
            <button className="ghost" disabled={!activeSession || stopSession.isPending} onClick={() => stopSession.mutate()} type="button">
              Остановить
            </button>
          </div>
        </div>

        {captureError && <div className="error-banner">{captureError}</div>}

        <div className="feed-card">
          <div className="section-head">
            <div className="title-row">
              <h4>Транскрибация</h4>
              <Hint text="Новые фразы появляются по мере прихода аудиочанков. Если в речи появится требование, справа будет предложена story." />
            </div>
            <span className="section-note">Realtime transcript</span>
          </div>

          <div className="transcript-feed">
            {transcript.length === 0 && (
              <div className="empty-card compact-empty">
                <p className="muted">После старта записи здесь появятся фразы участников.</p>
              </div>
            )}

            {transcript.map((item, index) => (
              <article className="transcript-item" key={`${item.speaker}-${index}`}>
                <strong>{item.speaker}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="workspace-panel">
        <div className="workspace-panel-header">
          <div className="title-row">
            <h3>Предложения user stories</h3>
            <Hint text="Показываются только новые требования, решения и задачи. Карточки можно сразу подтвердить или отклонить." />
          </div>
          <span className="status-pill subtle">{stories.length} в ожидании</span>
        </div>

        <div className="story-list">
          {stories.map((story) => (
            <article className="story-card" key={story.id}>
              <span className="timer">TTL 3 минуты</span>
              <p>{story.full_story}</p>
              <div className="button-row compact">
                <button className="primary" onClick={() => confirmStory.mutate(story)} type="button">
                  Подтвердить
                </button>
                <button className="ghost" onClick={() => declineStory.mutate(story)} type="button">
                  Отклонить
                </button>
              </div>
            </article>
          ))}

          {stories.length === 0 && (
            <div className="empty-card">
              <p className="eyebrow">Waiting for signal</p>
              <h4>Карточек пока нет</h4>
              <p className="muted">Как только в разговоре появится новое требование, решение или задача, справа появится предложение user story.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
