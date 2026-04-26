import { neonAuthMiddleware, neonAuth } from "@neondatabase/auth/next/server";
import { NextRequest, NextResponse } from "next/server";

const authMiddleware = neonAuthMiddleware({
  loginUrl: "/login",
});

export default async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // 1. Always handle verifiers first (OAuth callback)
  if (searchParams.has("neon_auth_session_verifier")) {
    console.log("DEBUG: Middleware - Verifier detected, exchanging...");
    // After exchanging the verifier, the SDK redirects to the same URL without the verifier.
    // We want to ensure that if this was a login attempt, we eventually land on /discover.
    return authMiddleware(request);
  }

  // 2. Define our routes
  const authRoutes = ["/login", "/signup", "/forgot-password"];
  const publicRoutes = ["/", "/about", "/blog", "/contact"];
  
  const isAuthRoute = authRoutes.some(route => pathname === route);
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  // Check session
  const { session } = await neonAuth();
  console.log(`DEBUG: Middleware - Path: ${pathname}, Session: ${session ? "YES" : "NO"}`);

  // 3. Special handling for home page landing after OAuth
  // If we land on "/" and have a session, it might be right after a Google login.
  // We'll redirect to /discover once to get them into the app.
  if (session && pathname === "/") {
     // Check if we should redirect. If they just landed here, redirect to discover.
     // But we don't want to trap them in /discover if they manually go back to home.
     // For now, let's prioritize getting them in.
     console.log("DEBUG: Middleware - Session found on home page, promoting to /discover");
     return NextResponse.redirect(new URL("/discover", request.url));
  }

  // 4. If logged in and on an auth page, go to discover
  if (session && isAuthRoute) {
    console.log("DEBUG: Middleware - Redirecting logged-in user from auth page to /discover");
    return NextResponse.redirect(new URL("/discover", request.url));
  }

  // 5. If it's a public route, allow it
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 6. Otherwise, it's a protected route (like /discover)
  if (!session) {
    console.log("DEBUG: Middleware - Protected route accessed without session, going to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("DEBUG: Middleware - Access granted to:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|backgrounds|vectors|images|logo|fonts).*)",
  ],
};
