"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState, useTransition, useEffect } from "react"
import { toast } from "sonner"
import { getDeck, updateDeck } from "@/app/actions"
import { deckSchema, type DeckInput, type DeckWithCards } from "@/lib/types"

export default function EditDeckPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deck, setDeck] = useState<DeckWithCards | null>(null)
  const [loading, setLoading] = useState(true)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
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

  useEffect(() => {
    params.then(async ({ id }) => {
      const result = await getDeck(id)
      if (result) {
        setDeck(result)
        reset({
          name: result.name,
          description: result.description || "",
          cards: result.cards.length > 0 ? result.cards : [{ front: "", back: "" }],
        })
      } else {
        toast.error("Deck not found")
        router.push("/")
      }
      setLoading(false)
    })
  }, [params, reset, router])

  const currentFront = watch("cards.0.front") || ""
  const currentBack = watch("cards.0.back") || ""
  const deckName = watch("name") || ""
  const charCount = useMemo(() => currentFront.length + currentBack.length, [currentFront, currentBack])
  const stagedCount = fields.length - 1

  const onSubmit = (data: DeckInput) => {
    params.then(({ id }) => {
      startTransition(async () => {
        const result = await updateDeck(id, data)
        if (result.success) {
          toast.success("Deck updated", { description: `${data.name} has been saved.` })
          setTimeout(() => {
            router.push("/")
            router.refresh()
          }, 1000)
        } else {
          toast.error("Update failed", { description: result.error || "Could not update the deck." })
        }
      })
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="font-mono text-xs text-muted-foreground">loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link
            href="/"
            className="rounded-none p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="font-mono text-sm tracking-tight">Edit: {deck?.name}</span>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border bg-grid">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-px w-8 bg-primary" />
            <span>v0.1 · deck forge</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Edit <span className="text-primary">.apkg</span> deck
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Modify your existing deck. Add, remove, or update cards.
          </p>
        </div>
      </section>

      {/* Editor */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              /// section_01
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Deck editor</h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="h-2 w-2 animate-pulse bg-primary" />
            {charCount} chars · {stagedCount + (currentFront || currentBack ? 1 : 0)} cards staged
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,420px)]">
            {/* LEFT: inputs */}
            <div className="flex flex-col gap-6">
              <Field label="deck name" error={errors.name?.message}>
                <input
                  {...register("name")}
                  className="w-full bg-transparent py-3 font-mono text-base text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="my-deck-01"
                />
              </Field>

              <Field label="description" error={errors.description?.message}>
                <input
                  {...register("description")}
                  className="w-full bg-transparent py-3 text-sm text-muted-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="Optional description…"
                />
              </Field>

              <Field label="front" error={errors.cards?.message}>
                <textarea
                  {...register("cards.0.front")}
                  rows={3}
                  className="w-full resize-none bg-transparent py-3 text-lg leading-snug outline-none placeholder:text-muted-foreground"
                  placeholder="The question, prompt, or term…"
                />
              </Field>

              <Field label="back">
                <textarea
                  {...register("cards.0.back")}
                  rows={4}
                  className="w-full resize-none bg-transparent py-3 text-lg leading-snug outline-none placeholder:text-muted-foreground"
                  placeholder="The answer, definition, or translation…"
                />
              </Field>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    if (!currentFront.trim() && !currentBack.trim()) {
                      toast.warning("Empty card", { description: "Fill in at least one field before adding." })
                      return
                    }
                    append({ front: "", back: "" })
                    setValue("cards.0.front", "")
                    setValue("cards.0.back", "")
                    toast.success("Card added", { description: `Now staging ${fields.length} card(s).` })
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-none bg-accent px-5 py-2 text-sm font-semibold uppercase tracking-wider text-accent-foreground border border-accent transition-colors hover:bg-transparent hover:text-accent"
                >
                  + Add card
                </button>
              </div>

              {/* Staged cards list */}
              <div className="border border-border">
                <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span>staged_cards</span>
                  <span>{stagedCount} rows</span>
                </div>
                <ul className="divide-y divide-border">
                  {stagedCount === 0 ? (
                    <li className="px-4 py-6 text-center font-mono text-xs text-muted-foreground">
                      no cards yet — start typing above
                    </li>
                  ) : (
                    fields.slice(1).map((field, i) => (
                      <li
                        key={field.id}
                        className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-4 px-4 py-3 text-sm hover:bg-secondary/30"
                      >
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="truncate">{watch(`cards.${i + 1}.front`) || "—"}</span>
                        <span className="truncate text-muted-foreground">
                          {watch(`cards.${i + 1}.back`) || "—"}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(i + 1)}
                          className="font-mono text-[10px] uppercase text-muted-foreground hover:text-destructive"
                        >
                          ×
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {/* RIGHT: live preview */}
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <CardPreview front={currentFront} back={currentBack} />
              <button
                type="submit"
                disabled={isPending}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-none bg-primary px-5 py-2 text-sm font-semibold uppercase tracking-wider text-primary-foreground border border-primary transition-colors hover:bg-transparent hover:text-primary disabled:opacity-50"
              >
                {isPending ? "saving..." : `⤓ Update ${deckName || "deck"}.apkg`}
              </button>
            </aside>
          </div>
        </form>
      </section>
    </div>
  )
}

function Field({
  label,
  children,
  error,
}: {
  label: string
  children: React.ReactNode
  error?: string
}) {
  return (
    <label className={`group block border-b ${error ? "border-destructive" : "border-border focus-within:border-accent"}`}>
      <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground group-focus-within:text-accent">
        {label}
      </span>
      {children}
      {error && <span className="block font-mono text-[10px] text-destructive">{error}</span>}
    </label>
  )
}

function CardPreview({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          /// live preview
        </span>
        <button
          onClick={() => setFlipped((f) => !f)}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent hover:underline"
        >
          {flipped ? "show front" : "flip card →"}
        </button>
      </div>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="group relative aspect-[4/3] w-full border border-border bg-card p-6 text-left transition-colors hover:border-accent"
      >
        <div className="absolute left-0 top-0 flex h-6 items-center gap-2 border-b border-r border-border bg-background px-2">
          <span className={`h-1.5 w-1.5 ${flipped ? "bg-primary" : "bg-accent"}`} />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {flipped ? "back" : "front"}
          </span>
        </div>
        <div className="absolute right-2 top-2 font-mono text-[10px] text-muted-foreground">
          01 / 01
        </div>
        <div className="flex h-full items-center justify-center">
          <p className="text-balance text-center text-2xl font-medium leading-tight">
            {flipped
              ? back || <span className="text-muted-foreground">Back side preview…</span>
              : front || <span className="text-muted-foreground">Front side preview…</span>}
          </p>
        </div>
        <div className="absolute bottom-2 left-2 font-mono text-[10px] uppercase text-muted-foreground">
          tap to flip
        </div>
      </button>
      <div className="grid grid-cols-3 gap-2 font-mono text-[10px] uppercase text-muted-foreground">
        <div className="border border-border p-2">
          <div className="text-foreground">basic</div>
          <div>type</div>
        </div>
        <div className="border border-border p-2">
          <div className="text-foreground">deck_01</div>
          <div>target</div>
        </div>
        <div className="border border-border p-2">
          <div className="text-foreground">ready</div>
          <div>status</div>
        </div>
      </div>
    </div>
  )
}
