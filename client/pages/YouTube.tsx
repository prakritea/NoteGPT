import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";

interface HistoryItem {
  id: string;
  title: string;
  timestamp: Date;
}

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const paths = u.pathname.split("/");
    const idx = paths.findIndex((p) => p === "embed");
    if (idx >= 0 && paths[idx + 1]) return paths[idx + 1];
    return null;
  } catch {
    return null;
  }
}

export default function YouTube() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: "1", title: "Harvard CS50 – Lecture 1", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: "2", title: "Deep Learning 101", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: "3", title: "React Hooks Crash Course", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  ]);

  const videoId = useMemo(() => extractYouTubeId(url), [url]);
  const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : url || "https://www.youtube.com";

  const handleSummarize = () => {
    setSummary(
      "This video covers core ideas with timestamps, examples, and a concise 5‑bullet overview. It introduces the topic, demonstrates key steps, provides tips, and concludes with action items."
    );
  };

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

  return (
    <>
      <BackButton />
      <div className="container py-4">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube link"
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="flex gap-2">
          <a
            href={watchUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Watch on YouTube
          </a>
          <Button onClick={handleSummarize}>Summarize</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Video */}
        <div className="lg:col-span-2 rounded-xl border bg-card">
          <div className="aspect-video w-full rounded-t-xl bg-black/5">
            {videoId ? (
              <iframe
                className="h-full w-full rounded-t-xl"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                Paste a link to preview here
              </div>
            )}
          </div>
          <div className="p-4">
            <h2 className="mb-2 text-lg font-semibold">Transcript</h2>
            <ul className="space-y-2 text-sm text-muted-foreground max-h-64 overflow-auto pr-1">
              {["00:00 Introduction and goals","02:35 Key concept #1","08:12 Practical example","14:20 Common pitfalls","19:50 Summary and next steps"].map((t, i) => (
                <li key={i} className="rounded-md border p-2">{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Summary + History */}
        <div className="space-y-6">
          <aside className="rounded-xl border bg-card p-4">
            <h3 className="mb-2 text-lg font-semibold">AI Summary</h3>
            {summary ? (
              <div className="prose prose-sm max-w-none text-foreground">
                <ul className="list-disc pl-5">
                  {summary.split(".").filter(Boolean).map((s, i)=> (
                    <li key={i} className="mb-1">{s.trim()}.</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Click Summarize to generate a concise overview and key takeaways.</p>
            )}
          </aside>
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
      </div>
    </>
  );
}
