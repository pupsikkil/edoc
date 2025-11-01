import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ProtectedRoute } from "@/components/auth/protected-route"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "ЭДО Система - Электронный документооборот",
  description: "Платформа электронного документооборота для Кыргызской Республики",
}

// Список путей, которые не требуют авторизации
const publicRoutes = ["/login", "/register", "/forgot-password"]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

