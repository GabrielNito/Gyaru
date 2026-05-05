"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { saveDeck } from "@/app/actions"
import { AddCardForm } from "@/components/deck/add-card-form"
import { deckSchema, type DeckInput } from "@/lib/types"

export default function EditorPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DeckInput>({
    resolver: zodResolver(deckSchema),
    defaultValues: {
      name: "",
      description: "",
      cards: [{ front: "", back: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cards",
  })

  const onSubmit = (data: DeckInput) => {
    startTransition(async () => {
      const result = await saveDeck(data)
      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 1000)
      }
    })
  }

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-none p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-medium text-sm tracking-tight">New Deck</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AddCardForm
            register={register}
            fields={fields}
            remove={remove}
            onAddCard={() => append({ front: "", back: "" })}
            errors={errors}
          />

          <div className="sticky bottom-0 -mx-4 border-t border-border bg-background px-4 py-4">
            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-none bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
            >
              {isPending ? (
                <>Saving...</>
              ) : success ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>Save Deck</>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
