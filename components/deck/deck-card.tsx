"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Trash2, Pencil, Download } from "lucide-react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
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

interface DeckCardProps {
  deck: DeckWithCards
  locale: string
}

export function DeckCard({ deck, locale }: DeckCardProps) {
  const t = useTranslations("deck")
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

  const dateStr = new Date(deck.updatedAt).toLocaleDateString(
    locale === "pt" ? "pt-BR" : locale === "ja" ? "ja-JP" : "en-US",
    {
      month: "short",
      day: "numeric",
    }
  )

  return (
    <article className="group flex flex-col border border-border bg-card transition-colors hover:border-accent">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
        <span>deck.{deck.id.slice(0, 6)}</span>
        <span>upd {dateStr}</span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="text-lg leading-tight font-semibold">{deck.name}</h3>
        {deck.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {deck.description}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="border border-border p-2">
            <div className="text-muted-foreground">{t("cards")}</div>
            <div className="text-base text-foreground">{deck.cards.length}</div>
          </div>
          <div className="border border-border p-2">
            <div className="text-muted-foreground">{t("status")}</div>
            <div className="text-base text-foreground">{t("ready")}</div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 border-t border-border p-3">
        <a
          href={`/api/download/${deck.id}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-none border border-accent bg-accent px-5 py-2 text-sm font-semibold tracking-wider text-accent-foreground uppercase transition-colors hover:bg-transparent hover:text-accent"
          download
        >
          <Download className="h-4 w-4" />
          {t("download")}
        </a>
        {isOwner && (
          <>
            <Link
              href={`/${locale}/editor/${deck.id}`}
              className="inline-flex items-center justify-center rounded-none border border-border px-3 py-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="inline-flex items-center justify-center rounded-none border border-border px-3 py-2 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
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
    </article>
  )
}
