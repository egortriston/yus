import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Hint } from "../components/Hint";
import { apiDelete, apiGet, apiPatch, apiPost } from "../lib/api";
import type { SessionDetail, SessionSummary } from "../lib/types";

export function HistoryPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftTranscript, setDraftTranscript] = useState("");

  const sessions = useQuery({
    queryKey: ["history-sessions"],
    queryFn: () => apiGet<SessionSummary[]>("/api/sessions")
  });

  const selectedSession = useQuery({
    queryKey: ["session-detail", selectedId],
    queryFn: () => apiGet<SessionDetail>(`/api/sessions/${selectedId}`),
    enabled: Boolean(selectedId)
  });

  useEffect(() => {
    setDraftTranscript(selectedSession.data?.full_transcript ?? "");
  }, [selectedSession.data?.full_transcript, selectedId]);

  const saveTranscript = useMutation({
    mutationFn: () => apiPatch<SessionDetail>(`/api/sessions/${selectedId}`, { full_transcript: draftTranscript }),
    onSuccess: (data) => setDraftTranscript(data.full_transcript ?? "")
  });

  const regenerateSummary = useMutation({
    mutationFn: () => apiPost(`/api/sessions/${selectedId}/regenerate-summary`),
    onSuccess: async () => {
      await selectedSession.refetch();
    }
  });

  const deleteSession = useMutation({
    mutationFn: () => apiDelete(`/api/sessions/${selectedId}`),
    onSuccess: async () => {
      setSelectedId(null);
      await sessions.refetch();
    }
  });

  return (
    <div className="workspace-grid">
      <section className="workspace-panel">
        <div className="workspace-panel-header">
          <div className="title-row">
            <h3>История встреч</h3>
            <Hint text="Здесь собраны все завершенные встречи. Выберите сессию, чтобы открыть транскрипт, summary и аудиофайлы." />
          </div>
        </div>

        <div className="list-stack">
          {(sessions.data ?? []).map((session) => (
            <button className="history-card button-reset" key={session.id} onClick={() => setSelectedId(session.id)} type="button">
              <div>
                <h4>{session.title ?? "Без названия"}</h4>
                <p className="muted">{new Date(session.started_at).toLocaleString("ru-RU")}</p>
                {session.raw_audio_path && <p className="muted mono-text">{session.raw_audio_path}</p>}
              </div>
              <span className="status-pill subtle">{session.duration_seconds ?? 0} сек</span>
            </button>
          ))}

          {!sessions.data?.length && (
            <div className="empty-card">
              <h4>Сессий пока нет</h4>
              <p className="muted">Запишите первую встречу на вкладке «Запись», и она сразу появится в архиве.</p>
            </div>
          )}
        </div>
      </section>

      <section className="workspace-panel workspace-panel-wide">
        {selectedSession.data ? (
          <>
            <div className="workspace-panel-header">
              <div className="title-row">
                <h3>{selectedSession.data.title ?? "Без названия"}</h3>
                <Hint text="После завершения сессии здесь можно отредактировать транскрипт, посмотреть summary и сохранить итоговую структуру встречи." />
              </div>
              <div className="button-row compact">
                <button className="secondary" onClick={() => regenerateSummary.mutate()} type="button">
                  Пересобрать summary
                </button>
                <button className="ghost" onClick={() => deleteSession.mutate()} type="button">
                  Удалить
                </button>
              </div>
            </div>

            <div className="meta-grid">
              <article className="meta-card">
                <span className="meta-label">Начало</span>
                <strong>{new Date(selectedSession.data.started_at).toLocaleString("ru-RU")}</strong>
              </article>
              <article className="meta-card">
                <span className="meta-label">Длительность</span>
                <strong>{selectedSession.data.duration_seconds ?? 0} сек</strong>
              </article>
              <article className="meta-card">
                <span className="meta-label">Аудиоархив</span>
                <strong>{selectedSession.data.raw_audio_path ? "Сохранен" : "Нет данных"}</strong>
              </article>
            </div>

            <div className="section-stack">
              <div className="feed-card">
                <div className="section-head">
                  <div className="title-row">
                    <h4>Транскрипт</h4>
                    <Hint text="После ручного редактирования текст можно сохранить, и он будет использоваться для следующей регенерации summary." />
                  </div>
                  <span className="section-note">Редактируемый текст</span>
                </div>
                <textarea className="prompt-editor" value={draftTranscript} onChange={(event) => setDraftTranscript(event.target.value)} />
                <div className="button-row">
                  <button className="primary" onClick={() => saveTranscript.mutate()} type="button">
                    Сохранить транскрипт
                  </button>
                </div>
              </div>

              <div className="workspace-subgrid">
                <div className="summary-box">
                  <div className="section-head">
                    <div className="title-row">
                      <h4>Подтвержденные stories</h4>
                      <Hint text="Здесь остаются только подтвержденные карточки, которые вошли в итог встречи." />
                    </div>
                    <span className="section-note">{selectedSession.data.stories.length} шт.</span>
                  </div>
                  <div className="list-stack">
                    {selectedSession.data.stories.length === 0 && <p className="muted">Подтвержденных stories для этой сессии пока нет.</p>}
                    {selectedSession.data.stories.map((story) => (
                      <article className="story-card" key={story.id}>
                        <p>{story.full_story}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="summary-box">
                  <div className="section-head">
                    <div className="title-row">
                      <h4>Путь к сырому аудио</h4>
                      <Hint text="Если сохранение аудио включено, здесь отображается путь к локальному архиву с чанками записи." />
                    </div>
                    <span className="section-note">Storage</span>
                  </div>
                  <pre>{selectedSession.data.raw_audio_path ?? "Сохранение аудио не включалось или запись еще не велась."}</pre>
                </div>
              </div>

              <div className="summary-box">
                <div className="section-head">
                  <div className="title-row">
                    <h4>Summary</h4>
                    <Hint text="Итог встречи формируется автоматически после остановки записи и может быть пересобран вручную." />
                  </div>
                  <span className="section-note">Generated markdown</span>
                </div>
                <pre>{selectedSession.data.summary_markdown ?? "Summary пока не сгенерировано."}</pre>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-panel">
            <h3>Выберите сессию</h3>
            <p className="muted">Слева отображаются все встречи. После выбора откроются транскрипт, summary, stories и путь к аудиоархиву.</p>
          </div>
        )}
      </section>
    </div>
  );
}
