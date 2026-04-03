/**
 * lib/api.ts
 *
 * Typed fetch wrapper for the GitQuest backend.
 * Works in both Server Components (Node.js) and Client Components (browser).
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5198";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiError {
  message: string;
  status: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export type ApiResult<T> = {
  data: T | null;
  error: { message: string } | null;
};

// Shape returned by POST /api/auth/github-login (or /api/auth/github)
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    gitHubUsername: string;
    avatarUrl: string | null;
    experiencePoints: number;
    currentStreak: number;
  };
}

// Shape of a single issue returned by GET /api/issues/discover
export interface GitHubIssue {
  gitHubIssueId: number;
  title: string;
  description: string | null;
  repoFullName: string;
  language: string | null;
  issueUrl: string;
  difficulty: string;
  xpReward: number;
  isActive: boolean;
}

// Shape returned by POST /api/issues/{id}/claim
export interface ClaimResponse {
  message: string;
  questId: string;
}

// ---------------------------------------------------------------------------
// Core fetch helper
// ---------------------------------------------------------------------------

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let message = res.statusText;
      try {
        const body = await res.text();
        if (body) message = body;
      } catch {
        // ignore body parse failure
      }
      return { data: null, error: { message, status: res.status } };
    }

    // 204 No Content
    if (res.status === 204) {
      return { data: null, error: null };
    }

    const data: T = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    return { data: null, error: { message, status: 0 } };
  }
}

// ---------------------------------------------------------------------------
// Auth API
// ---------------------------------------------------------------------------

/**
 * Exchange a GitHub OAuth code for a GitQuest JWT.
 * Calls POST /api/auth/github
 */
export async function loginWithGitHub(
  code: string
): Promise<ApiResponse<AuthResponse>> {
  // Backend expects GitHubLoginRequest object with Code property
  return apiFetch<AuthResponse>("/api/auth/github", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

// ---------------------------------------------------------------------------
// Issues API
// ---------------------------------------------------------------------------

/**
 * Fetch recommended open-source issues.
 * Calls GET /api/issues/discover?language=<language>
 */
export async function discoverIssues(
  language = "typescript",
  token?: string
): Promise<ApiResponse<GitHubIssue[]>> {
  return apiFetch<GitHubIssue[]>(
    `/api/issues/discover?language=${encodeURIComponent(language)}`,
    {},
    token
  );
}

/**
 * Claim an issue as a quest.
 * Calls POST /api/issues/{id}/claim
 * Requires JWT.
 */
export async function claimIssue(
  id: number,
  token: string
): Promise<ApiResponse<ClaimResponse>> {
  return apiFetch<ClaimResponse>(
    `/api/issues/${id}/claim`,
    { method: "POST" },
    token
  );
}

/**
 * Fetch the current user's active quests.
 * Calls GET /api/issues/my-active-quests
 * Requires JWT.
 */
export async function getMyQuests(
  token: string
): Promise<ApiResponse<unknown[]>> {
  return apiFetch<unknown[]>("/api/issues/my-active-quests", {}, token);
}

/**
 * Submit a completed quest.
 * Calls POST /api/issues/{id}/submit
 * Requires JWT.
 */
export async function submitQuest(
  id: number,
  token: string
): Promise<ApiResponse<{ message: string; totalXp: number }>> {
  return apiFetch<{ message: string; totalXp: number }>(
    `/api/issues/${id}/submit`,
    { method: "POST" },
    token
  );
}

// ---------------------------------------------------------------------------
// Users API
// ---------------------------------------------------------------------------

/**
 * Fetch a user's profile by username.
 * Calls GET /api/users/{username}
 */
export async function getUserProfile(username: string): Promise<ApiResponse<any>> {
  return apiFetch<any>(`/api/users/${encodeURIComponent(username)}`);
}

/**
 * Fetch the leaderboard (top users by XP).
 * Calls GET /api/users/leaderboard
 */
export async function getLeaderboard(): Promise<ApiResponse<any[]>> {
  return apiFetch<any[]>("/api/users/leaderboard");
}
