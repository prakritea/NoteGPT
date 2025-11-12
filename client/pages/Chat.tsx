import { FormEvent, useRef, useState } from "react";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";

interface Msg { id: string; role: "user" | "assistant"; content: string }

interface HistoryItem {
  id: string;
  title: string;
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "a", role: "assistant", content: "Hi! I can help summarize videos, PDFs, and create flashcards. Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: "1", title: "Study plan prompts", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: "2", title: "Explain LLMs", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: "3", title: "Summarize chapter 2", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  const removeHistoryItem = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const clearAllHistory = () => {
    setHistory([]);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMsg: Msg = { id: Math.random().toString(36).slice(2), role: "user", content: text };
    const botMsg: Msg = { id: Math.random().toString(36).slice(2), role: "assistant", content: "(Mock) Here's a helpful answer with steps and tips." };
    setMessages((m) => [...m, userMsg, botMsg]);
    setInput("");
    setTimeout(()=> listRef.current?.scrollTo({ top: 999999, behavior: "smooth" }), 50);
  };

  return (
    <>
      <BackButton />
      <div className="container py-4">
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3 flex h-[calc(100vh-14rem)] flex-col">
            <div ref={listRef} className="flex-1 overflow-auto rounded-xl border bg-card p-4">
              <div className="mx-auto max-w-3xl space-y-4">
                {messages.map((m)=> (
                  <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
                    <div className={`inline-block rounded-2xl px-4 py-2 ${m.role === "user" ? "bg-primary text-black" : "bg-accent text-black"}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={onSubmit} className="mx-auto mt-4 flex w-full max-w-3xl items-center gap-2">
              <input
                value={input}
                onChange={(e)=> setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Send</button>
            </form>
          </div>

          <aside className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">History</h3>
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllHistory}
                  className="text-xs h-auto p-1"
                >
                  Clear
                </Button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No history</p>
            ) : (
              <ul className="space-y-2">
                {history.map((item)=> (
                  <li key={item.id} className="flex items-center justify-between p-2 rounded-md border bg-card/50 hover:bg-card transition-colors text-sm">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium line-clamp-1">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{formatTime(item.timestamp)}</div>
                    </div>
                    <button
                      onClick={() => removeHistoryItem(item.id)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                      title="Remove from history"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6l-12 12M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
