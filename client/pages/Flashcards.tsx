import { useState } from "react";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";

interface HistoryItem {
  id: string;
  title: string;
  timestamp: Date;
}

type Card = { q: string; a: string };

export default function Flashcards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

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

  // 🟣 Call backend to generate flashcards
  const generateFlashcards = async () => {
    if (!topic && !text) return;
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/flashcards/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          text,
          file_name: fileName || null,
        }),
      });

      const data = await res.json();

      if (data.cards && Array.isArray(data.cards)) {
        setCards(data.cards);
        setI(0);
        setFlipped(false);

        // add to history
        setHistory((h) => [
          {
            id: Math.random().toString(36).slice(2),
            title: topic || fileName || "Flashcards",
            timestamp: new Date(),
          },
          ...h,
        ]);
      } else {
        alert("Failed to generate flashcards");
      }
    } catch (err) {
      alert("Error connecting to server");
    }

    setLoading(false);
  };

  const next = () => {
    if (!cards.length) return;
    setFlipped(false);
    setI((v) => (v + 1) % cards.length);
  };

  const prev = () => {
    if (!cards.length) return;
    setFlipped(false);
    setI((v) => (v - 1 + cards.length) % cards.length);
  };

  return (
    <>
      <BackButton />
      <div className="container py-4">
        <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-3">
          {/* Left: form */}
          <div className="rounded-xl border bg-card p-4">
            <h2 className="mb-2 text-lg font-semibold">Create Flashcards</h2>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic (e.g., Linear Regression)"
              className="mb-2 w-full rounded-md border px-3 py-2 text-sm bg-white text-black placeholder:text-muted-foreground"
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste text or notes to generate cards"
              className="min-h-[120px] w-full rounded-md border p-3 text-sm bg-white text-black placeholder:text-muted-foreground"
            />

            {/* This block controls file + button layout */}
            <div className="mt-3 space-y-3 text-sm">
              <label className="text-muted-foreground text-xs sm:text-sm flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setFileName(e.target.files?.[0]?.name || null)
                  }
                  className="text-xs sm:text-sm"
                />
                <span>
                  {fileName ? `Selected: ${fileName}` : "Or upload PDF"}
                </span>
              </label>

              {/* Button always stays inside card now */}
              <Button
                onClick={generateFlashcards}
                disabled={loading}
                className="w-full sm:w-auto sm:self-start"
              >
                {loading ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>

          {/* Middle: flashcard viewer */}
          <div className="mx-auto w-full max-w-xl rounded-2xl border bg-card p-6 text-center lg:col-span-1">
            <div className="mb-4 text-sm text-muted-foreground">
              Card {cards.length ? i + 1 : 0} / {cards.length}
            </div>
            <button
              onClick={() => setFlipped((f) => !f)}
              className={`w-full rounded-xl border px-6 py-16 text-lg font-medium shadow-sm bg-white text-black
              transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg
              ${flipped ? "ring-2 ring-primary/70" : ""}`}
            >
              {cards.length
                ? flipped
                  ? cards[i].a
                  : cards[i].q
                : "No cards yet. Generate to start."}
            </button>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={prev}
                className="rounded-md border px-4 py-2 text-sm bg-background hover:bg-accent"
              >
                Prev
              </button>
              <button
                onClick={next}
                className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:brightness-110"
              >
                Next
              </button>
            </div>
          </div>

          {/* Right: history */}
          <aside className="rounded-2xl border bg-card p-4">
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
