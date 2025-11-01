"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}



