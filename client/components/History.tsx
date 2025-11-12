import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HistoryItem {
  id: string;
  title: string;
  timestamp: Date;
  type: string;
}

export default function History() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    { id: "1", title: "Harvard CS50 Lecture 1", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), type: "youtube" },
    { id: "2", title: "Research Paper on LLMs", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), type: "pdf" },
    { id: "3", title: "Python Basics", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), type: "chat" },
  ]);

  const removeItem = (id: string) => {
    setHistoryItems(historyItems.filter(item => item.id !== id));
  };

  const clearAllHistory = () => {
    setHistoryItems([]);
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">History</h3>
        {historyItems.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllHistory}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {historyItems.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No history yet</p>
      ) : (
        <div className="space-y-2">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{formatTime(item.timestamp)}</p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="ml-2 text-muted-foreground hover:text-foreground"
                title="Remove from history"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6l-12 12M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
