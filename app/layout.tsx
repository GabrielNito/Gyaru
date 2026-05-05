import { Inter, JetBrains_Mono } from "next/font/google"
import type { Metadata } from "next"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
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
      <body className={cn("antialiased bg-background text-foreground", inter.variable, jetBrainsMono.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
