import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { deckSchema } from "@/lib/types"
import { verifyToken } from "@/lib/firebase-admin"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deck = await db.deck.findUnique({
      where: { id },
      include: {
        cards: { select: { id: true, front: true, back: true } },
      },
    })

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 })
    }

    return NextResponse.json(deck)
  } catch (error) {
    console.error("GET /api/decks/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch deck" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization")
    let userId: string | null = null

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7)
      const decoded = await verifyToken(token)
      if (decoded) userId = decoded.uid
    }

    const { id } = await params

    const existing = await db.deck.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 })
    }

    if (existing.userId && existing.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const validated = deckSchema.parse(body)

    await db.card.deleteMany({ where: { deckId: id } })

    await db.deck.update({
      where: { id },
      data: {
        name: validated.name,
        description: validated.description,
        cards: {
          create: validated.cards.map((c) => ({ front: c.front, back: c.back })),
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error?.issues) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 })
    }
    console.error("PUT /api/decks/[id] error:", error)
    return NextResponse.json({ error: "Failed to update deck" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization")
    let userId: string | null = null

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7)
      const decoded = await verifyToken(token)
      if (decoded) userId = decoded.uid
    }

    const { id } = await params

    const existing = await db.deck.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 })
    }

    if (existing.userId && existing.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await db.deck.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/decks/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete deck" }, { status: 500 })
  }
}
