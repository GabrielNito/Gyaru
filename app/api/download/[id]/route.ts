import { getDeck } from "@/app/actions"
import { generateApkgBuffer } from "@/lib/export-server"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 30

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const deck = await getDeck(id)

  if (!deck) {
    return new NextResponse("Deck not found", { status: 404 })
  }

  if (deck.cards.length === 0) {
    return new NextResponse("Deck has no cards", { status: 400 })
  }

  try {
    const data = await generateApkgBuffer({
      name: deck.name,
      cards: deck.cards,
    })

    const filename = `${deck.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.apkg`

    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Failed to generate .apkg:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return new NextResponse(`Failed to generate deck: ${message}`, { status: 500 })
  }
}
