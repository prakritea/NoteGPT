import { useState } from "react";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";

interface HistoryItem {
  id: string;
  title: string;
  timestamp: Date;
}

export default function PDF() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const removeHistoryItem = (id: string) => {
    setHistory(history.filter((item) => item.id !== id));
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

  // 🔥 Connect with backend to summarize PDF
  const summarizePDF = async () => {
    if (!file) return;
    setLoading(true);
    setSummary(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/pdf/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.summary) {
        setSummary(data.summary);

        // Save history
        setHistory((h) => [
          { id: Math.random().toString(36).slice(2), title: file.name, timestamp: new Date() },
          ...h,
        ]);
      } else {
        setSummary("Failed to summarize PDF.");
      }
    } catch (err) {
      setSummary("Error connecting to backend.");
    }

    setLoading(false);
  };


  return (
    <>
      <BackButton />
      <div className="container py-4 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 lg:col-span-2">
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button onClick={summarizePDF} disabled={loading}>
              {loading ? "Summarizing..." : "Summarize"}
            </Button>
          </div>

          <div className="mt-6 h-[480px] rounded-md border bg-muted/30 flex items-center justify-center text-muted-foreground">
            {file ? file.name : "PDF preview placeholder"}
          </div>
        </div>
        <div className="space-y-6">
          <aside className="rounded-xl border bg-card p-4">
            <h3 className="mb-2 text-lg font-semibold">AI Summary</h3>
            {summary ? (
              <ul className="list-disc pl-5 text-sm">
                {summary.split(",").map((s, i) => <li key={i} className="mb-1">{s.trim()}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Upload a PDF and click Summarize to see highlights and key takeaways.</p>
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
                {history.map((item) => (
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
