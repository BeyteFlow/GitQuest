/**
 * app/api/auth/logout/route.ts
 *
 * Clears the HttpOnly JWT cookie (server-side logout).
 */

import { NextRequest, NextResponse } from "next/server";
import { buildClearAuthCookies } from "@/lib/auth";

export async function POST(_request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true });
  for (const cookie of buildClearAuthCookies()) {
    response.headers.append("Set-Cookie", cookie);
  }
  return response;
}
