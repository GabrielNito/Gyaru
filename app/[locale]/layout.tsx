import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { Header } from "@/components/header"
import { AuthProvider } from "@/components/auth-provider"

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider>
        <Header />
        <main className="min-h-screen pt-16">{children}</main>
      </AuthProvider>
    </NextIntlClientProvider>
  )
}
