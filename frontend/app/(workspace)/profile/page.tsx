"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { users, ApiError } from "@/lib/api";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleResend = async () => {
    setResendStatus("sending");
    try {
      await users.resendVerification();
      setResendStatus("sent");
    } catch {
      setResendStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">Unable to load profile.</p>
          <a href="/signin" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold uppercase tracking-wider transition-colors">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const initials = (user.full_name ?? user.email)
    .split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="flex-1 overflow-y-auto bg-black">
      <div className="max-w-6xl mx-auto p-8">

        {/* Email verification banner */}
        {!user.email_verified && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Email not verified</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  Verify <span className="text-white">{user.email}</span> to unlock all features.
                </p>
              </div>
            </div>
            <button
              onClick={handleResend}
              disabled={resendStatus === "sending" || resendStatus === "sent"}
              className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/40 hover:bg-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-yellow-400 text-xs font-bold uppercase tracking-wider transition-colors flex-shrink-0"
            >
              {resendStatus === "sending" && "Sending..."}
              {resendStatus === "sent" && "✓ Email Sent"}
              {resendStatus === "error" && "Retry"}
              {resendStatus === "idle" && "Resend Verification"}
            </button>
          </div>
        )}

        {/* Profile Header */}
        <div className="p-8 bg-white/[0.02] border border-white/10 mb-8">
          <div className="flex items-start gap-8">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name ?? user.email}
                className="w-32 h-32 object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-32 h-32 bg-blue-500 flex items-center justify-center text-white text-5xl font-bold flex-shrink-0">
                {initials}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">
                    {user.full_name ?? user.email}
                  </h1>
                  <p className="text-gray-400 text-sm mb-2">{user.email}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${user.email_verified ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                      {user.email_verified ? "Verified" : "Unverified"}
                    </span>
                    <span className="px-2 py-0.5 bg-white/5 text-xs font-bold uppercase tracking-wider text-gray-400">
                      {user.status}
                    </span>
                  </div>
                </div>
                <Link href="/settings" className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold uppercase tracking-wider transition-colors">
                  Edit Profile
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Joined {joinedDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
