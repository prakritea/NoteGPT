import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-black/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-extrabold text-xl tracking-tight"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#273469] text-sm font-semibold text-white shadow-sm">
            AI
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-base text-foreground">NoteGPT</span>
            <span className="text-[11px] font-normal text-muted-foreground">
              Study assistant
            </span>
          </div>
        </Link>

        {/* Center navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-medium md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              [
                "inline-flex items-center border-b-2 px-1 pb-0.5 transition-colors",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:border-primary/60 hover:text-foreground",
              ].join(" ")
            }
          >
            Home
          </NavLink>

          <a
            href="#features"
            className="inline-flex items-center border-b-2 border-transparent px-1 pb-0.5 text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
          >
            Features
          </a>

          <a
            href="#how"
            className="inline-flex items-center border-b-2 border-transparent px-1 pb-0.5 text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
          >
            How it works
          </a>

          <a
            href="#pricing"
            className="inline-flex items-center border-b-2 border-transparent px-1 pb-0.5 text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
          >
            Pricing
          </a>
        </nav>

        {/* Right CTA button */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            size="lg"
            className="rounded-full px-4 py-2 text-sm font-semibold shadow-md shadow-primary/30 transition hover:shadow-primary/50"
          >
            <Link to="/dashboard">Try Free Now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
s