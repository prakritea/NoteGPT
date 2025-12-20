import { useMemo, useState } from "react";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";

interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  fileName?: string;
  fileType?: string;
  fileUrl?: string; // NEW — a blob URL to open the file
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Modal state
  const [openNote, setOpenNote] = useState<Note | null>(null);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Search notes
  const filtered = useMemo(
    () =>
      notes.filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.description.toLowerCase().includes(query.toLowerCase())
      ),
    [notes, query]
  );

  const add = () => {
    if (!title.trim() && !description.trim() && !file) return;

    const now = new Date();

    const finalTitle =
      title.trim() ||
      file?.name?.replace(/\.[^/.]+$/, "") ||
      "Untitled note";

    const newNote: Note = {
      id: Math.random().toString(36).slice(2),
      title: finalTitle,
      description: description.trim() || "Uploaded file",
      createdAt: now
    };

    // If file exists, generate preview URL
    if (file) {
      newNote.fileName = file.name;
      newNote.fileType = file.type;
      newNote.fileUrl = URL.createObjectURL(file);
    }

    setNotes((prev) => [newNote, ...prev]);

    setTitle("");
    setDescription("");
    setFile(null);
  };

  const clearNotes = () => setNotes([]);

  // Handle clicking a note
  const openNoteCard = (n: Note) => {
    if (n.fileUrl) {
      window.open(n.fileUrl, "_blank");
    } else {
      setOpenNote(n); // open modal
    }
  };

  return (
    <>
      <BackButton />

      <div className="container py-4 grid gap-6 lg:grid-cols-4">
        {/* LEFT: Create */}
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-3 text-lg font-semibold">Upload / Create Note</div>

          <input
            className="mb-2 w-full rounded-md border px-3 py-2 text-sm bg-white text-black"
            placeholder="Title (e.g., My latest resume)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="min-h-[120px] w-full rounded-md border p-3 text-sm bg-white text-black"
            placeholder="Sub-heading / what this note is about (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="mt-3 flex flex-col gap-3">
            <div className="flex flex-col text-sm text-muted-foreground">
              <span>Upload file (optional)</span>
              <input
                type="file"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setFile(f);
                  if (f && !title.trim()) {
                    setTitle(f.name.replace(/\.[^/.]+$/, ""));
                  }
                }}
              />
              {file && (
                <span className="text-xs mt-1 break-all">Selected: {file.name}</span>
              )}
            </div>

            <Button onClick={add} className="self-end">
              Save
            </Button>
          </div>
        </div>

        {/* MIDDLE: Notes list */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-lg font-semibold">Notes</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes"
              className="rounded-md border px-3 py-2 text-sm bg-white text-black"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notes yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((n) => (
                <div
                  key={n.id}
                  className="rounded-lg border p-4 bg-white text-black cursor-pointer hover:shadow-md transition"
                  onClick={() => openNoteCard(n)}
                >
                  <div className="mb-1 text-xs text-muted-foreground">
                    {n.createdAt.toLocaleDateString()}{" "}
                    {n.fileName && (
                      <>
                        • File: <span className="font-medium">{n.fileName}</span>
                      </>
                    )}
                  </div>
                  <div className="font-semibold">{n.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                    {n.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: History */}
        <aside className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">History</h3>
            {notes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearNotes}
                className="text-xs h-auto p-1"
              >
                Clear
              </Button>
            )}
          </div>

          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No history
            </p>
          ) : (
            <ul className="space-y-2">
              {notes.map((n) => (
                <li
                  key={n.id}
                  className="p-2 rounded-md border bg-card/50 text-sm line-clamp-1"
                >
                  {n.title}
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {/* MODAL FOR TEXT NOTES */}
      {openNote && !openNote.fileUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white text-black p-6 rounded-xl max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">{openNote.title}</h2>
              <Button variant="ghost" onClick={() => setOpenNote(null)}>
                Close
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mb-2">
              {openNote.createdAt.toLocaleString()}
            </p>

            <p className="whitespace-pre-wrap text-sm">{openNote.description}</p>
          </div>
        </div>
      )}
    </>
  );
}
