"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { getMyDecks } from "@/app/actions"
import { DeckCard } from "@/components/deck/deck-card"
import { useTranslations, useLocale } from "next-intl"
import Link from "next/link"

export default function MyDecksPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const [decks, setDecks] = useState<Array<{
    id: string
    name: string
    description: string | null
    userId: string | null
    userEmail: string | null
    createdAt: Date
    updatedAt: Date
    cards: Array<{ id: string; front: string; back: string }>
  }> | null>(null)
  const [fetching, setFetching] = useState(false)
  const t = useTranslations("myDecks")
  const locale = useLocale()

  useEffect(() => {
    if (!user) return

    let cancelled = false
    setFetching(true)
    getMyDecks(user.uid)
      .then((result) => {
        if (!cancelled) {
          setDecks(result)
          setFetching(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDecks([])
          setFetching(false)
        }
      })

    return () => { cancelled = true }
  }, [user])

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-background">
        <section className="border-b border-border bg-grid">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
            <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
              <span className="h-px w-8 bg-accent" />
              <span>{t("heroLabel")}</span>
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 font-mono text-xs text-muted-foreground">{t("loading")}</p>
          </div>
        </section>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <section className="border-b border-border bg-grid">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
            <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
              <span className="h-px w-8 bg-accent" />
              <span>{t("heroLabel")}</span>
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              {t("signInRequired")}
            </p>
            <button
              onClick={signInWithGoogle}
              className="mt-6 inline-flex items-center gap-2 rounded-none border border-accent px-4 py-2 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {t("signIn")}
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-grid">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
            <span className="h-px w-8 bg-accent" />
            <span>{t("heroLabel")}</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            {t("heroDesc")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {!decks || decks.length === 0 ? (
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
              {t("noDecks")}
            </h3>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              {t("noDecksDesc")}
            </p>
            <Link
              href={`/${locale}/editor`}
              className="mt-6 inline-flex items-center gap-2 rounded-none border border-accent bg-accent px-5 py-2 text-sm font-semibold tracking-wider text-accent-foreground uppercase transition-colors hover:bg-transparent hover:text-accent"
            >
              {t("create")}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
