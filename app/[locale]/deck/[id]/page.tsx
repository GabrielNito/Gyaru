import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getDeck } from "@/app/actions"
import { DeckDetail } from "@/components/deck/deck-detail"

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
            <span className="h-px w-8 bg-primary" />
            <span>{t("heroLabel")}</span>
          </div>
          <Link
            href={`/${locale}`}
            className="mt-4 inline-block font-mono text-xs uppercase tracking-wider text-accent hover:underline"
          >
            {t("backToDB")}
          </Link>
        </div>
      </section>

      {/* Detail content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <DeckDetail deck={deck} locale={locale} />
      </section>
    </div>
  )
}
