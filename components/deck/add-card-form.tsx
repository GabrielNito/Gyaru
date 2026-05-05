"use client"

import { Plus, Trash2 } from "lucide-react"
import type { UseFormRegister, FieldArrayWithId, UseFieldArrayRemove } from "react-hook-form"
import type { DeckInput } from "@/lib/types"

interface AddCardFormProps {
  register: UseFormRegister<DeckInput>
  fields: FieldArrayWithId<DeckInput, "cards", "id">[]
  remove: UseFieldArrayRemove
  onAddCard: () => void
  errors: {
    name?: { message?: string }
    description?: { message?: string }
    cards?: { message?: string }
  }
}

export function AddCardForm({ register, fields, remove, onAddCard, errors }: AddCardFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Deck Name <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            placeholder="e.g., Japanese Vocabulary"
            className="w-full rounded-none border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
            Description <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <input
            id="description"
            type="text"
            {...register("description")}
            placeholder="Brief description of this deck"
            className="w-full rounded-none border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Cards</h3>
          {errors.cards && (
            <p className="text-xs text-destructive">{errors.cards.message}</p>
          )}
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-border bg-card p-3 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Card {index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length <= 1}
                className="rounded-none p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              <input
                {...register(`cards.${index}.front` as const)}
                placeholder="Front"
                className="w-full rounded-none border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
              <textarea
                {...register(`cards.${index}.back` as const)}
                placeholder="Back"
                rows={2}
                className="w-full rounded-none border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onAddCard}
          className="w-full flex items-center justify-center gap-2 rounded-none border border-dashed border-border py-2.5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          Add Card
        </button>
      </div>
    </div>
  )
}
