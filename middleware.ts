import { neonAuthMiddleware } from "@neondatabase/auth/next/server";
import { NextRequest, NextResponse } from "next/server";

const authMiddleware = neonAuthMiddleware({
  loginUrl: "/login",
});

export default async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // List of public routes that should not trigger a redirect to login
  const publicRoutes = ["/", "/about", "/blog", "/contact"];
  
  const isPublicRoute = publicRoutes.some(route => pathname === route);
  const hasVerifier = searchParams.has("neon_auth_session_verifier");

  // If it's a public route and NOT an OAuth callback (no verifier),
  // we let it pass through without calling the auth middleware protection.
  // However, we still want the auth middleware to run if there is a verifier
  // so it can exchange it for a session cookie.
  if (isPublicRoute && !hasVerifier) {
    return NextResponse.next();
  }

  return authMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|backgrounds|vectors|images|logo|fonts).*)",
  ],
};
