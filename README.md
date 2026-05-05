# Gyaru — Anki Deck Forge

![Gyaru Logo](public/Logo.png)

A minimalist web tool for building, previewing, and sharing Anki flashcard decks. Export as `.apkg` with industrial precision — no fluff, just sharp corners and faster recall.

## Purpose

**Gyaru was built to solve one problem:** sharing Anki decks should be effortless, especially for mobile users. Many Anki apps are mobile-only or make deck creation painful on phones. Gyaru lets you:

- Create decks on any device with a browser
- Share decks via a public global repository
- Download `.apkg` files directly to your phone
- Import existing cards from text files

No account needed to browse and download. Sign in to create and publish decks.

## Features

- **Deck Editor** — Create `.apkg` decks with live preview
- **Global Repository** — Public database of shared decks
- **One-Click Export** — Download decks as `.apkg` files
- **Card Import** — Import from tab-separated, CSV, or double-space formatted text files
- **Multi-language** — Available in English, Português, and 日本語
- **Mobile Responsive** — Works seamlessly on all devices
- **Firebase Auth** — Google sign-in for deck management

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Auth:** Firebase Authentication
- **Database:** PostgreSQL with Prisma ORM
- **Internationalization:** next-intl (en, pt, ja)
- **Flashcard Export:** ankicore

## License

MIT
