import { useState } from "react";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";

interface HistoryItem {
  id: string;
  topic: string;
  count: number;
  timestamp: Date;
}

type Template = "minimal" | "gradient" | "neon";

export default function PPT() {
  const [topics, setTopics] = useState("");
  const [slides, setSlides] = useState<string[][]>([]);
  const [template, setTemplate] = useState<Template>("minimal");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const generate = () => {
    const t = (topics || "AI in Education").trim();
    const parts = (topics || "Overview; Key Concepts; Use Cases; Tips; Summary").split(/[;\n]/).map(s=> s.trim()).filter(Boolean);
    const deck: string[][] = [
      ["Title: " + t, "Overview of the topic", "Why it matters"],
      ["Key Concepts", ...parts.slice(0,3)],
      ["Use Cases", "Example A", "Example B", "Example C"],
      ["Next Steps", "Resources", "Q&A"],
    ];
    setSlides(deck);
    setHistory(h => [{ id: Math.random().toString(36).slice(2), topic: t, count: deck.length, timestamp: new Date() }, ...h]);
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

  const slideClasses = (i: number) => {
    if (template === "minimal") return "bg-white text-foreground border";
    if (template === "gradient") return "text-white border-0 bg-gradient-to-br from-[hsl(var(--brand-blue))] via-[hsl(var(--brand-pink))] to-[hsl(var(--brand-lime))]";
    return i === 0
      ? "bg-[hsl(var(--brand-purple))] text-white border-0"
      : "bg-[hsl(var(--brand-lime)/0.15)] text-foreground border";
  };

  return (
    <>
      <BackButton />
      <div className="container py-4 grid gap-6 lg:grid-cols-4">
        {/* Controls */}
        <div className="rounded-xl border bg-card p-4 lg:col-span-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <textarea
              className="min-h-[120px] flex-1 rounded-md border p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter topic and optional bullet points separated by semicolons"
              value={topics}
              onChange={(e)=> setTopics(e.target.value)}
            />
            <div className="flex gap-2 sm:flex-col">
              <Button onClick={generate} className="sm:self-start">Generate Slides</Button>
              <div className="text-xs text-muted-foreground sm:self-start">Template:</div>
              <div className="flex gap-2 sm:flex-col">
                {(["minimal","gradient","neon"] as Template[]).map(t=> (
                  <button key={t} onClick={()=> setTemplate(t)} className={`rounded-md px-3 py-2 text-xs border ${template===t? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>{t}</button>
                ))}
              </div>
            </div>
          </div>

          {slides.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {slides.map((s, i)=> (
                <div key={i} className={`rounded-xl p-6 shadow-sm ${slideClasses(i)}`}>
                  <div className="mb-2 text-sm font-semibold">Slide {i+1}</div>
                  <ul className="list-disc pl-5 text-sm">
                    {s.map((b, j)=> <li key={j}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* History */}
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
          {history.length ? (
            <ul className="space-y-2">
              {history.map(h => (
                <li key={h.id} className="flex items-center justify-between p-2 rounded-md border bg-card/50 hover:bg-card transition-colors text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium line-clamp-1">{h.topic}</div>
                    <div className="text-xs text-muted-foreground">{h.count} slides • {formatTime(h.timestamp)}</div>
                  </div>
                  <button
                    onClick={() => removeHistoryItem(h.id)}
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
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No decks yet.</p>
          )}
        </aside>
      </div>
    </>
  );
}
