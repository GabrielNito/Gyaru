"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "next/navigation"

const locales = [
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
  { code: "ja", label: "日本語" },
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
    <select
      value={locale}
      onChange={(e) => switchLocale(e.target.value)}
      className="cursor-pointer rounded-none border border-border bg-transparent px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground outline-none focus:border-accent"
    >
      {locales.map((l) => (
        <option key={l.code} value={l.code} className="bg-background text-foreground">
          {l.label}
        </option>
      ))}
    </select>
  )
}
