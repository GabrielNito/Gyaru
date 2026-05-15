import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/firebase-admin"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const decks = await db.deck.findMany({
      where: { userId: decoded.uid },
      orderBy: { updatedAt: "desc" },
      include: {
        cards: { select: { id: true, front: true, back: true } },
      },
    })

    return NextResponse.json(decks)
  } catch (error) {
    console.error("GET /api/decks/mine error:", error)
    return NextResponse.json({ error: "Failed to fetch user decks" }, { status: 500 })
  }
}
