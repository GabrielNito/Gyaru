import Link from "next/link"
import { BookOpen, Plus } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <BookOpen className="h-5 w-5" />
          <span className="text-sm tracking-tight">GYARU</span>
        </Link>
        <Link
          href="/editor"
          className="inline-flex items-center gap-1.5 rounded-none bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-colors hover:bg-foreground/90"
        >
          <Plus className="h-3.5 w-3.5" />
          New Deck
        </Link>
      </div>
    </header>
  )
}
