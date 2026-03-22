import { useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Hint } from "../components/Hint";
import { apiDelete, apiGet, apiUpload } from "../lib/api";
import type { DocumentRecord } from "../lib/types";

export function KnowledgePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const documents = useQuery({
    queryKey: ["documents"],
    queryFn: () => apiGet<DocumentRecord[]>("/api/documents")
  });

  const upload = useMutation({
    mutationFn: async (file: File) => apiUpload<DocumentRecord>("/api/documents/upload", file),
    onSuccess: async () => {
      await documents.refetch();
    }
  });

  const remove = useMutation({
    mutationFn: async (id: string) => apiDelete(`/api/documents/${id}`),
    onSuccess: async () => {
      await documents.refetch();
    }
  });

  return (
    <section className="workspace-panel workspace-panel-wide">
      <div className="workspace-panel-header">
        <div className="title-row">
          <h3>База знаний</h3>
          <Hint text="Документы из этой базы используются как контекст при генерации stories и summary через RAG-поиск." />
        </div>
      </div>

      <button className="dropzone button-reset" onClick={() => fileInputRef.current?.click()} type="button">
        <strong>Перетащите файлы сюда или нажмите для выбора</strong>
        <span>Поддерживаются PDF, MD, TXT и DOCX. После загрузки документ разобьется на чанки и попадет в индекс.</span>
      </button>

      <input
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload.mutate(file);
        }}
        ref={fileInputRef}
        type="file"
      />

      <div className="list-stack">
        {(documents.data ?? []).map((document) => (
          <article className="history-card" key={document.id}>
            <div>
              <h4>{document.original_name}</h4>
              <p className="muted mono-text">{document.filename}</p>
              {document.error_message && <p className="error-text">{document.error_message}</p>}
            </div>
            <div className="button-row compact">
              <span className="status-pill">{document.status}</span>
              <button className="ghost" onClick={() => remove.mutate(document.id)} type="button">
                Удалить
              </button>
            </div>
          </article>
        ))}

        {!documents.data?.length && (
          <div className="empty-card">
            <h4>Документы пока не загружены</h4>
            <p className="muted">После загрузки документы будут использоваться в RAG-контексте для stories и summary.</p>
          </div>
        )}
      </div>
    </section>
  );
}
