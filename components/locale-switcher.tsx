"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "next/navigation"

const locales = [
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
  { code: "ja", label: "JA" },
]

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/")
    segments[1] = newLocale
    router.push(segments.join("/"))
  }

  return (
    <div className="flex items-center gap-1">
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => switchLocale(l.code)}
          className={`rounded-none px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
            locale === l.code
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
