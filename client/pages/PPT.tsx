import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";

interface HistoryItem {
  id: string;
  topic: string;
  count: number;
  timestamp: Date;
}

interface TemplateInfo {
  id: string;    // what we send to backend (filename)
  label: string; // pretty name to show in UI
}

export default function PPT() {
  const [topics, setTopics] = useState("");
  const [slides, setSlides] = useState<string[][]>([]);
  const [slideCount, setSlideCount] = useState<number>(6);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // 🔹 Load available templates from backend on mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoadingTemplates(true);
        const res = await fetch("http://127.0.0.1:8000/api/ppt/templates");
        const data: TemplateInfo[] = await res.json();
        setTemplates(data || []);
        if (data && data.length > 0) {
          setSelectedTemplateId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load templates:", err);
      } finally {
        setLoadingTemplates(false);
      }
    };
    loadTemplates();
  }, []);

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

  // ✅ Force black text on white slide background so it’s visible
  const slideClasses = (i: number) => {
    // simple neutral preview; actual PPT styling comes from your template
    return "bg-white text-black border";
  };

  const generate = async () => {
    const t = (topics || "AI in Education").trim();

    if (!selectedTemplateId) {
      alert("Please choose a PPT template first.");
      return;
    }

    const parts = (
      topics || "Overview; Key Concepts; Use Cases; Tips; Summary"
    )
      .split(/[;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const count = Math.max(1, slideCount || 1);

    // Local preview deck
    const deck: string[][] = [];
    for (let i = 0; i < count; i++) {
      if (i === 0) {
        deck.push([
          `Title: ${t}`,
          "Overview of the topic",
          "Why it matters",
        ]);
      } else {
        const title = parts[i - 1] || `Slide ${i + 1}`;
        deck.push([title, "Key point 1", "Key point 2", "Key point 3"]);
      }
    }

    setSlides(deck);
    setHistory((h) => [
      {
        id: Math.random().toString(36).slice(2),
        topic: t,
        count: deck.length,
        timestamp: new Date(),
      },
      ...h,
    ]);

    // 🔥 call backend to actually generate PPTX file
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/api/ppt/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: t,
          template_id: selectedTemplateId, // send chosen filename/id
          num_slides: count,
        }),
      });

      if (!res.ok) {
        let detail = "Unknown error";
        try {
          const data = await res.json();
          detail = data?.detail ?? JSON.stringify(data);
        } catch {
          detail = await res.text();
        }
        console.error("PPT generation failed:", detail);
        alert("Failed to generate PPT file:\n" + detail);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${t}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error connecting to PPT backend.");
    } finally {
      setLoading(false);
    }
  };

  const removeHistoryItem = (id: string) => {
    setHistory(history.filter((item) => item.id !== id));
  };

  const clearAllHistory = () => {
    setHistory([]);
  };

  return (
    <>
      <BackButton />
      <div className="container py-4 grid gap-6 lg:grid-cols-4">
        {/* Controls */}
        <div className="rounded-xl border bg-card p-4 lg:col-span-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <textarea
              className="min-h-[120px] flex-1 rounded-md border p-3 text-sm outline-none focus:ring-2 focus:ring-ring bg-white text-black placeholder:text-muted-foreground"
              placeholder="Enter topic and optional bullet points separated by semicolons"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
            />

            <div className="flex gap-3 sm:flex-col sm:w-56">
              <Button
                onClick={generate}
                className="sm:self-start"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Slides"}
              </Button>

              <label className="text-xs text-muted-foreground sm:self-start flex flex-col gap-1">
                Slides
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={slideCount}
                  onChange={(e) =>
                    setSlideCount(parseInt(e.target.value || "1", 10))
                  }
                  className="w-full rounded-md border px-2 py-1 text-xs bg-white text-black"
                />
              </label>

              <div className="text-xs text-muted-foreground sm:self-start mt-1">
                Template:
              </div>
              <div className="flex gap-2 sm:flex-col">
                {loadingTemplates && (
                  <span className="text-xs text-muted-foreground">
                    Loading templates…
                  </span>
                )}
                {!loadingTemplates && templates.length === 0 && (
                  <span className="text-xs text-red-400">
                    No templates found in backend/templates
                  </span>
                )}
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`rounded-md px-3 py-2 text-xs border truncate ${
                      selectedTemplateId === tpl.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                    title={tpl.label}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {slides.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {slides.map((s, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-6 shadow-sm ${slideClasses(i)}`}
                >
                  <div className="mb-2 text-sm font-semibold">
                    Slide {i + 1}
                  </div>
                  <ul className="list-disc pl-5 text-sm">
                    {s.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
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
              {history.map((h) => (
                <li
                  key={h.id}
                  className="flex items-center justify-between p-2 rounded-md border bg-card/50 hover:bg-card transition-colors text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium line-clamp-1">
                      {h.topic}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {h.count} slides • {formatTime(h.timestamp)}
                    </div>
                  </div>
                  <button
                    onClick={() => removeHistoryItem(h.id)}
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
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No decks yet.
            </p>
          )}
        </aside>
      </div>
    </>
  );
}
