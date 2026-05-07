import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get("title") || "Gyaru — Anki Forge"
  const cards = searchParams.get("cards") || "0"
  const id = searchParams.get("id") || ""

  const [interBold, interRegular, interSemiBold] = await Promise.all([
    fetch(new URL("https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.woff2")).then((r) => r.arrayBuffer()),
    fetch(new URL("https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTcviYwY.woff2")).then((r) => r.arrayBuffer()),
    fetch(new URL("https://fonts.gstatic.com/s/inter/v18/UcC83FwrK3iLTcviYwY.woff2")).then((r) => r.arrayBuffer()),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px",
          background: "#1a1a2e",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Inter",
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Accent line top-left */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 48,
            width: 64,
            height: 3,
            background: "#8b5cf6",
          }}
        />

        {/* Top section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                background: "#8b5cf6",
                borderRadius: 0,
                fontSize: 16,
                fontWeight: 700,
                color: "#0a0a1a",
                fontFamily: "Inter",
              }}
            >
              g
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              gyaru / anki forge
            </span>
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#f0f0f5",
              maxWidth: "80%",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom section */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "12px 20px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                cards
              </span>
              <span style={{ fontSize: 28, fontWeight: 700, color: "#8b5cf6" }}>
                {cards}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "12px 20px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                status
              </span>
              <span style={{ fontSize: 28, fontWeight: 700, color: "#a3e635" }}>
                ready
              </span>
            </div>
          </div>

          {/* Right accent */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <div style={{ width: 48, height: 3, background: "#8b5cf6" }} />
            <span style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
              deck.{id.slice(0, 6)}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: interBold,
          style: "normal",
          weight: 700,
        },
        {
          name: "Inter",
          data: interRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Inter",
          data: interSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    }
  )
}
