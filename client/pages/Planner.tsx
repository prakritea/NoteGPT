import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";

interface EventItem {
  id: string;
  date: string;  // stored as toDateString()
  title: string;
  time?: string;
  remind?: boolean;
}

const DEFAULT_EVENTS: EventItem[] = [
  {
    id: "1",
    date: new Date().toDateString(),
    title: "Math practice",
    time: "18:00",
    remind: true,
  },
  {
    id: "2",
    date: new Date(Date.now() + 86400000).toDateString(),
    title: "History reading",
    time: "16:00",
  },
];

function getMonthMatrix(date: Date) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const first = new Date(y, m, 1);
  const start = new Date(y, m, 1 - ((first.getDay() + 6) % 7)); // Monday start (Mon–Sun)
  const weeks: Date[][] = [];
  for (let w = 0; w < 6; w++) {
    const row: Date[] = [];
    for (let d = 0; d < 7; d++) {
      const cur = new Date(start);
      cur.setDate(start.getDate() + w * 7 + d);
      row.push(cur);
    }
    weeks.push(row);
  }
  return weeks;
}

export default function Planner() {
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  // 🟣 Load + persist events to localStorage so Dashboard can read them
  const [events, setEvents] = useState<EventItem[]>(() => {
    if (typeof window === "undefined") return DEFAULT_EVENTS;
    try {
      const raw = localStorage.getItem("notegpt_events");
      if (!raw) return DEFAULT_EVENTS;
      const parsed = JSON.parse(raw) as EventItem[];
      if (!Array.isArray(parsed)) return DEFAULT_EVENTS;
      return parsed;
    } catch {
      return DEFAULT_EVENTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("notegpt_events", JSON.stringify(events));
    } catch {
      // ignore write errors
    }
  }, [events]);

  const [form, setForm] = useState({ title: "", time: "", remind: true });

  const weeks = useMemo(() => getMonthMatrix(cursor), [cursor]);
  const monthLabel = cursor.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });

  const dayEvents = useMemo(
    () =>
      events.filter(
        (e) =>
          new Date(e.date).toDateString() ===
          (selected?.toDateString() || ""),
      ),
    [events, selected],
  );

  const addEvent = () => {
    if (!selected || !form.title.trim()) return;
    setEvents((prev) => [
      {
        id: Math.random().toString(36).slice(2),
        date: selected.toDateString(),
        title: form.title.trim(),
        time: form.time,
        remind: form.remind,
      },
      ...prev,
    ]);
    setForm({ title: "", time: "", remind: true });
  };

  return (
    <>
      <BackButton />
      <div className="container py-4 grid gap-6 lg:grid-cols-2">
        {/* Calendar + form */}
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <button
              className="rounded-md border px-2 py-1 text-sm"
              onClick={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1),
                )
              }
            >
              Prev
            </button>
            <div className="font-semibold">{monthLabel}</div>
            <button
              className="rounded-md border px-2 py-1 text-sm"
              onClick={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1),
                )
              }
            >
              Next
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {weeks.map((row, ri) => (
            <div key={ri} className="grid grid-cols-7">
              {row.map((d, di) => {
                const isCur =
                  d.toDateString() === new Date().toDateString();
                const isSel =
                  selected && d.toDateString() === selected.toDateString();
                const isMuted = d.getMonth() !== cursor.getMonth();
                const count = events.filter(
                  (e) =>
                    new Date(e.date).toDateString() === d.toDateString(),
                ).length;

                return (
                  <button
                    key={di}
                    onClick={() => setSelected(new Date(d))}
                    className={`m-0.5 rounded-md border px-2 py-2 text-left text-xs
                      ${isSel ? "border-primary ring-1 ring-primary" : ""}
                      ${isMuted ? "text-muted-foreground" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex size-5 items-center justify-center rounded ${
                          isCur
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }`}
                      >
                        {d.getDate()}
                      </span>
                      {count > 0 && (
                        <span className="text-[10px] text-primary">
                          {count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}

          <div className="mt-4 grid gap-2">
            <input
              className="rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring bg-white text-black"
              placeholder="Event title"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
            <input
              className="rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring bg-white text-black"
              placeholder="Time (e.g., 18:00)"
              value={form.time}
              onChange={(e) =>
                setForm((f) => ({ ...f, time: e.target.value }))
              }
            />
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.remind}
                onChange={(e) =>
                  setForm((f) => ({ ...f, remind: e.target.checked }))
                }
              />
              Remind me
            </label>
            <Button onClick={addEvent}>Add Event</Button>
          </div>
        </div>

        {/* Day events only */}
        <div className="rounded-xl border bg-card p-4">
          <h2 className="mb-3 text-lg font-semibold">
            Events on {selected?.toLocaleDateString()}
          </h2>
          {dayEvents.length ? (
            <ul className="space-y-2">
              {dayEvents.map((ev) => (
                <li
                  key={ev.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <div className="font-medium">{ev.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {ev.time || "All day"}
                      {ev.remind ? " • Reminder on" : ""}
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setEvents((list) =>
                        list.filter((e) => e.id !== ev.id),
                      )
                    }
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No events for this day.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
