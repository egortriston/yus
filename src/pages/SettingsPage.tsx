import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Hint } from "../components/Hint";
import { apiGet, apiPut } from "../lib/api";
import type { PromptSettings, ProviderSettings } from "../lib/types";

const defaultProviders: ProviderSettings = {
  llm_provider: "qwen-local-openai-compatible",
  llm_model: "qwen-plus",
  embedding_provider: "qwen-local-openai-compatible",
  embedding_model: "text-embedding-v4",
  stt_provider: "qwen-dashscope-asr-realtime",
  stt_model: "qwen3-asr-flash-realtime",
  batch_stt_provider: "qwen-dashscope-asr-file",
  batch_stt_model: "qwen3-asr-flash-filetrans",
  provider_base_url: "http://127.0.0.1:11434/v1",
  provider_region: "local",
  api_key_ref: null,
  user_country: "RU",
  user_timezone: "Europe/Moscow",
  ui_language: "ru-RU",
  transcript_language: "auto",
  audio_storage_enabled: true,
  audio_storage_dir: null
};

export function SettingsPage() {
  const promptQuery = useQuery({
    queryKey: ["prompt"],
    queryFn: () => apiGet<PromptSettings>("/api/prompt")
  });
  const providerQuery = useQuery({
    queryKey: ["provider-settings"],
    queryFn: () => apiGet<ProviderSettings>("/api/settings")
  });

  const [prompt, setPrompt] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");
  const [providerState, setProviderState] = useState<ProviderSettings>(defaultProviders);

  useEffect(() => {
    setPrompt(promptQuery.data?.system_prompt ?? "");
  }, [promptQuery.data?.system_prompt]);

  useEffect(() => {
    setProviderState(providerQuery.data ?? defaultProviders);
  }, [providerQuery.data]);

  useEffect(() => {
    window.desktopApi?.checkBackend()
      .then((result) => setBackendStatus(result.status))
      .catch(() => setBackendStatus("error"));
  }, []);

  const savePrompt = useMutation({
    mutationFn: () => apiPut<PromptSettings>("/api/prompt", { system_prompt: prompt })
  });

  const saveProviders = useMutation({
    mutationFn: () => apiPut<ProviderSettings>("/api/settings", providerState)
  });

  const applyRussiaPreset = () => {
    setProviderState((current) => ({
      ...current,
      llm_provider: "qwen-local-openai-compatible",
      embedding_provider: "qwen-local-openai-compatible",
      provider_base_url: current.provider_base_url || "http://127.0.0.1:11434/v1",
      provider_region: "local",
      user_country: "RU",
      user_timezone: "Europe/Moscow",
      ui_language: "ru-RU",
      transcript_language: "auto",
      audio_storage_enabled: true
    }));
  };

  const applyDashScopePreset = () => {
    setProviderState((current) => ({
      ...current,
      llm_provider: "qwen-dashscope-chat",
      embedding_provider: "qwen-dashscope-embedding",
      stt_provider: "qwen-dashscope-asr-realtime",
      batch_stt_provider: "qwen-dashscope-asr-file",
      provider_region: "singapore",
      provider_base_url: null
    }));
  };

  return (
    <div className="workspace-grid settings-grid">
      <section className="workspace-panel workspace-panel-wide">
        <div className="workspace-panel-header">
          <div className="title-row">
            <h3>Промпт ассистента</h3>
            <Hint text="Системный prompt определяет стиль ответа, правила генерации stories и то, как собирается итог встречи." />
          </div>
          <span className="status-pill">backend: {backendStatus}</span>
        </div>

        <textarea className="prompt-editor" value={prompt} onChange={(event) => setPrompt(event.target.value)} />

        <div className="button-row">
          <button className="primary" onClick={() => savePrompt.mutate()} type="button">
            Сохранить prompt
          </button>
        </div>
      </section>

      <section className="workspace-panel settings-panel">
        <div className="workspace-panel-header">
          <div className="title-row">
            <h3>Настройки провайдеров</h3>
            <Hint text="Здесь задаются LLM, embeddings, STT и локальные параметры хранения. Для быстрого старта используйте пресеты ниже." />
          </div>
        </div>

        <div className="button-row compact">
          <button className="secondary" onClick={applyRussiaPreset} type="button">
            Пресет РФ / локально
          </button>
          <button className="ghost" onClick={applyDashScopePreset} type="button">
            Пресет DashScope Intl
          </button>
        </div>

        <div className="form-grid">
          <label>
            <span className="field-label">Страна</span>
            <input className="field-input" value={providerState.user_country} onChange={(event) => setProviderState({ ...providerState, user_country: event.target.value })} />
          </label>
          <label>
            <span className="field-label">Часовой пояс</span>
            <input className="field-input" value={providerState.user_timezone} onChange={(event) => setProviderState({ ...providerState, user_timezone: event.target.value })} />
          </label>
          <label>
            <span className="field-label">Язык UI</span>
            <input className="field-input" value={providerState.ui_language} onChange={(event) => setProviderState({ ...providerState, ui_language: event.target.value })} />
          </label>
          <label>
            <span className="field-label">Язык транскрибации</span>
            <input className="field-input" value={providerState.transcript_language} onChange={(event) => setProviderState({ ...providerState, transcript_language: event.target.value })} />
          </label>
          <label>
            <span className="field-label">LLM provider</span>
            <input className="field-input" value={providerState.llm_provider} onChange={(event) => setProviderState({ ...providerState, llm_provider: event.target.value })} />
          </label>
          <label>
            <span className="field-label">LLM model</span>
            <input className="field-input" value={providerState.llm_model} onChange={(event) => setProviderState({ ...providerState, llm_model: event.target.value })} />
          </label>
          <label>
            <span className="field-label">Embedding provider</span>
            <input className="field-input" value={providerState.embedding_provider} onChange={(event) => setProviderState({ ...providerState, embedding_provider: event.target.value })} />
          </label>
          <label>
            <span className="field-label">Embedding model</span>
            <input className="field-input" value={providerState.embedding_model} onChange={(event) => setProviderState({ ...providerState, embedding_model: event.target.value })} />
          </label>
          <label>
            <span className="field-label">STT provider</span>
            <input className="field-input" value={providerState.stt_provider} onChange={(event) => setProviderState({ ...providerState, stt_provider: event.target.value })} />
          </label>
          <label>
            <span className="field-label">STT model</span>
            <input className="field-input" value={providerState.stt_model} onChange={(event) => setProviderState({ ...providerState, stt_model: event.target.value })} />
          </label>
          <label>
            <span className="field-label">Batch STT model</span>
            <input className="field-input" value={providerState.batch_stt_model} onChange={(event) => setProviderState({ ...providerState, batch_stt_model: event.target.value })} />
          </label>
          <label>
            <span className="field-label">Регион провайдера</span>
            <input className="field-input" value={providerState.provider_region} onChange={(event) => setProviderState({ ...providerState, provider_region: event.target.value })} />
          </label>
          <label>
            <span className="field-label">Base URL</span>
            <input className="field-input" value={providerState.provider_base_url ?? ""} onChange={(event) => setProviderState({ ...providerState, provider_base_url: event.target.value || null })} />
          </label>
          <label>
            <span className="field-label">API key ref</span>
            <input className="field-input" value={providerState.api_key_ref ?? ""} onChange={(event) => setProviderState({ ...providerState, api_key_ref: event.target.value || null })} />
          </label>
          <label className="toggle-card toggle-card-inline">
            <input checked={providerState.audio_storage_enabled} onChange={(event) => setProviderState({ ...providerState, audio_storage_enabled: event.target.checked })} type="checkbox" />
            <span>Сохранять сырой аудиоархив</span>
          </label>
          <label>
            <span className="field-label">Каталог аудио</span>
            <input className="field-input" value={providerState.audio_storage_dir ?? ""} onChange={(event) => setProviderState({ ...providerState, audio_storage_dir: event.target.value || null })} />
          </label>
        </div>

        <div className="button-row">
          <button className="secondary" onClick={() => saveProviders.mutate()} type="button">
            Сохранить настройки
          </button>
        </div>
      </section>
    </div>
  );
}
