import { getTranslations } from "next-intl/server"
import { getDecks } from "@/app/actions"
import { DeckCard } from "@/components/deck/deck-card"
import Link from "next/link"
import { Suspense } from "react"

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations("home")

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="border-b border-border bg-grid">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-px w-8 bg-accent" />
            <span>{t("heroLabel")}</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            {t("heroDesc")}
          </p>
        </div>
      </section>

      {/* Deck list with Suspense */}
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><div className="font-mono text-xs text-muted-foreground">Loading decks...</div></div>}>
        <DeckList locale={locale} />
      </Suspense>
    </div>
  )
}

async function DeckList({ locale }: { locale: string }) {
  const decks = await getDecks()
  const totalCards = decks.reduce((sum, d) => sum + d.cards.length, 0)
  const t = await getTranslations("home")

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {t("sectionLabel")}
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{t("sectionTitle")}</h2>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="h-2 w-2 animate-pulse bg-accent" />
          {t("deckCount", { count: decks.length })} ·
          {t("cardCount", { count: totalCards })}
        </div>
      </div>

      {decks.length === 0 ? (
        <EmptyState locale={locale} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} locale={locale} />
          ))}
        </div>
      )}
    </section>
  )
}

async function EmptyState({ locale }: { locale: string }) {
  const t = await getTranslations("home")

  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-border py-20 text-center">
      <div className="mb-6 grid grid-cols-3 gap-1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`h-6 w-6 border border-border ${i === 4 ? "bg-accent" : ""}`}
          />
        ))}
      </div>
      <h3 className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
        {t("emptyTitle")}
      </h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        {t("emptyDesc")}
      </p>
      <Link href={`/${locale}/editor`} className="mt-6">
        <button className="inline-flex items-center justify-center gap-2 rounded-none border border-accent bg-accent px-5 py-2 text-sm font-semibold tracking-wider text-accent-foreground uppercase transition-colors hover:bg-transparent hover:text-accent">
          {t("emptyAction")}
        </button>
      </Link>
    </div>
  )
}
