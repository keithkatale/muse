import Link from "next/link"

export function FooterSection() {
  return (
    <footer className="border-t border-border/50 py-16 bg-background">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex shrink-0 items-center opacity-90 hover:opacity-100 transition-opacity"
            >
              <img
                src="/UI-elements/muse.svg"
                alt="Muse"
                width={110}
                height={28}
                className="h-7 w-auto"
              />
            </Link>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
            <Link href="/discover" className="hover:text-muse-brown transition-colors">
              Discover
            </Link>
            <Link href="/create" className="hover:text-muse-brown transition-colors">
              Create
            </Link>
            <Link href="/gallery" className="hover:text-muse-brown transition-colors">
              Gallery
            </Link>
            <Link href="/cookies" className="hover:text-muse-brown transition-colors">
              Cookies
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
