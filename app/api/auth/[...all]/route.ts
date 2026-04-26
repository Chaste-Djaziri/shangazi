import { authApiHandler } from "@neondatabase/auth/next/server";
import { NextRequest } from "next/server";

const handler = authApiHandler();

export async function GET(req: NextRequest, { params }: { params: Promise<{ all: string[] }> }) {
  console.log("DEBUG: Auth API GET hit:", req.url);
  try {
    return await handler.GET(req, { params });
  } catch (error: any) {
    console.error("DEBUG: Auth API GET Error:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ all: string[] }> }) {
  console.log("DEBUG: Auth API POST hit:", req.url);
  try {
    return await handler.POST(req, { params });
  } catch (error: any) {
    console.error("DEBUG: Auth API POST Error:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

export const { PUT, DELETE, PATCH } = handler;
