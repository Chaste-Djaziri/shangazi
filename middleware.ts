import { neonAuthMiddleware, neonAuth } from "@neondatabase/auth/next/server";
import { NextRequest, NextResponse } from "next/server";

const authMiddleware = neonAuthMiddleware({
  loginUrl: "/login",
});

export default async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Public routes
  const publicRoutes = ["/", "/about", "/blog", "/contact", "/login", "/signup", "/forgot-password"];
  const isPublicRoute = publicRoutes.some(route => pathname === route);
  const hasVerifier = searchParams.has("neon_auth_session_verifier");

  // 1. Handle OAuth verification exchange on any page
  if (hasVerifier) {
    console.log("DEBUG: Middleware - Verifier found, passing to authMiddleware");
    return authMiddleware(request);
  }

  // 2. If it's a public route, check session only if we want to redirect TO discover
  if (isPublicRoute) {
    const authPages = ["/login", "/signup", "/forgot-password"];
    if (authPages.includes(pathname)) {
      const { session } = await neonAuth();
      if (session) {
        console.log("DEBUG: Middleware - Session found on auth page, redirecting to /discover");
        return NextResponse.redirect(new URL("/discover", request.url));
      }
    }
    return NextResponse.next();
  }

  // 3. For protected routes (like /discover), use authMiddleware
  console.log("DEBUG: Middleware - Protecting route:", pathname);
  const { session } = await neonAuth();
  if (!session) {
    console.log("DEBUG: Middleware - No session found for protected route, redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|backgrounds|vectors|images|logo|fonts).*)",
  ],
};
