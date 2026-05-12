"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { users as usersApi, tokens, ApiError, AuditLogEntry, billing, Subscription, Invoice } from "@/lib/api";
import TeamSection from "@/components/TeamSection";
import Link from "next/link";

type Section = "profile" | "account" | "security" | "workspace" | "editor" | "billing" | "team" | "integrations";

// Fallback audit log data shown when the API call fails
const MOCK_AUDIT_LOGS: AuditLogEntry[] = [];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function actionLabel(action: string) {
  const map: Record<string, string> = {
    "auth.login": "Signed in",
    "auth.logout": "Signed out",
    "auth.registered": "Account created",
    "auth.token_refreshed": "Session refreshed",
    "user.profile_updated": "Profile updated",
    "user.password_changed": "Password changed",
    "user.password_reset": "Password reset",
    "user.email_verified": "Email verified",
    "user.deleted": "Account deleted",
  };
  return map[action] ?? action;
}

function actionColor(action: string) {
  if (action.startsWith("auth.login") || action === "auth.registered") return "text-green-400 bg-green-500/10";
  if (action === "auth.logout") return "text-gray-400 bg-white/5";
  if (action.includes("password")) return "text-yellow-400 bg-yellow-500/10";
  if (action === "user.deleted") return "text-red-400 bg-red-500/10";
  return "text-blue-400 bg-blue-500/10";
}

// ---------------------------------------------------------------------------
// Billing Section Component
// ---------------------------------------------------------------------------

