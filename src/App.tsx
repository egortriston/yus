import { useState } from "react";

import { HistoryPage } from "./pages/HistoryPage";
import { KnowledgePage } from "./pages/KnowledgePage";
import { MeetingPage } from "./pages/MeetingPage";
import { SettingsPage } from "./pages/SettingsPage";

type TabKey = "recording" | "history" | "knowledge" | "settings";

const tabs: Array<{ key: TabKey; label: string }> = [
  {
    key: "recording",
    label: "Запись"
  },
  {
    key: "history",
    label: "История"
  },
  {
    key: "knowledge",
    label: "База знаний"
  },
  {
    key: "settings",
    label: "Настройки"
  }
];

export function App() {
  const [tab, setTab] = useState<TabKey>("recording");

  return (
    <div className="app-shell">
      <aside className="shell-sidebar">
        <div className="brand-block">
          <div className="brand-mark">YUS</div>
          <h1>YUS</h1>
        </div>

        <nav className="shell-nav">
          {tabs.map((item) => (
            <button
              className={item.key === tab ? "shell-nav-item active" : "shell-nav-item"}
              key={item.key}
              onClick={() => setTab(item.key)}
              type="button"
            >
              <span className="shell-nav-title">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="shell-main">
        <section className="shell-content">
          {tab === "recording" && <MeetingPage />}
          {tab === "history" && <HistoryPage />}
          {tab === "knowledge" && <KnowledgePage />}
          {tab === "settings" && <SettingsPage />}
        </section>
      </main>
    </div>
  );
}
