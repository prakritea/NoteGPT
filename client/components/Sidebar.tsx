import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import History from "./History";

function SidebarItem({ to, icon, label, badge, collapsed = false }: { to: string; icon: React.ReactNode; label: string; badge?: React.ReactNode; collapsed?: boolean }) {
  return (
    <NavLink
      to={to}
      title={label}
      className={({ isActive }) =>
        cn(
          "flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors",
          collapsed ? "justify-center" : "gap-3",
          isActive ? "bg-primary/10 text-foreground" : "hover:bg-accent text-muted-foreground",
        )
      }
    >
      <span className="shrink-0" aria-hidden>{icon}</span>
      {!collapsed && <span className="flex-1 text-left">{label}</span>}
      {!collapsed && badge}
    </NavLink>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn("border-r bg-black transition-all duration-200 hidden md:flex flex-col", collapsed ? "w-[72px]" : "w-[260px]")}>
      <div className="h-16 flex items-center px-4 border-b">
        <button onClick={()=>setCollapsed(v=>!v)} className="text-muted-foreground hover:text-foreground">
          {collapsed ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m15 18-6-6 6-6"/></svg>
          ): (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m9 18 6-6-6-6"/></svg>
          )}
        </button>
      </div>
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <SidebarItem collapsed={collapsed} to="/dashboard" icon={<span className="i">🏠</span>} label="Home" />
        <SidebarItem collapsed={collapsed} to="/planner" icon={<span>🗓️</span>} label="Study Planner" />
        <SidebarItem collapsed={collapsed} to="/youtube" icon={<span>▶️</span>} label="AI YouTube" />
        <SidebarItem collapsed={collapsed} to="/chat" icon={<span>💬</span>} label="AI Chat" />
        <SidebarItem collapsed={collapsed} to="/pdf" icon={<span>📄</span>} label="AI PDF" />
        <SidebarItem collapsed={collapsed} to="/ppt" icon={<span>📽️</span>} label="AI Presentation" badge={<span className="ml-auto rounded bg-rose-100 px-1.5 py-0.5 text-xs text-rose-600">Hot</span>} />
        <SidebarItem collapsed={collapsed} to="/flashcards" icon={<span>🧠</span>} label="AI Flashcards" />
        <div className="my-3 h-px bg-border" />
        <SidebarItem collapsed={collapsed} to="/notes" icon={<span>📝</span>} label="My Notes" />
        <SidebarItem collapsed={collapsed} to="/#pricing" icon={<span>⭐</span>} label="Subscriptions" badge={<span className="ml-auto rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">Save 30%</span>} />
        <SidebarItem collapsed={collapsed} to="/community" icon={<span>👥</span>} label="Community" />
        <div className="my-3 h-px bg-border" />
        <SidebarItem collapsed={collapsed} to="/chrome-extension" icon={<span>🧩</span>} label="Add to Chrome" />
      </nav>

      {!collapsed && (
        <div className="border-t p-3">
          <History />
        </div>
      )}

      <div className="mt-auto p-3">
        <div className="rounded-lg border p-3 text-xs text-muted-foreground">
          <div className="mb-2 font-medium text-foreground">Prakriti</div>
          <div>prakritisirshi03@gmail.com</div>
        </div>
      </div>
    </aside>
  );
}
