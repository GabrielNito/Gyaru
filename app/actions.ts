"use server"

import { db } from "@/lib/db"
import { deckSchema, type DeckInput, type DeckWithCards } from "@/lib/types"
import { revalidatePath } from "next/cache"

export async function saveDeck(data: DeckInput): Promise<{ success: boolean; deckId?: string; error?: string }> {
  try {
    const validated = deckSchema.parse(data)

    const deck = await db.deck.create({
      data: {
        name: validated.name,
        description: validated.description,
        cards: {
          create: validated.cards.map((card) => ({
            front: card.front,
            back: card.back,
          })),
        },
      },
    })

    revalidatePath("/")
    revalidatePath("/editor")

    return { success: true, deckId: deck.id }
  } catch (error) {
    console.error("Failed to save deck:", error)
    return { success: false, error: "Failed to save deck" }
  }
}

export async function getDecks(): Promise<DeckWithCards[]> {
  try {
    const decks = await db.deck.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        cards: {
          select: {
            id: true,
            front: true,
            back: true,
          },
        },
      },
    })

    return decks
  } catch (error) {
    console.error("Failed to fetch decks:", error)
    return []
  }
}

export async function getDeck(id: string): Promise<DeckWithCards | null> {
  try {
    const deck = await db.deck.findUnique({
      where: { id },
      include: {
        cards: {
          select: {
            id: true,
            front: true,
            back: true,
          },
        },
      },
    })

    return deck
  } catch (error) {
    console.error("Failed to fetch deck:", error)
    return null
  }
}

export async function deleteDeck(id: string): Promise<{ success: boolean }> {
  try {
    await db.deck.delete({
      where: { id },
    })

    revalidatePath("/")
    revalidatePath("/editor")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete deck:", error)
    return { success: false }
  }
}
