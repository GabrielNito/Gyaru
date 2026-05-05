import { z } from "zod"

export const cardSchema = z.object({
  id: z.string().optional(),
  front: z.string().min(1, "Front is required"),
  back: z.string().min(1, "Back is required"),
})

export const deckSchema = z.object({
  name: z.string().min(1, "Deck name is required"),
  description: z.string().optional(),
  cards: z.array(cardSchema).min(1, "At least one card is required"),
})

export type CardInput = z.infer<typeof cardSchema>
export type DeckInput = z.infer<typeof deckSchema>

export interface DeckWithCards {
  id: string
  name: string
  description: string | null
  userId: string | null
  createdAt: Date
  updatedAt: Date
  cards: {
    id: string
    front: string
    back: string
  }[]
}
