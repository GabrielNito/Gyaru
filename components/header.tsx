"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { useAuth } from "@/components/auth-provider"
import { Button } from "./ui/button"

export function Header() {
  const t = useTranslations("nav")
  const tAuth = useTranslations("auth")
  const app = useTranslations("app")
  const locale = useLocale()
  const { user, loading, signInWithGoogle, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href={`/${locale}`} className="group flex items-center gap-2">
          <Image
            src="/Logo.png"
            alt="Gyaru"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          <span className="font-mono text-lg font-bold tracking-tight">
            {app("name")}
          </span>
          <span className="hidden font-mono text-[10px] text-muted-foreground uppercase sm:inline">
            {app("tagline")}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href={`/${locale}`}
            className="rounded-none border border-transparent px-3 py-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:border-accent hover:text-accent"
          >
            {t("globalDB")}
          </Link>
          <Link
            href={`/${locale}/editor`}
            className="rounded-none border border-accent bg-accent px-3 py-2 font-mono text-xs tracking-wider text-accent-foreground uppercase transition-colors hover:bg-accent/90"
          >
            {t("create")}
          </Link>
          <LocaleSwitcher />
          {loading ? null : user ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground">
                {user.email?.slice(0, 16)}
              </span>
              <button
                onClick={logout}
                className="rounded-none border border-border px-2 py-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase transition-colors hover:border-destructive hover:text-destructive"
              >
                {tAuth("signOut")}
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="rounded-none border border-accent px-2 py-1 font-mono text-[10px] tracking-wider text-accent uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {tAuth("signIn")}
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-none border border-border p-2 text-muted-foreground transition-colors hover:border-accent hover:text-accent sm:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md sm:hidden">
          <div className="flex flex-col gap-2 px-4 py-4">
            <Link
              href={`/${locale}`}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-none border border-transparent px-3 py-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:border-accent hover:text-accent"
            >
              {t("globalDB")}
            </Link>
            <Button asChild>
              <Link
                href={`/${locale}/editor`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("create")}
              </Link>
            </Button>
            <div className="flex items-center gap-2 border-t border-border pt-2">
              <LocaleSwitcher />
              {loading ? null : user ? (
                <>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {user.email?.slice(0, 16)}
                  </span>
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="rounded-none border border-border px-2 py-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase transition-colors hover:border-destructive hover:text-destructive"
                  >
                    {tAuth("signOut")}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    signInWithGoogle()
                    setMobileMenuOpen(false)
                  }}
                  className="rounded-none border border-accent px-2 py-1 font-mono text-[10px] tracking-wider text-accent uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {tAuth("signIn")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
