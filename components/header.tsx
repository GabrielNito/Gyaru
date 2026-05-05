"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { useAuth } from "@/components/auth-provider"

export function Header() {
  const t = useTranslations("nav")
  const app = useTranslations("app")
  const locale = useLocale()
  const pathname = usePathname()
  const { user, loading, signInWithGoogle, logout } = useAuth()

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
          {loading ? null : user ? (
            <div className="flex items-center gap-2">
              <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
                {user.email?.slice(0, 16)}
              </span>
              <button
                onClick={logout}
                className="rounded-none border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="rounded-none border border-accent px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
