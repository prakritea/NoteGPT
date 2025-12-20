import { cn } from "@/lib/utils";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function SidebarItem({
  to,
  icon,
  label,
  badge,
  collapsed = false,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: React.ReactNode;
  collapsed?: boolean;
}) {
  return (
    <NavLink
      to={to}
      title={label}
      className={({ isActive }) =>
        cn(
          "group flex w-full items-center rounded-md px-3 py-2 text-sm transition-all",
          collapsed ? "justify-center" : "gap-3",
          isActive
            ? "bg-primary/10 text-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )
      }
    >
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md text-base",
          "bg-background/40 group-hover:bg-background/70"
        )}
        aria-hidden
      >
        {icon}
      </span>
      {!collapsed && (
        <span className="flex-1 text-left truncate">{label}</span>
      )}
      {!collapsed && badge}
    </NavLink>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden h-screen border-r bg-black/95 text-sm text-foreground md:flex flex-col transition-all duration-200",
        collapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      {/* Top: logo + collapse toggle */}
      <div className="flex h-16 items-center justify-between border-b px-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xl font-bold">
            N
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">NoteGPT</span>
              <span className="text-[11px] text-muted-foreground">
                Study assistant
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {!collapsed && (
          <div className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
            Workspace
          </div>
        )}
        <SidebarItem
          collapsed={collapsed}
          to="/dashboard"
          icon={<span>🏠</span>}
          label="Home"
        />
        <SidebarItem
          collapsed={collapsed}
          to="/planner"
          icon={<span>🗓️</span>}
          label="Study Planner"
        />
        <SidebarItem
          collapsed={collapsed}
          to="/youtube"
          icon={<span>▶️</span>}
          label="AI YouTube"
        />
        <SidebarItem
          collapsed={collapsed}
          to="/chat"
          icon={<span>💬</span>}
          label="AI Chat"
        />
        <SidebarItem
          collapsed={collapsed}
          to="/pdf"
          icon={<span>📄</span>}
          label="AI PDF"
        />
        <SidebarItem
          collapsed={collapsed}
          to="/ppt"
          icon={<span>📽️</span>}
          label="AI Presentation"
          badge={
            !collapsed && (
              <span className="ml-auto rounded bg-rose-100/90 px-1.5 py-0.5 text-[10px] font-medium text-rose-700">
                Hot
              </span>
            )
          }
        />
        <SidebarItem
          collapsed={collapsed}
          to="/flashcards"
          icon={<span>🧠</span>}
          label="AI Flashcards"
        />

        <div className="my-3 h-px bg-border" />

        {!collapsed && (
          <div className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
            Library
          </div>
        )}
        <SidebarItem
          collapsed={collapsed}
          to="/notes"
          icon={<span>📝</span>}
          label="My Notes"
        />
        <SidebarItem
          collapsed={collapsed}
          to="/#pricing"
          icon={<span>⭐</span>}
          label="Subscriptions"
          badge={
            !collapsed && (
              <span className="ml-auto rounded bg-amber-100/90 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                Save 30%
              </span>
            )
          }
        />
        <SidebarItem
          collapsed={collapsed}
          to="/community"
          icon={<span>👥</span>}
          label="Community"
        />
        <SidebarItem
          collapsed={collapsed}
          to="/chrome-extension"
          icon={<span>🧩</span>}
          label="Add to Chrome"
        />
      </nav>

      {/* User mini card */}
      <div className="border-t px-3 py-3">
        <div className="flex items-center gap-3 rounded-lg border bg-background/40 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/80 text-xs font-semibold text-primary-foreground">
            P
          </div>
          {!collapsed && (
            <div className="text-xs leading-tight">
              <div className="font-medium text-foreground">Prakriti</div>
              <div className="truncate text-muted-foreground">
                prakritisirshi03@gmail.com
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
