import { useMemo, useState } from "react";

const books = [
  { id: "1", title: "Deep Learning", author: "Goodfellow et al.", summary: "Foundational concepts of neural networks and modern deep learning.", genre: "AI" },
  { id: "2", title: "Atomic Habits", author: "James Clear", summary: "A framework for building habits and improving daily routines.", genre: "Self-help" },
  { id: "3", title: "Sapiens", author: "Yuval Noah Harari", summary: "A brief history of humankind and societal evolution.", genre: "History" },
];

export default function Library() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => books.filter(b => (b.title + b.genre + b.author).toLowerCase().includes(q.toLowerCase())), [q]);

  return (
    <div className="container py-8">
      <div className="mb-4 flex items-center justify-between">
        <input value={q} onChange={(e)=> setQ(e.target.value)} placeholder="Search by title, genre, or topic" className="w-full max-w-md rounded-md border px-3 py-2 text-sm" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b)=> (
          <div key={b.id} className="rounded-xl border bg-card p-4">
            <div className="mb-1 text-xs text-muted-foreground">{b.genre}</div>
            <div className="font-semibold">{b.title}</div>
            <div className="text-sm text-muted-foreground">by {b.author}</div>
            <p className="mt-2 text-sm text-muted-foreground">{b.summary}</p>
            <div className="mt-3 text-sm text-primary">Generate summary</div>
          </div>
        ))}
      </div>
    </div>
  );
}