function BillingSection() {
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingBilling, setLoadingBilling] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const success = searchParams.get("success") === "true";

  useEffect(() => {
    (async () => {
      try {
        const [sub, inv] = await Promise.all([billing.getSubscription(), billing.getInvoices()]);
        setSubscription(sub);
        setInvoices(inv);
      } catch { /* ignore */ }
      finally { setLoadingBilling(false); }
    })();
  }, []);

  const handleUpgrade = async (plan: string) => {
    setCheckoutLoading(plan);
    try {
      const { checkout_url } = await billing.createCheckout(plan);
      window.location.href = checkout_url;
    } catch { setCheckoutLoading(null); }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const { portal_url } = await billing.createPortal();
      window.location.href = portal_url;
    } catch { setPortalLoading(false); }
  };

  const currentPlan = subscription?.plan ?? "free";
  const isActive = subscription?.status === "active";

  const plans = [
    {
      id: "free", name: "Starter", price: "$0", period: "/month",
      description: "Perfect for solo developers",
      features: ["5 active sessions", "2 GB storage", "Community support", "Basic analytics", "Public repositories"],
      cta: "Current Plan", color: "border-white/10",
    },
    {
      id: "pro", name: "Pro", price: "$29", period: "/month",
      description: "For professional teams",
      features: ["Unlimited sessions", "100 GB storage", "Priority support", "Advanced analytics", "Private repositories", "Custom domains", "AI copilot access"],
      cta: "Upgrade to Pro", color: "border-blue-500", popular: true,
    },
    {
      id: "enterprise", name: "Enterprise", price: "$99", period: "/month",
      description: "For large organizations",
      features: ["Everything in Pro", "Unlimited storage", "24/7 dedicated support", "SSO & SAML", "Custom integrations", "SLA guarantee", "On-premise deployment"],
      cta: "Upgrade to Enterprise", color: "border-purple-500/50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Billing</h2>
        <p className="text-gray-400 text-sm">Manage your subscription and payment methods</p>
      </div>

      {/* Success banner */}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/30">
          <p className="text-green-400 text-sm font-bold uppercase tracking-wider">✓ Payment successful! Your plan has been upgraded.</p>
        </div>
      )}

      {/* Current plan summary */}
      <div className="p-6 bg-white/[0.02] border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1">Current Plan</h3>
            {loadingBilling ? (
              <div className="w-24 h-4 bg-white/10 animate-pulse" />
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                  {currentPlan}
                </span>
                {isActive && subscription?.current_period_end && (
                  <span className="text-xs text-gray-500">
                    Renews {new Date(subscription.current_period_end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                )}
              </div>
            )}
          </div>
          {currentPlan !== "free" && (
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              {portalLoading ? "Loading..." : "Manage Subscription"}
            </button>
          )}
        </div>

        {/* Storage bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Storage</span>
            <span className="text-xs text-gray-400">4.2 GB / {currentPlan === "free" ? "10 GB" : currentPlan === "pro" ? "100 GB" : "Unlimited"}</span>
          </div>
          <div className="w-full h-1.5 bg-white/10">
            <div className="h-full bg-blue-500" style={{ width: currentPlan === "free" ? "42%" : "8%" }} />
          </div>
        </div>
      </div>

      {/* Plans */}
      <div>
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            return (
              <div key={plan.id} className={`relative p-6 border transition-all ${isCurrent ? "bg-blue-500/5 border-blue-500" : `bg-white/[0.02] ${plan.color} hover:border-white/20`}`}>
                {plan.popular && (
                  <div className="absolute -top-px left-0 right-0 h-0.5 bg-blue-500" />
                )}
                {plan.popular && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-blue-500 text-white text-xs font-bold uppercase tracking-wider">Popular</span>
                )}
                <div className="mb-4">
                  <h4 className="text-white font-black text-lg uppercase tracking-wide mb-1">{plan.name}</h4>
                  <p className="text-gray-500 text-xs mb-3">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">{plan.price}</span>
                    <span className="text-gray-500 text-xs">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-400">
                      <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => !isCurrent && handleUpgrade(plan.id)}
                  disabled={isCurrent || checkoutLoading !== null || plan.id === "free"}
                  className={`w-full py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isCurrent
                      ? "bg-blue-500/10 text-blue-400 cursor-default border border-blue-500/30"
                      : plan.id === "free"
                      ? "bg-white/5 text-gray-500 cursor-default border border-white/10"
                      : "bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  {isCurrent ? "Current Plan" : checkoutLoading === plan.id ? "Redirecting..." : plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice history */}
      <div className="bg-white/[0.02] border border-white/10">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Invoice History</h3>
        </div>
        {loadingBilling ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 animate-spin mx-auto" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No invoices yet.</div>
        ) : (
          <div className="divide-y divide-white/5">
            <div className="grid grid-cols-4 gap-4 px-6 py-2">
              {["Date", "Amount", "Status", ""].map((h) => (
                <span key={h} className="text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</span>
              ))}
            </div>
            {invoices.map((inv) => (
              <div key={inv.id} className="grid grid-cols-4 gap-4 px-6 py-3 items-center hover:bg-white/[0.02] transition-colors">
                <span className="text-sm text-white">
                  {new Date(inv.created).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <span className="text-sm text-white">
                  {(inv.amount_paid / 100).toLocaleString("en-US", { style: "currency", currency: inv.currency.toUpperCase() })}
                </span>
                <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider w-fit ${inv.status === "paid" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                  {inv.status}
                </span>
                <div className="flex items-center gap-2 justify-end">
                  {inv.invoice_pdf && (
                    <a href={inv.invoice_pdf} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-400 transition-colors font-bold uppercase tracking-wider">
                      PDF
                    </a>
                  )}
                  {inv.hosted_invoice_url && (
                    <a href={inv.hosted_invoice_url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-wider">
                      View
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WorkspaceSettings() {
  return (
    <Suspense fallback={<div className="flex-1 bg-black" />}>
      <SettingsContent />
    </Suspense>
  );
}

const VALID_SECTIONS: Section[] = ["profile","account","security","workspace","editor","billing","team","integrations"];

function SettingsContent() {
  const { user, setUser } = useAuth();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section") as Section | null;

  const [activeSection, setActiveSection] = useState<Section>(
    sectionParam && VALID_SECTIONS.includes(sectionParam) ? sectionParam : "profile"
  );

  // Sync active section whenever the URL query param changes
  useEffect(() => {
    if (sectionParam && VALID_SECTIONS.includes(sectionParam)) {
      setActiveSection(sectionParam);
    }
  }, [sectionParam]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Clear banners when switching sections
  useEffect(() => {
    setSaved(false);
    setSaveError("");
  }, [activeSection]);

  // Profile state — populated from API via useEffect below
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
  });

  // Account state
  const [account, setAccount] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  // Workspace state
  const [workspace, setWorkspace] = useState({
    defaultWorkspace: "My Workspace",
    workspaceName: "My Workspace",
  });

  // Editor state
  const [editor, setEditor] = useState({
    theme: "dark",
    fontSize: 14,
    tabSize: 2,
    keybindings: "default",
    autoSave: true,
  });

  // Security / audit log state
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditTotal, setAuditTotal] = useState(MOCK_AUDIT_LOGS.length);
  const [auditPage, setAuditPage] = useState(0);
  const AUDIT_PAGE_SIZE = 5;
  const auditPageLogs = auditLogs.slice(0, AUDIT_PAGE_SIZE);
  const totalAuditPages = Math.ceil(auditTotal / AUDIT_PAGE_SIZE);

  // Load user data into form on mount
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.full_name ?? "",
        email: user.email,
      }));
    }
  }, [user]);

  // Load audit logs when Security tab is active
  useEffect(() => {
    if (activeSection === "security") {
      loadAuditLogs(auditPage);
    }
  }, [activeSection, auditPage]);

  const loadAuditLogs = async (page: number) => {
    setAuditLoading(true);
    try {
      const data = await usersApi.getAuditLogs(AUDIT_PAGE_SIZE, page * AUDIT_PAGE_SIZE);
      setAuditLogs(data.items);
      setAuditTotal(data.total);
    } catch {
      // keep mock data on error
    } finally {
      setAuditLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const updated = await usersApi.updateMe({ full_name: profile.name });
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (account.newPassword !== account.confirmPassword) {
      setSaveError("New passwords do not match.");
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      await usersApi.changePassword(account.currentPassword, account.newPassword);
      setAccount({ currentPassword: "", newPassword: "", confirmPassword: "", twoFactorEnabled: account.twoFactorEnabled });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This permanently deletes your account and cannot be undone.")) return;
    try {
      await usersApi.deleteMe();
      tokens.clear();
      window.location.href = "/signin";
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Failed to delete account.");
    }
  };

  const sections = [
    { id: "profile" as Section, name: "profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "account" as Section, name: "account", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    { id: "security" as Section, name: "security", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { id: "workspace" as Section, name: "workspace", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" },
    { id: "editor" as Section, name: "editor", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
    { id: "billing" as Section, name: "billing", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { id: "team" as Section, name: "team", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { id: "integrations" as Section, name: "integrations", icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" },
  ];

  return (
    <div className="flex-1 flex overflow-hidden bg-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-white/[0.02] overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Settings</h1>
          <p className="text-xs text-gray-500">Manage your preferences</p>
        </div>
        <nav className="px-2 pb-4">
          {sections.map((section) => (
            <Link
              href={`/settings?section=${section.name}`}
              key={section.id}
              // onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                activeSection === section.id
                  ? "text-white bg-blue-500/10 border-l-2 border-blue-500"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={section.icon} />
              </svg>
              {section.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Success Message */}
          {saved && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30">
              <p className="text-green-400 text-sm font-bold uppercase tracking-wider">
                ✓ Settings saved successfully!
              </p>
            </div>
          )}

          {/* Error Message */}
          {saveError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-sm font-bold uppercase tracking-wider">
                ✗ {saveError}
              </p>
            </div>
          )}

          {/* Profile Section */}
          {activeSection === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Profile</h2>
                <p className="text-gray-400 text-sm">Manage your public profile information</p>
              </div>

              <div className="p-6 bg-white/[0.02] border border-white/10 space-y-6">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Avatar</label>
                  <div className="flex items-center gap-4">
                    {/* Hidden file input */}
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 2 * 1024 * 1024) {
                          setSaveError("Image must be under 2 MB.");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = async () => {
                          const base64 = reader.result as string;
                          setProfile(prev => ({ ...prev, avatar: base64 }));
                          setSaving(true);
                          setSaveError("");
                          try {
                            const updated = await usersApi.updateMe({ avatar_url: base64 });
                            setUser(updated);
                            setSaved(true);
                            setTimeout(() => setSaved(false), 3000);
                          } catch (err) {
                            setSaveError(err instanceof ApiError ? err.message : "Failed to upload avatar.");
                          } finally {
                            setSaving(false);
                          }
                        };
                        reader.readAsDataURL(file);
                        // Reset input so same file can be re-selected
                        e.target.value = "";
                      }}
                    />

                    {/* Avatar preview */}
                    {(profile.avatar || user?.avatar_url) ? (
                      <img
                        src={profile.avatar || user?.avatar_url || ""}
                        alt="Avatar"
                        className="w-20 h-20 object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                        {profile.name.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="avatar-upload"
                        className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        {saving ? "Uploading..." : "Upload New"}
                      </label>
                      {(profile.avatar || user?.avatar_url) && (
                        <button
                          onClick={async () => {
                            setProfile(prev => ({ ...prev, avatar: "" }));
                            setSaving(true);
                            setSaveError("");
                            try {
                              const updated = await usersApi.updateMe({ avatar_url: "" });
                              setUser(updated);
                            } catch (err) {
                              setSaveError(err instanceof ApiError ? err.message : "Failed to remove avatar.");
                            } finally {
                              setSaving(false);
                            }
                          }}
                          className="px-4 py-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          Remove
                        </button>
                      )}
                      <p className="text-xs text-gray-600">JPG, PNG, GIF · Max 2 MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-wider transition-colors">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* Account Section */}
          {activeSection === "account" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Account</h2>
                <p className="text-gray-400 text-sm">Manage your account security and preferences</p>
              </div>

              <div className="p-6 bg-white/[0.02] border border-white/10 space-y-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Change Password</h3>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Current Password</label>
                  <input
                    type="password"
                    value={account.currentPassword}
                    onChange={(e) => setAccount({ ...account, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">New Password</label>
                    <input
                      type="password"
                      value={account.newPassword}
                      onChange={(e) => setAccount({ ...account, newPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Confirm Password</label>
                    <input
                      type="password"
                      value={account.confirmPassword}
                      onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <button onClick={handleChangePassword} disabled={saving} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-wider transition-colors">
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </div>

              <div className="p-6 bg-white/[0.02] border border-white/10 space-y-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10">
                  <div>
                    <div className="text-sm font-bold text-white mb-1">2FA Status</div>
                    <div className="text-xs text-gray-500">{account.twoFactorEnabled ? "Enabled" : "Disabled"}</div>
                  </div>
                  <button
                    onClick={() => setAccount({ ...account, twoFactorEnabled: !account.twoFactorEnabled })}
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                      account.twoFactorEnabled
                        ? "bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500/20"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {account.twoFactorEnabled ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>

              <div className="p-6 bg-red-500/5 border border-red-500/30 space-y-4">
                <h3 className="text-lg font-bold text-red-400 uppercase tracking-wider">Danger Zone</h3>
                <p className="text-sm text-gray-400">Irreversible actions</p>
                
                <button onClick={handleDeleteAccount} className="px-6 py-2 bg-red-500/10 border border-red-500/50 hover:bg-red-500 hover:border-red-500 text-red-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Security</h2>
                <p className="text-gray-400 text-sm">Account activity log</p>
              </div>

              {/* Audit Log */}
              <div className="p-6 bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Account Activity</h3>
                    <p className="text-xs text-gray-500 mt-1">Recent actions on your account</p>
                  </div>
                  <div className="px-2 py-1 bg-white/5 border border-white/10 text-xs text-gray-400 font-bold uppercase tracking-wider">
                    {auditLoading ? "Loading..." : `${auditTotal} events`}
                  </div>
                </div>

                {/* Log table */}
                <div className="space-y-1">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-3 px-3 py-2">
                    <div className="col-span-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</div>
                    <div className="col-span-3 text-xs font-bold text-gray-500 uppercase tracking-wider">IP Address</div>
                    <div className="col-span-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Device</div>
                    <div className="col-span-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Time</div>
                  </div>

                  {auditPageLogs.map((log) => (
                    <div key={log.id} className="grid grid-cols-12 gap-3 px-3 py-3 bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
                      <div className="col-span-3 flex items-center">
                        <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${actionColor(log.action)}`}>
                          {actionLabel(log.action)}
                        </span>
                      </div>
                      <div className="col-span-3 flex items-center">
                        <span className="text-xs text-gray-400 font-mono">{log.ip_address}</span>
                      </div>
                      <div className="col-span-3 flex items-center">
                        <span className="text-xs text-gray-500 truncate">{log.user_agent}</span>
                      </div>
                      <div className="col-span-3 flex items-center">
                        <span className="text-xs text-gray-500">{formatDate(log.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalAuditPages > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-500">
                      Page {auditPage + 1} of {totalAuditPages}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAuditPage(p => Math.max(0, p - 1))}
                        disabled={auditPage === 0}
                        className="px-3 py-1 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => setAuditPage(p => Math.min(totalAuditPages - 1, p + 1))}
                        disabled={auditPage === totalAuditPages - 1}
                        className="px-3 py-1 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Workspace Section */}
          {activeSection === "workspace" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Workspace</h2>
                <p className="text-gray-400 text-sm">Manage your workspace settings</p>
              </div>

              <div className="p-6 bg-white/[0.02] border border-white/10 space-y-6">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Default Workspace</label>
                  <select
                    value={workspace.defaultWorkspace}
                    onChange={(e) => setWorkspace({ ...workspace, defaultWorkspace: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option>My Workspace</option>
                    <option>Team Workspace</option>
                    <option>Client Projects</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Workspace Name</label>
                  <input
                    type="text"
                    value={workspace.workspaceName}
                    onChange={(e) => setWorkspace({ ...workspace, workspaceName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold uppercase tracking-wider transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Editor Section */}
          {activeSection === "editor" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Editor</h2>
                <p className="text-gray-400 text-sm">Customize your coding experience</p>
              </div>

              <div className="p-6 bg-white/[0.02] border border-white/10 space-y-6">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Theme</label>
                  <select
                    value={editor.theme}
                    onChange={(e) => setEditor({ ...editor, theme: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Font Size</label>
                    <input
                      type="number"
                      value={editor.fontSize}
                      onChange={(e) => setEditor({ ...editor, fontSize: parseInt(e.target.value) })}
                      min="10"
                      max="24"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Tab Size</label>
                    <input
                      type="number"
                      value={editor.tabSize}
                      onChange={(e) => setEditor({ ...editor, tabSize: parseInt(e.target.value) })}
                      min="2"
                      max="8"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Keybindings</label>
                  <select
                    value={editor.keybindings}
                    onChange={(e) => setEditor({ ...editor, keybindings: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="default">Default</option>
                    <option value="vim">Vim</option>
                    <option value="emacs">Emacs</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10">
                  <div>
                    <div className="text-sm font-bold text-white mb-1">Auto Save</div>
                    <div className="text-xs text-gray-500">Automatically save changes</div>
                  </div>
                  <button
                    onClick={() => setEditor({ ...editor, autoSave: !editor.autoSave })}
                    className={`relative w-14 h-7 border transition-all ${
                      editor.autoSave ? "bg-blue-500 border-blue-500" : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white transition-all ${editor.autoSave ? "left-8" : "left-1"}`} />
                  </button>
                </div>

                <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold uppercase tracking-wider transition-colors">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Billing Section */}
          {activeSection === "billing" && (
            <BillingSection />
          )}

          {/* Team Section */}
          {activeSection === "team" && (
            <TeamSection currentUserId={user?.id ?? ""} />
          )}

          {/* Integrations Section */}
          {activeSection === "integrations" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Integrations</h2>
                <p className="text-gray-400 text-sm">Connect external services to your workspace</p>
              </div>
              <div className="p-8 bg-white/[0.02] border border-white/10 text-center">
                <p className="text-gray-500 text-sm">Integrations coming soon.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
