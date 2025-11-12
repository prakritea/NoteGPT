import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <div className="h-16 border-b bg-black flex items-center justify-between px-4">
        <h1 className="text-lg font-semibold">Home</h1>
        <div className="flex items-center gap-2">
          <input className="hidden md:block w-64 rounded-md border bg-[#0b0b0b] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Search your notes" />
          <Button className="">New Note</Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border bg-card p-5">
              <h2 className="mb-2 text-xl font-semibold">Welcome back 👋</h2>
              <p className="text-muted-foreground">Start by importing a YouTube video, PDF, or create a new note. Your study companion is here to help.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild variant="secondary"><Link to="/youtube">Import YouTube</Link></Button>
                <Button asChild variant="secondary"><Link to="/pdf">Upload PDF</Link></Button>
                <Button asChild><Link to="/chat">Start AI Chat</Link></Button>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-4 text-lg font-semibold">Recent Notes</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {["Harvard CS50 Lecture 1", "Research Paper on LLMs", "Calculus: Integrals", "World History: WW2"].map((t, i)=> (
                  <div key={i} className="rounded-lg border p-4 hover:shadow-sm transition">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-medium">{t}</div>
                      <span className="text-xs text-muted-foreground">Edited {i+1}d ago</span>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">Auto-generated summary and key points are saved here. Continue learning where you left off.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-2 text-lg font-semibold">Quick Actions</h3>
              <div className="grid gap-2">
                <Button variant="secondary">Summarize a video</Button>
                <Button variant="secondary">Scan a PDF</Button>
                <Button variant="secondary">Create presentation</Button>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-2 text-lg font-semibold">Subscription</h3>
              <p className="text-sm text-muted-foreground mb-3">Upgrade to unlock unlimited notes and HD exports.</p>
              <Button asChild className="w-full"><Link to="/#pricing">Upgrade - Save 30%</Link></Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
