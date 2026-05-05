"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    if (stored === "light") {
      setTheme("light")
    } else if (stored === "dark") {
      setTheme("dark")
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light")
    }
  }, [])

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    localStorage.setItem("theme", next)
    if (next === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <button
      onClick={toggle}
      className="rounded-none p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  )
}
