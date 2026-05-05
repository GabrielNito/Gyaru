"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Trash2, Pencil, Share2, Download } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { deleteDeck } from "@/app/actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/components/auth-provider"
import type { DeckWithCards } from "@/lib/types"

interface DeckDetailProps {
  deck: DeckWithCards
  locale: string
}

export function DeckDetail({ deck, locale }: DeckDetailProps) {
  const t = useTranslations("deck")
  const td = useTranslations("deckDetail")
  const { user } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwner = user && deck.userId === user.uid

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteDeck(deck.id, user?.uid)
    if (result.success) {
      toast.success(t("deleted"))
    } else {
      toast.error(t("deleteFailed"), { description: t("deleteFailedDesc") })
      setIsDeleting(false)
    }
  }

  const copyShareLink = () => {
    const url = `${window.location.origin}/${locale}/deck/${deck.id}`
    navigator.clipboard.writeText(url)
    toast.success(td("linkCopied"))
  }

  const dateStr = new Date(deck.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const createdStr = new Date(deck.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="flex flex-col gap-8">
      {/* Meta section */}
      <section className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-mono text-xs text-muted-foreground">
            <span>
              {td("cards")}:{" "}
              <span className="text-foreground">{deck.cards.length}</span>
            </span>
            <span>
              {td("status")}:{" "}
              <span className="text-foreground">{td("ready")}</span>
            </span>
            <span>
              {td("owner")}:{" "}
              <span className="text-foreground">
                {deck.userId
                  ? (user?.email?.slice(0, 20) ?? "user")
                  : td("anonymous")}
              </span>
            </span>
            <span>
              {td("updated")}:{" "}
              <span className="text-foreground">{dateStr}</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:self-start">
          <a
            href={`/api/download/${deck.id}?format=apkg`}
            className="inline-flex items-center justify-center gap-2 rounded-none border border-accent bg-accent px-5 py-2 text-sm font-semibold tracking-wider text-accent-foreground uppercase transition-colors hover:bg-transparent hover:text-accent"
            download
          >
            <Download className="h-4 w-4" />
            {td("downloadApkg")}
          </a>
          <a
            href={`/api/download/${deck.id}?format=txt`}
            className="inline-flex items-center justify-center gap-2 rounded-none border border-accent bg-accent px-5 py-2 text-sm font-semibold tracking-wider text-accent-foreground uppercase transition-colors hover:bg-transparent hover:text-accent"
            download
          >
            <Download className="h-4 w-4" />
            {td("downloadTxt")}
          </a>
          <button
            onClick={copyShareLink}
            className="inline-flex items-center justify-center gap-2 rounded-none border border-border px-5 py-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            <Share2 className="h-4 w-4" />
            {td("shareLink")}
          </button>
          {isOwner && (
            <>
              <Link
                href={`/${locale}/editor/${deck.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-none border border-border px-5 py-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase transition-colors hover:border-primary hover:text-primary"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="inline-flex items-center justify-center gap-2 rounded-none border border-border px-5 py-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase transition-colors hover:border-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    {t("delete")}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-none border border-border bg-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t("deleteTitle", { name: deck.name })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("deleteDesc", { count: deck.cards.length })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="rounded-none">
                    <AlertDialogCancel className="rounded-none border-border">
                      {t("cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                    >
                      {isDeleting ? t("deleting") : t("delete")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </section>

      {/* Cards list */}
      <section>
        <div className="mb-4 border-b border-border pb-3">
          <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
            {td("sectionLabel")}
          </span>
          <h2 className="mt-1 text-xl font-bold tracking-tight">
            {td("sectionTitle")}
          </h2>
        </div>
        {deck.cards.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">
            {td("noCards")}
          </p>
        ) : (
          <div className="grid gap-px bg-border">
            {/* Header */}
            <div className="grid grid-cols-[auto_1fr_1fr] gap-4 bg-background px-4 py-2 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
              <span>#</span>
              <span>{td("front")}</span>
              <span>{td("back")}</span>
            </div>
            {/* Cards */}
            {deck.cards.map((card, i) => (
              <div
                key={card.id}
                className="grid grid-cols-[auto_1fr_1fr] gap-4 bg-background px-4 py-3 text-sm hover:bg-secondary/30"
              >
                <span className="font-mono text-[10px] text-muted-foreground select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="whitespace-pre-wrap">{card.front}</p>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {card.back}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
