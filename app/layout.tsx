import { Inter, JetBrains_Mono } from "next/font/google"
import type { Metadata } from "next"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Gyaru — Anki Forge",
  description: "Create, store, and export Anki (.apkg) decks with industrial minimalist design.",
  openGraph: {
    title: "Gyaru — Anki Forge",
    description: "Create, store, and export Anki (.apkg) decks with industrial minimalist design.",
    images: [
      {
        url: "/Logo.png",
        width: 512,
        height: 512,
        alt: "Gyaru — Anki Forge",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Gyaru — Anki Forge",
    description: "Create, store, and export Anki (.apkg) decks with industrial minimalist design.",
    images: ["/Logo.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme')
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark')
                  } else if (theme === 'dark') {
                    document.documentElement.classList.add('dark')
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark')
                  } else {
                    document.documentElement.classList.remove('dark')
                  }
                } catch(e) {}
              })()
            `,
          }}
        />
      </head>
      <body className={cn("antialiased bg-background text-foreground", inter.variable, jetBrainsMono.variable)}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
