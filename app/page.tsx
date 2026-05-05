import { getDecks } from "@/app/actions"
import { DeckCard } from "@/components/deck/deck-card"
import { Header } from "@/components/header"
import { BookOpen } from "lucide-react"

export default async function HomePage() {
  const decks = await getDecks()

  return (
    <div className="min-h-svh bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6">
          <h1 className="font-medium text-2xl tracking-tight">Decks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, manage, and export your Anki decks.
          </p>
        </div>

        {decks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <h2 className="font-medium text-lg">No decks yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first deck to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
