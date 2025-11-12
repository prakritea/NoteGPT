import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-black/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-extrabold text-xl tracking-tight"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[#273469] text-white">
            AI
          </span>
          <span className="text-foreground">NoteGPT</span>
        </Link>
        <nav className="hidden md:flex justify-center items-center font-medium space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-foreground hover:text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Home
          </NavLink>
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#how"
            className="text-muted-foreground hover:text-foreground"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="text-muted-foreground hover:text-foreground"
          >
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#chrome"
            className="hidden sm:inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Add to Chrome
          </a>
          <Button asChild size="lg">
            <Link to="/dashboard">Try Free Now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
