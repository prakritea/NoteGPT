import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PlannerEvent {
  id: string;
  date: string; // toDateString()
  title: string;
  time?: string;
  remind?: boolean;
}

function loadEventsFromStorage(): PlannerEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("notegpt_events");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PlannerEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function Dashboard() {
  const [events, setEvents] = useState<PlannerEvent[]>([]);

  useEffect(() => {
    setEvents(loadEventsFromStorage());
  }, []);

  const today = new Date().toDateString();

  const todaysPlan = useMemo(
    () =>
      events.filter(
        (e) => new Date(e.date).toDateString() === today,
      ),
    [events, today],
  );

  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => new Date(e.date) >= now)
      .sort(
        (a, b) => +new Date(a.date) - +new Date(b.date),
      )
      .slice(0, 5);
  }, [events]);

  const weeklyProgress = useMemo(() => {
    if (!events.length) return { completed: 0, target: 10, percent: 0 };

    const now = new Date();
    const day = now.getDay(); // 0–6 (Sun–Sat)
    const diffToMonday = (day + 6) % 7;
    const monday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - diffToMonday,
    );
    const sunday = new Date(
      monday.getFullYear(),
      monday.getMonth(),
      monday.getDate() + 6,
    );

    const countThisWeek = events.filter((e) => {
      const d = new Date(e.date);
      return d >= monday && d <= sunday;
    }).length;

    const target = 10; // arbitrary study target per week
    const completed = Math.min(countThisWeek, target);
    const percent = Math.round((completed / target) * 100);
    return { completed, target, percent };
  }, [events]);

  const suggestedTopics = [
    "Review yesterday's lecture notes",
    "Revise core Data Structures",
    "Practice 5 DSA problems",
    "Summarize one YouTube tutorial",
  ];

  const learningPath = [
    "Week 1–2: Strengthen fundamentals (DSA / Math)",
    "Week 3–4: Core CS (OS, DBMS, Networks)",
    "Week 5–6: Machine Learning basics",
    "Week 7–8: Build 1–2 portfolio projects",
  ];

  return (
    <>
      <div className="h-16 border-b bg-black flex items-center justify-between px-4">
        <h1 className="text-lg font-semibold">Home</h1>
        <div className="flex items-center gap-2">
          <input
            className="hidden md:block w-64 rounded-md border bg-[#0b0b0b] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
            placeholder="Search your notes"
          />
          <Button>New Note</Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 grid gap-6 lg:grid-cols-3">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome */}
            <div className="rounded-xl border bg-card p-5">
              <h2 className="mb-2 text-xl font-semibold">
                Welcome back 👋
              </h2>
              <p className="text-muted-foreground">
                Start by importing a YouTube video, PDF, or create a
                new note. Your study companion is here to help.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild variant="secondary">
                  <Link to="/youtube">Import YouTube</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/pdf">Upload PDF</Link>
                </Button>
                <Button asChild>
                  <Link to="/chat">Start AI Chat</Link>
                </Button>
              </div>
            </div>

            {/* Today’s Study Plan */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-3 text-lg font-semibold">
                Today&apos;s Study Plan
              </h3>
              {todaysPlan.length ? (
                <ul className="space-y-2">
                  {todaysPlan.map((ev) => (
                    <li
                      key={ev.id}
                      className="flex items-center justify-between rounded-md border bg-background p-3"
                    >
                      <div>
                        <div className="font-medium">{ev.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {ev.time || "All day"}
                          {ev.remind ? " • Reminder on" : ""}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No events scheduled for today. Add some in the{" "}
                  <Link
                    to="/planner"
                    className="text-primary underline"
                  >
                    Study Planner
                  </Link>
                  .
                </p>
              )}
            </div>

            {/* Suggested topics + AI path */}
            <div className="rounded-xl border bg-card p-5 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-semibold">
                  Suggested Topics to Study
                </h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {suggestedTopics.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">
                  AI Recommended Learning Path
                </h3>
                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                  {learningPath.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-2 text-lg font-semibold">
                Upcoming Deadlines
              </h3>
              {upcomingDeadlines.length ? (
                <ul className="space-y-2">
                  {upcomingDeadlines.map((ev) => (
                    <li
                      key={ev.id}
                      className="rounded-md border bg-background p-3 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{ev.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(ev.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {ev.time || "All day"}
                        {ev.remind ? " • Reminder on" : ""}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No upcoming events. Plan your week in the{" "}
                  <Link
                    to="/planner"
                    className="text-primary underline"
                  >
                    Study Planner
                  </Link>
                  .
                </p>
              )}
            </div>

            {/* Weekly Progress + Quick Actions */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-2 text-lg font-semibold">
                Weekly Progress Overview
              </h3>
              <p className="text-sm text-muted-foreground">
                You have{" "}
                <span className="font-semibold text-foreground">
                  {weeklyProgress.completed}
                </span>{" "}
                planned study sessions out of{" "}
                <span className="font-semibold text-foreground">
                  {weeklyProgress.target}
                </span>{" "}
                for this week.
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{
                    width: `${Math.min(
                      weeklyProgress.percent,
                      100,
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-4 grid gap-2">
                <Button variant="secondary" asChild>
                  <Link to="/youtube">Summarize a video</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link to="/pdf">Scan a PDF</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link to="/ppt">Create presentation</Link>
                </Button>
              </div>
            </div>

            {/* Subscription */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-2 text-lg font-semibold">Subscription</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Upgrade to unlock unlimited notes and HD exports.
              </p>
              <Button asChild className="w-full">
                <Link to="/#pricing">Upgrade - Save 30%</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
