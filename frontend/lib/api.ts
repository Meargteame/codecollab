/**
 * CodeCollab API client
 * Base URL reads from NEXT_PUBLIC_API_URL env var, falls back to localhost:8000
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ---------------------------------------------------------------------------
// Token storage helpers (localStorage)
// ---------------------------------------------------------------------------

export const tokens = {
  getAccess: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null,

  getRefresh: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null,

  set: (access: string, refresh: string) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  },

  clear: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
};

// ---------------------------------------------------------------------------
// Core fetch wrapper with automatic token refresh
// ---------------------------------------------------------------------------

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const accessToken = tokens.getAccess();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // Auto-refresh on 401 — but NOT for auth endpoints (login/register)
  // to avoid redirect loops and allow proper error display
  const isAuthEndpoint = path.startsWith("/api/v1/auth/login") || path.startsWith("/api/v1/auth/register");

  if (res.status === 401 && retry && !isAuthEndpoint) {
    const refreshToken = tokens.getRefresh();
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          tokens.set(data.access_token, data.refresh_token);
          // Retry original request once with new token
          return request<T>(path, options, false);
        }
      } catch {
        // refresh failed — fall through to clear tokens
      }
    }
    tokens.clear();
    window.location.href = "/signin";
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.detail ?? "Request failed");
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// ---------------------------------------------------------------------------
// Auth endpoints
// ---------------------------------------------------------------------------

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  email_verified: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AuditLogPage {
  items: AuditLogEntry[];
  total: number;
  limit: number;
  offset: number;
}

export const auth = {
  register: (email: string, password: string, full_name?: string) =>
    request<TokenPair>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, full_name }),
    }),

  login: (email: string, password: string) =>
    request<TokenPair>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request<void>("/api/v1/auth/logout", { method: "POST" }),

  me: () => request<UserProfile>("/api/v1/auth/me"),
};

// ---------------------------------------------------------------------------
// User endpoints
// ---------------------------------------------------------------------------

export const users = {
  getMe: () => request<UserProfile>("/api/v1/users/me"),

  updateMe: (data: { full_name?: string; avatar_url?: string }) =>
    request<UserProfile>("/api/v1/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteMe: () =>
    request<void>("/api/v1/users/me", { method: "DELETE" }),

  changePassword: (current_password: string, new_password: string) =>
    request<void>("/api/v1/users/me/password", {
      method: "PUT",
      body: JSON.stringify({ current_password, new_password }),
    }),

  verifyEmail: (token: string) =>
    request<UserProfile>("/api/v1/users/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  resendVerification: () =>
    request<{ message: string; token?: string }>(
      "/api/v1/users/me/resend-verification",
      { method: "POST" }
    ),

  getAuditLogs: (limit = 50, offset = 0) =>
    request<AuditLogPage>(
      `/api/v1/users/me/audit-logs?limit=${limit}&offset=${offset}`
    ),
};
