import { neonAuthMiddleware, neonAuth } from "@neondatabase/auth/next/server";
import { NextRequest, NextResponse } from "next/server";

const authMiddleware = neonAuthMiddleware({
  loginUrl: "/login",
});

export default async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // 0. EXPLICITLY BYPASS for all static assets and internal Next.js paths
  // This is critical to prevent "Failed to load chunk" errors and MIME type issues.
  if (
    pathname.startsWith("/_next") || 
    pathname.startsWith("/api/auth") || // Internal auth routes
    pathname.includes(".") || // Files with extensions (images, js, css)
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

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

  // 4. Define Protected Routes
  // These are the routes that require an active session
  const protectedRoutes = ["/discover", "/articles"];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );

  // 5. For Protected Routes: Use authMiddleware to enforce login
  if (isProtectedRoute) {
    return authMiddleware(request);
  }

  // 6. For everything else (Public Pages, API routes, etc.): 
  // Allow access without redirection.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|backgrounds|vectors|images|logo|fonts).*)",
  ],
};
