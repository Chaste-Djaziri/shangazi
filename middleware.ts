import { neonAuthMiddleware } from "@neondatabase/auth/next/server";

export default neonAuthMiddleware({
  loginUrl: "/login",
});

export const config = {
  matcher: [
    "/discover/:path*",
    "/api/auth/:path*",
  ],
};
