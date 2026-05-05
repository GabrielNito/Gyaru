import { getDecks } from "@/app/actions"
import { DeckCard } from "@/components/deck/deck-card"
import { Header } from "@/components/header"
import Link from "next/link"

export default async function HomePage() {
  const decks = await getDecks()
  const totalCards = decks.reduce((sum, d) => sum + d.cards.length, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="border-b border-border bg-grid">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-px w-8 bg-primary" />
            <span>/// global database</span>
          </div>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Public <span className="text-primary">.apkg</span> repository
            </h1>
            <div className="flex items-center gap-2 border border-border px-3 py-2 font-mono text-xs">
              <span className="h-2 w-2 bg-accent" />
              {decks.length} deck{decks.length !== 1 ? "s" : ""} · {totalCards} cards
            </div>
          </div>
        </div>
      </section>

      {/* Deck list */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {decks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-border py-20 text-center">
      <div className="mb-6 grid grid-cols-3 gap-1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={`h-6 w-6 border border-border ${i === 4 ? "bg-accent" : ""}`} />
        ))}
      </div>
      <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
        no decks indexed
      </h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        The repository is empty. Forge your first deck and publish it to the global database.
      </p>
      <Link href="/editor" className="mt-6">
        <button className="inline-flex items-center justify-center gap-2 rounded-none bg-accent px-5 py-2 text-sm font-semibold uppercase tracking-wider text-accent-foreground border border-accent transition-colors hover:bg-transparent hover:text-accent">
          Start your first deck →
        </button>
      </Link>
    </div>
  )
}
