import { authApiHandler } from "@neondatabase/auth/next/server";
import { NextRequest } from "next/server";

const handler = authApiHandler();

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    console.log("DEBUG: Auth GET path:", path);
    // Explicitly call the handler with the correctly named parameter
    return await handler.GET(req, { params: Promise.resolve({ path }) });
  } catch (error: any) {
    console.error("DEBUG: Auth GET Error:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    console.log("DEBUG: Auth POST path:", path);
    // Explicitly call the handler with the correctly named parameter
    return await handler.POST(req, { params: Promise.resolve({ path }) });
  } catch (error: any) {
    console.error("DEBUG: Auth POST Error:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

export const { PUT, DELETE, PATCH } = handler;
