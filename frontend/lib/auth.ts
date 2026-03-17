/**
 * lib/auth.ts
 *
 * JWT token management using HttpOnly cookies (server-side) and
 * a lightweight in-memory accessor for client components.
 *
 * Storage strategy:
 *  • The JWT is written as an HttpOnly, Secure, SameSite=Lax cookie by the
 *    Next.js API route that handles the OAuth callback.  This prevents
 *    JavaScript from reading the token directly (XSS protection).
 *  • Client components that need to know whether the user is authenticated
 *    rely on a lightweight /api/auth/me endpoint (or a non-sensitive cookie
 *    like `gq_user`) rather than decoding the JWT in JS.
 */

const TOKEN_COOKIE = "gq_token";
const USER_COOKIE = "gq_user";

const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours – must match JwtSettings:DurationInMinutes

// ---------------------------------------------------------------------------
// Server-side helpers (use only in Next.js route handlers / Server Components)
// ---------------------------------------------------------------------------

/**
 * Build Set-Cookie header values for storing the JWT.
 * Called from the GitHub OAuth callback API route.
 */
export function buildAuthCookies(
  token: string,
  user: { gitHubUsername: string; avatarUrl: string | null }
): string[] {
  const isProduction = process.env.NODE_ENV === "production";
  const maxAge = AUTH_COOKIE_MAX_AGE_SECONDS;

  const tokenCookie = [
    `${TOKEN_COOKIE}=${token}`,
    `Max-Age=${maxAge}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    ...(isProduction ? ["Secure"] : []),
  ].join("; ");

  // A non-HttpOnly cookie so client JS can read basic user info without
  // exposing the token itself.
  const userPayload = encodeURIComponent(
    JSON.stringify({
      username: user.gitHubUsername,
      avatar: user.avatarUrl ?? "",
    })
  );
  const userCookie = [
    `${USER_COOKIE}=${userPayload}`,
    `Max-Age=${maxAge}`,
    "Path=/",
    "SameSite=Lax",
    ...(isProduction ? ["Secure"] : []),
  ].join("; ");

  return [tokenCookie, userCookie];
}

/**
 * Build Set-Cookie header values that clear the auth cookies (logout).
 */
export function buildClearAuthCookies(): string[] {
  return [
    `${TOKEN_COOKIE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`,
    `${USER_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`,
  ];
}

/**
 * Extract the JWT from an incoming request's cookie header.
 * Safe to call from Next.js middleware, route handlers, and Server Components.
 */
export function getTokenFromCookieHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${TOKEN_COOKIE}=`));
  return match ? match.slice(TOKEN_COOKIE.length + 1) : null;
}

// ---------------------------------------------------------------------------
// Client-side helpers (safe to call in "use client" components)
// ---------------------------------------------------------------------------

export interface UserInfo {
  username: string;
  avatar: string;
}

/**
 * Read basic user info from the non-HttpOnly `gq_user` cookie.
 * Returns null when the user is not authenticated.
 * Safe to call in Client Components (browser only).
 */
export function getClientUserInfo(): UserInfo | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${USER_COOKIE}=`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.slice(USER_COOKIE.length + 1)));
  } catch {
    return null;
  }
}

/**
 * Clear auth cookies from the client side (non-HttpOnly cookie only).
 * For a full logout, also call the /api/auth/logout Next.js route which
 * clears the HttpOnly token cookie server-side.
 */
export function clearClientUserInfo(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${USER_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}
