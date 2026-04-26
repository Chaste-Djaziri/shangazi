import { neonAuthMiddleware, neonAuth } from "@neondatabase/auth/next/server";
import { NextRequest, NextResponse } from "next/server";

const authMiddleware = neonAuthMiddleware({
  loginUrl: "/login",
});

export default async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // 1. Handle OAuth verifiers (callback logic)
  if (searchParams.has("neon_auth_session_verifier")) {
    return authMiddleware(request);
  }

  // 2. Define routes
  const authRoutes = ["/login", "/signup", "/forgot-password"];
  const isAuthRoute = authRoutes.some(route => pathname === route);

  // 3. For Auth Routes: If already logged in, redirect to discover
  if (isAuthRoute) {
    const { session } = await neonAuth();
    if (session) {
      return NextResponse.redirect(new URL("/discover", request.url));
    }
    return NextResponse.next();
  }

  // 4. For everything else (Public or Protected)
  // Let the official middleware handle it. 
  // Public routes (/, /about, etc.) are internally handled by neonAuthMiddleware 
  // if they aren't explicitly protected by its configuration, but since we 
  // want to protect EVERYTHING else, we call it here.
  return authMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|backgrounds|vectors|images|logo|fonts).*)",
  ],
};
