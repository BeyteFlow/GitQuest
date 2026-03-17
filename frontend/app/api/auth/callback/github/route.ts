/**
 * app/api/auth/callback/github/route.ts
 *
 * Next.js API route – GitHub OAuth callback.
 *
 * Flow:
 *  1. GitHub redirects here with ?code=<one-time-code>
 *  2. We forward the code to the ASP.NET backend (POST /api/auth/github)
 *  3. The backend exchanges the code for a GitHub access token, fetches the
 *     user profile, persists it, and returns a signed JWT.
 *  4. We store the JWT in an HttpOnly cookie and redirect the user to /discover.
 */

import { NextRequest, NextResponse } from "next/server";
import { loginWithGitHub } from "@/lib/api";
import { buildAuthCookies } from "@/lib/auth";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // GitHub can send an error param (e.g. when the user denies access)
  if (error || !code) {
    return NextResponse.redirect(
      new URL("/?auth_error=access_denied", request.url)
    );
  }

  const { data, error: apiError } = await loginWithGitHub(code);

  if (apiError || !data) {
    return NextResponse.redirect(
      new URL("/?auth_error=login_failed", request.url)
    );
  }

  const cookies = buildAuthCookies(data.token, {
    gitHubUsername: data.user.gitHubUsername,
    avatarUrl: data.user.avatarUrl,
  });

  const response = NextResponse.redirect(new URL("/discover", request.url));
  for (const cookie of cookies) {
    response.headers.append("Set-Cookie", cookie);
  }
  return response;
}
