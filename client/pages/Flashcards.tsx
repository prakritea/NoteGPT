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
  const [cards, setCards] = useState<Card[]>([
    { q: "What is overfitting?", a: "When a model memorizes the training data and performs poorly on unseen data." },
    { q: "Define gradient descent.", a: "An optimization algorithm that iteratively updates parameters to minimize loss." },
    { q: "What is a transformer?", a: "A deep learning architecture using self-attention for sequence modeling." },
  ]);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: "1", title: "Linear Algebra Basics", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { id: "2", title: "WW2 Summary", timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
    { id: "3", title: "Neural Nets", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
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

  const genFromInputs = () => {
    const base = topic || fileName || "Your Topic";
    const sentences = (text || `${base} basics; key concepts; examples; tips; pitfalls`).split(/[.;\n]/).map(s=> s.trim()).filter(Boolean).slice(0,5);
    const generated: Card[] = sentences.map((s, idx)=> ({ q: `Q${idx+1}: ${base} – ${s}?`, a: `A${idx+1}: Brief explanation of ${s}.` }));
    if (generated.length) {
      setCards(generated);
      setI(0);
      setFlipped(false);
    }
  };

  const next = () => { setFlipped(false); setI((v)=> (v+1) % cards.length); };
  const prev = () => { setFlipped(false); setI((v)=> (v-1+cards.length) % cards.length); };

  return (
    <>
      <BackButton />
      <div className="container py-4">
        <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border bg-card p-4">
            <h2 className="mb-2 text-lg font-semibold">Create Flashcards</h2>
            <input value={topic} onChange={(e)=> setTopic(e.target.value)} placeholder="Topic (e.g., Linear Regression)" className="mb-2 w-full rounded-md border px-3 py-2 text-sm" />
            <textarea value={text} onChange={(e)=> setText(e.target.value)} placeholder="Paste text or notes to generate cards" className="min-h-[120px] w-full rounded-md border p-3 text-sm" />
            <div className="mt-2 flex items-center justify-between text-sm">
              <label className="text-muted-foreground">
                <input type="file" accept="application/pdf" onChange={(e)=> setFileName(e.target.files?.[0]?.name || null)} className="mr-2" />
                {fileName ? `Selected: ${fileName}` : "Or upload PDF"}
              </label>
              <button onClick={genFromInputs} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Generate</button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl rounded-2xl border bg-card p-6 text-center lg:col-span-1">
            <div className="mb-4 text-sm text-muted-foreground">Card {cards.length ? i+1 : 0} / {cards.length}</div>
            <button onClick={()=> setFlipped((f)=>!f)} className="w-full rounded-xl border bg-white px-6 py-16 text-lg font-medium shadow-sm">
              {cards.length ? (flipped ? cards[i].a : cards[i].q) : "No cards yet. Generate to start."}
            </button>
            <div className="mt-4 flex items-center justify-between">
              <button onClick={prev} className="rounded-md border px-4 py-2 text-sm">Prev</button>
              <button onClick={next} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Next</button>
            </div>
          </div>

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
