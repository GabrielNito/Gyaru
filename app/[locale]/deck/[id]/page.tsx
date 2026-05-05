import { getTranslations } from "next-intl/server"
import { Metadata } from "next"
import { headers } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getDeck } from "@/app/actions"
import { DeckDetail } from "@/components/deck/deck-detail"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}): Promise<Metadata> {
  const { id } = await params
  const deck = await getDeck(id)

  if (!deck) {
    return {
      title: "Deck not found",
    }
  }

  const h = await headers()
  const host = h.get("host")
  const protocol = h.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`

  const ogUrl = new URL("/api/og", baseUrl)
  ogUrl.searchParams.set("title", deck.name)
  ogUrl.searchParams.set("cards", String(deck.cards.length))
  ogUrl.searchParams.set("id", deck.id)

  return {
    title: `${deck.name} — Gyaru`,
    description: deck.description || `Anki deck with ${deck.cards.length} cards, created with Gyaru — Anki Forge.`,
    openGraph: {
      title: deck.name,
      description: deck.description || `Anki deck with ${deck.cards.length} cards.`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: `${deck.name} — Gyaru Anki Deck`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: deck.name,
      description: deck.description || `Anki deck with ${deck.cards.length} cards.`,
      images: [ogUrl.toString()],
    },
  }
}

export default async function DeckPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  const deck = await getDeck(id)

  if (!deck) {
    notFound()
  }

  const t = await getTranslations("deckDetail")

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-grid">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-px w-8 bg-accent" />
            <span>{t("heroLabel")}</span>
          </div>
          <Link
            href={`/${locale}`}
            className="mt-4 inline-block font-mono text-xs uppercase tracking-wider text-accent hover:underline"
          >
            {t("backToDB")}
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{deck.name}</h1>
          {deck.description && (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{deck.description}</p>
          )}
        </div>
      </section>

      {/* Detail content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <DeckDetail deck={deck} locale={locale} />
      </section>
    </div>
  )
}
