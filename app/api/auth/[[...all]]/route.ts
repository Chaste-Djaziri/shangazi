import { authApiHandler } from "@neondatabase/auth/next/server";
import { NextRequest } from "next/server";

const handler = authApiHandler();

export async function GET(req: NextRequest, { params }: { params: Promise<{ all: string[] }> }) {
  console.log("Auth API GET hit:", req.url);
  return handler.GET(req, { params });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ all: string[] }> }) {
  console.log("Auth API POST hit:", req.url);
  return handler.POST(req, { params });
}

export const { PUT, DELETE, PATCH } = handler;
