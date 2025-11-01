import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/login", "/register", "/forgot-password"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Публичные маршруты пропускаем
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }
  
  // Для остальных маршрутов проверка будет в компоненте ProtectedRoute
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}



