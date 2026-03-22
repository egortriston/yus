export interface SessionSummary {
  id: string;
  title: string | null;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  raw_audio_path: string | null;
}

export interface StoryCard {
  id: string;
  session_id: string;
  role: string;
  action: string;
  value: string;
  full_story: string;
  status: string;
  expires_at: string | null;
}

export interface PromptSettings {
  system_prompt: string;
}

export interface ProviderSettings {
  llm_provider: string;
  llm_model: string;
  embedding_provider: string;
  embedding_model: string;
  stt_provider: string;
  stt_model: string;
  batch_stt_provider: string;
  batch_stt_model: string;
  provider_base_url: string | null;
  provider_region: string;
  api_key_ref: string | null;
  user_country: string;
  user_timezone: string;
  ui_language: string;
  transcript_language: string;
  audio_storage_enabled: boolean;
  audio_storage_dir: string | null;
}

export interface DocumentRecord {
  id: string;
  filename: string;
  original_name: string;
  status: string;
  error_message: string | null;
}

export interface SessionDetail {
  id: string;
  title: string | null;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  full_transcript: string | null;
  raw_audio_path: string | null;
  summary_markdown: string | null;
  segments: Array<{
    id: string;
    source: string;
    speaker_label: string;
    text: string;
    created_at: string;
  }>;
  stories: StoryCard[];
}
