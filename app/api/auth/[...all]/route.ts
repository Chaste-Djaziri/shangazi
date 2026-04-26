import { authApiHandler } from "@neondatabase/auth/next/server";
import { NextRequest } from "next/server";

const handler = authApiHandler();

export async function GET(req: NextRequest, { params }: { params: Promise<{ all: string[] }> }) {
  try {
    return await handler.GET(req, { params });
  } catch (error) {
    console.error("Auth GET error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ all: string[] }> }) {
  try {
    return await handler.POST(req, { params });
  } catch (error) {
    console.error("Auth POST error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ all: string[] }> }) {
  return await handler.PUT(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ all: string[] }> }) {
  return await handler.DELETE(req, { params });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ all: string[] }> }) {
  return await handler.PATCH(req, { params });
}
