"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { LocaleSwitcher } from "@/components/locale-switcher"

export function Header() {
  const t = useTranslations("nav")
  const app = useTranslations("app")
  const locale = useLocale()
  const pathname = usePathname()

  const navPaths = [
    { href: `/${locale}/editor`, label: t("create") },
    { href: `/${locale}`, label: t("globalDB") },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href={`/${locale}`} className="group flex items-center gap-2">
          <Image src="/Logo.png" alt="Gyaru" width={24} height={24} className="h-6 w-6" />
          <span className="font-mono text-lg font-bold lowercase tracking-tight">{app("name")}</span>
          <span className="hidden font-mono text-[10px] uppercase text-muted-foreground sm:inline">
            {app("tagline")}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1">
            {navPaths.map(({ href, label }) => {
              const isActive =
                pathname === href ||
                (href.endsWith("/editor") && pathname.endsWith("/editor"))
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-none px-3 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground",
                    isActive && "text-foreground",
                  )}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  )
}
