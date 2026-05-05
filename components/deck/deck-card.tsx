"use client"

import { Download, Trash2 } from "lucide-react"
import { useState } from "react"
import { deleteDeck } from "@/app/actions"
import type { DeckWithCards } from "@/lib/types"

interface DeckCardProps {
  deck: DeckWithCards
}

export function DeckCard({ deck }: DeckCardProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(`/api/download/${deck.id}`)
      if (!response.ok) {
        throw new Error("Failed to generate deck")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${deck.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.apkg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm(`Delete "${deck.name}"? This cannot be undone.`)) {
      await deleteDeck(deck.id)
    }
  }

  const dateStr = new Date(deck.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="border border-border bg-card p-4 transition-colors hover:bg-accent/5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-lg">{deck.name}</h3>
          {deck.description && (
            <p className="mt-1 truncate text-sm text-muted-foreground">{deck.description}</p>
          )}
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{deck.cards.length} card{deck.cards.length !== 1 ? "s" : ""}</span>
            <span>Updated {dateStr}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center justify-center rounded-none p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
            aria-label="Download deck"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center justify-center rounded-none p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Delete deck"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {isDownloading && (
        <div className="mt-2 text-xs text-muted-foreground">Generating .apkg...</div>
      )}
    </div>
  )
}
