import { FormEvent, useRef, useState } from "react";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface HistoryItem {
  id: string;
  title: string;
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "a",
      role: "assistant",
      content:
        "Hey! What can i help you with? ",
    },
  ]);
  const [input, setInput] = useState("");

  // real session history – starts empty and fills from actual user prompts
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const removeHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
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

  const scrollToBottom = () => {
    setTimeout(
      () => listRef.current?.scrollTo({ top: 999999, behavior: "smooth" }),
      50
    );
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg: Msg = {
      id: Math.random().toString(36).slice(2),
      role: "user",
      content: text,
    };

    // add user message immediately
    setMessages((m) => [...m, userMsg]);
    setInput("");
    scrollToBottom();

    // add to history (use truncated prompt as title)
    const title =
      text.length > 60 ? text.slice(0, 60).trimEnd() + "…" : text;
    setHistory((h) => [
      { id: Math.random().toString(36).slice(2), title, timestamp: new Date() },
      ...h,
    ]);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      const replyMsg: Msg = {
        id: Math.random().toString(36).slice(2),
        role: "assistant",
        content: data?.reply || "No response",
      };

      setMessages((m) => [...m, replyMsg]);
      scrollToBottom();
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: Math.random().toString(36).slice(2),
          role: "assistant",
          content: "Error talking to server.",
        },
      ]);
      scrollToBottom();
    }
  };

  return (
    <>
      <BackButton />
      <div className="container py-4">
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3 flex h-[calc(100vh-14rem)] flex-col">
            <div
              ref={listRef}
              className="flex-1 overflow-auto rounded-xl border bg-white p-4"
            >

              <div className="mx-auto max-w-3xl space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={m.role === "user" ? "text-right" : "text-left"}
                  >
                    <div
                      className={`inline-block rounded-2xl px-4 py-2 ${m.role === "user"
                          ? "bg-primary text-black"
                          : "bg-accent text-black"
                        }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <form
              onSubmit={onSubmit}
              className="mx-auto mt-4 flex w-full max-w-3xl items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring text-black bg-white"
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Send
              </button>
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
              <p className="text-sm text-muted-foreground text-center py-4">
                No history
              </p>
            ) : (
              <ul className="space-y-2">
                {history.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-md border bg-card/50 hover:bg-card transition-colors text-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(item.timestamp)}
                      </div>
                    </div>
                    <button
                      onClick={() => removeHistoryItem(item.id)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                      title="Remove from history"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
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
