import Link from "next/link"

export function FooterSection() {
  return (
    <footer className="border-t border-border/50 py-16 bg-[hsl(40,25%,98%)]">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-6 h-px bg-accent/40" />
            <Link
              href="/"
              className="font-serif text-xl tracking-tight text-foreground hover:text-accent transition-colors"
            >
              Muse
            </Link>
          </div>
          <nav className="flex gap-8 text-sm text-muted-foreground">
            <Link href="/discover" className="hover:text-accent transition-colors">
              Discover
            </Link>
            <Link href="/create" className="hover:text-accent transition-colors">
              Create
            </Link>
            <Link href="/gallery" className="hover:text-accent transition-colors">
              Gallery
            </Link>
          </nav>
        </div>
        <p className="mt-12 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Muse
        </p>
      </div>
    </footer>
  )
}
