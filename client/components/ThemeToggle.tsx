import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const enableDark = stored ? stored === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', enableDark);
    setIsDark(enableDark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-foreground hover:bg-accent"
      aria-label="Toggle theme"
    >
      <span className="size-2 rounded-full" style={{ backgroundColor: isDark ? 'hsl(73 96% 76%)' : 'hsl(227 100% 76%)' }} />
      {isDark ? 'Dark' : 'Light'}
    </button>
  );
}
