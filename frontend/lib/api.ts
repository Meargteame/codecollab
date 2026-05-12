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

  getAuditLogs: (limit = 50, offset = 0) =>
    request<AuditLogPage>(
      `/api/v1/users/me/audit-logs?limit=${limit}&offset=${offset}`
    ),
};

// ---------------------------------------------------------------------------
// Contact endpoint
// ---------------------------------------------------------------------------

export const contact = {
  send: (data: { name: string; email: string; subject: string; message: string }) =>
    request<{ detail: string }>("/api/v1/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ---------------------------------------------------------------------------
// Billing endpoints
// ---------------------------------------------------------------------------

export interface Subscription {
  id: string;
  plan: string;
  status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  amount_paid: number;
  currency: string;
  status: string;
  created: string;
  invoice_pdf: string | null;
  hosted_invoice_url: string | null;
  description: string | null;
}

export const billing = {
  getSubscription: () =>
    request<Subscription | null>("/api/v1/billing/subscription"),

  createCheckout: (plan: string) =>
    request<{ checkout_url: string }>("/api/v1/billing/checkout", {
      method: "POST",
      body: JSON.stringify({
        plan,
        success_url: `${window.location.origin}/settings?section=billing&success=true`,
        cancel_url: `${window.location.origin}/settings?section=billing`,
      }),
    }),

  createPortal: () =>
    request<{ portal_url: string }>("/api/v1/billing/portal", { method: "POST" }),

  getInvoices: () =>
    request<Invoice[]>("/api/v1/billing/invoices"),
};

// ---------------------------------------------------------------------------
// Team endpoints
// ---------------------------------------------------------------------------

export interface Team {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

export const teams = {
  list: () =>
    request<Team[]>("/api/v1/teams"),

  create: (name: string) =>
    request<Team>("/api/v1/teams", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  delete: (teamId: string) =>
    request<void>(`/api/v1/teams/${teamId}`, { method: "DELETE" }),

  listMembers: (teamId: string) =>
    request<TeamMember[]>(`/api/v1/teams/${teamId}/members`),

  addMember: (teamId: string, email: string, role: string) =>
    request<TeamMember>(`/api/v1/teams/${teamId}/members`, {
      method: "POST",
      body: JSON.stringify({ email, role }),
    }),

  updateRole: (teamId: string, userId: string, role: string) =>
    request<TeamMember>(`/api/v1/teams/${teamId}/members/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),

  removeMember: (teamId: string, userId: string) =>
    request<void>(`/api/v1/teams/${teamId}/members/${userId}`, { method: "DELETE" }),
};
