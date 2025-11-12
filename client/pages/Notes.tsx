import { useMemo, useState } from "react";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";

interface HistoryItem {
  id: string;
  title: string;
  timestamp: Date;
}

interface Note { id: string; title: string; content: string; date: string }

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([
    { id: "1", title: "Harvard CS50 Lecture 1", content: "Auto-summary and key points.", date: new Date().toDateString() },
    { id: "2", title: "Research Paper on LLMs", content: "Takeaways and quotes.", date: new Date(Date.now()-86400000).toDateString() },
  ]);
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: "1", title: "Introduction to React", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: "2", title: "Database Design", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: "3", title: "Web Security Basics", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  ]);

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

  const filtered = useMemo(() => notes.filter(n => n.title.toLowerCase().includes(query.toLowerCase())), [notes, query]);

  const add = () => {
    if (!title.trim()) return;
    setNotes(prev => [{ id: Math.random().toString(36).slice(2), title: title.trim(), content, date: new Date().toDateString() }, ...prev]);
    setTitle(""); setContent("");
  };

  return (
    <>
      <BackButton />
      <div className="container py-4 grid gap-6 lg:grid-cols-4">
      <div className="rounded-xl border bg-card p-4">
        <div className="mb-3 text-lg font-semibold">Upload / Create Note</div>
        <input className="mb-2 w-full rounded-md border px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(e)=> setTitle(e.target.value)} />
        <textarea className="min-h-[120px] w-full rounded-md border p-3 text-sm" placeholder="Paste or type content" value={content} onChange={(e)=> setContent(e.target.value)} />
        <div className="mt-3 flex items-center justify-between">
          <label className="text-sm text-muted-foreground">
            <input type="file" className="mr-2" /> or create from text
          </label>
          <button onClick={add} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Save</button>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-lg font-semibold">Notes</div>
          <input value={query} onChange={(e)=> setQuery(e.target.value)} placeholder="Search notes" className="rounded-md border px-3 py-2 text-sm" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((n)=> (
            <div key={n.id} className="rounded-lg border p-4">
              <div className="mb-1 text-sm text-muted-foreground">{n.date}</div>
              <div className="font-medium">{n.title}</div>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{n.content}</p>
            </div>
          ))}
        </div>
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
    </>
  );
}
