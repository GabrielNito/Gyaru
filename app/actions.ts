"use server"

import { db } from "@/lib/db"
import { deckSchema, type DeckInput, type DeckWithCards } from "@/lib/types"
import { revalidatePath } from "next/cache"

export async function saveDeck(
  data: DeckInput,
  userId?: string,
): Promise<{ success: boolean; deckId?: string; error?: string }> {
  try {
    const validated = deckSchema.parse(data)

    const deck = await db.deck.create({
      data: {
        name: validated.name,
        description: validated.description,
        userId: userId ?? null,
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
    revalidatePath("/my-decks")

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

    return decks.map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description,
      userId: d.userId,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      cards: d.cards.map((c) => ({
        id: c.id,
        front: c.front,
        back: c.back,
      })),
    }))
  } catch (error) {
    console.error("Failed to fetch decks:", error)
    return []
  }
}

export async function getMyDecks(userId: string): Promise<DeckWithCards[]> {
  try {
    const decks = await db.deck.findMany({
      where: { userId },
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

    return decks.map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description,
      userId: d.userId,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      cards: d.cards.map((c) => ({
        id: c.id,
        front: c.front,
        back: c.back,
      })),
    }))
  } catch (error) {
    console.error("Failed to fetch user decks:", error)
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

    if (!deck) return null

    return {
      id: deck.id,
      name: deck.name,
      description: deck.description,
      userId: deck.userId,
      createdAt: deck.createdAt,
      updatedAt: deck.updatedAt,
      cards: deck.cards.map((c) => ({
        id: c.id,
        front: c.front,
        back: c.back,
      })),
    }
  } catch (error) {
    console.error("Failed to fetch deck:", error)
    return null
  }
}

export async function deleteDeck(
  id: string,
  userId?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const existing = await db.deck.findUnique({
      where: { id },
    })

    if (!existing) {
      return { success: false, error: "Deck not found" }
    }

    if (existing.userId && existing.userId !== userId) {
      return { success: false, error: "Unauthorized" }
    }

    await db.deck.delete({
      where: { id },
    })

    revalidatePath("/")
    revalidatePath("/editor")
    revalidatePath("/my-decks")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete deck:", error)
    return { success: false, error: "Failed to delete deck" }
  }
}

export async function updateDeck(
  id: string,
  data: DeckInput,
  userId?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const validated = deckSchema.parse(data)

    const existing = await db.deck.findUnique({
      where: { id },
    })

    if (!existing) {
      return { success: false, error: "Deck not found" }
    }

    if (existing.userId && existing.userId !== userId) {
      return { success: false, error: "Unauthorized" }
    }

    await db.card.deleteMany({
      where: { deckId: id },
    })

    await db.deck.update({
      where: { id },
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
    revalidatePath("/my-decks")

    return { success: true }
  } catch (error) {
    console.error("Failed to update deck:", error)
    return { success: false, error: "Failed to update deck" }
  }
}
