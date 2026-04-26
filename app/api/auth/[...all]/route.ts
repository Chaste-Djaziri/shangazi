import { authApiHandler } from "@neondatabase/auth/next";

export const { GET, POST, PUT, DELETE, PATCH } = authApiHandler();
