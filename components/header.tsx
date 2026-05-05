"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center bg-accent font-mono text-xs font-bold text-accent-foreground">
            g
          </span>
          <span className="font-mono text-lg font-bold lowercase tracking-tight">gyaru</span>
          <span className="hidden font-mono text-[10px] uppercase text-muted-foreground sm:inline">
            / anki forge
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/editor"
            className={cn(
              "rounded-none px-3 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground",
              pathname === "/editor" && "text-foreground",
            )}
          >
            Create
          </Link>
          <Link
            href="/"
            className={cn(
              "rounded-none px-3 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground",
              pathname === "/" && "text-foreground",
            )}
          >
            Global DB
          </Link>
        </nav>
      </div>
    </header>
  )
}
