import { neonAuthMiddleware } from "@neondatabase/auth/next/server";

export default neonAuthMiddleware({
  loginUrl: "/login",
});

export const config = {
  matcher: [
    "/discover/:path*",
    // Add other protected routes here
  ],
};
