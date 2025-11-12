export default function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-black">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} NoteGPT. All rights reserved.</p>
        <nav className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-foreground">Privacy</a>
          <a href="#terms" className="hover:text-foreground">Terms</a>
          <a href="#contact" className="hover:text-foreground">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
