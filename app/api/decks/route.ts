import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { deckSchema } from "@/lib/types"
import { verifyToken } from "@/lib/firebase-admin"

export async function GET() {
  try {
    const decks = await db.deck.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        cards: { select: { id: true, front: true, back: true } },
      },
    })
    return NextResponse.json(decks)
  } catch (error) {
    console.error("GET /api/decks error:", error)
    return NextResponse.json({ error: "Failed to fetch decks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    let userId: string | null = null
    let userEmail: string | null = null

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7)
      const decoded = await verifyToken(token)
      if (decoded) {
        userId = decoded.uid
        userEmail = decoded.email ?? null
      }
    }

    const body = await request.json()
    const validated = deckSchema.parse(body)

    const deck = await db.deck.create({
      data: {
        name: validated.name,
        description: validated.description,
        userId,
        userEmail,
        cards: {
          create: validated.cards.map((c) => ({ front: c.front, back: c.back })),
        },
      },
    })

    return NextResponse.json({ success: true, deckId: deck.id }, { status: 201 })
  } catch (error: any) {
    if (error?.issues) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 })
    }
    console.error("POST /api/decks error:", error)
    return NextResponse.json({ error: "Failed to create deck" }, { status: 500 })
  }
}
