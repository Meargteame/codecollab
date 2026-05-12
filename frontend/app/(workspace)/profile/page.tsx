"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProjectCreationModal from "@/components/ProjectCreationModal";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const lastUpdated = new Date(user.updated_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const memberDays = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));

  const stats = [
    { label: "Projects", value: "12", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" },
    { label: "Collaborations", value: "8", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { label: "Days Active", value: String(memberDays), icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "Storage Used", value: "4.2 GB", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" },
  ];

  const quickActions = [
    { label: "Edit Profile", href: "/settings?section=profile", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
    { label: "Security", href: "/settings?section=security", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { label: "Billing", href: "/settings?section=billing", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  ];

  const accountDetails = [
    { label: "Email", value: user.email, mono: false },
    { label: "Full Name", value: user.full_name ?? "—", mono: false },
    { label: "Account Status", value: user.status, mono: false, badge: true },
    { label: "Member Since", value: joinedDate, mono: false },
    { label: "Last Updated", value: lastUpdated, mono: false },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-black">
      <div className="max-w-6xl mx-auto p-8 space-y-6">

        {/* Profile Hero */}
        <div className="bg-white/[0.02] border border-white/10 overflow-hidden">
          {/* Cover banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600/30 via-blue-500/20 to-purple-600/20 relative">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.05)_50%,transparent_75%)]" />
          </div>

          <div className="px-8 pb-8">
            {/* Avatar — overlaps the banner */}
            <div className="flex items-end justify-between -mt-12 mb-6">
              <div className="relative">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name ?? user.email} className="w-24 h-24 object-cover border-4 border-black" />
                ) : (
                  <div className="w-24 h-24 bg-blue-500 flex items-center justify-center text-white text-3xl font-black border-4 border-black">
                    {initials}
                  </div>
                )}
                <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-black ${user.status === "active" ? "bg-green-500" : "bg-gray-500"}`} />
              </div>
              <Link href="/settings?section=profile" className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold uppercase tracking-wider transition-colors">
                Edit Profile
              </Link>
            </div>

            {/* Name & meta */}
            <div className="mb-4">
              <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-1">
                {user.full_name ?? user.email.split("@")[0]}
              </h1>
              <p className="text-gray-400 text-sm mb-3">{user.email}</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                  {user.status}
                </span>
                <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider border border-white/10">
                  Free Plan
                </span>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Joined {joinedDate}
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {memberDays} days as member
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Updated {lastUpdated}
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="p-5 bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Account Details */}
          <div className="lg:col-span-2 bg-white/[0.02] border border-white/10">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Account Details</h2>
              <Link href="/settings?section=profile" className="text-xs text-blue-500 hover:text-blue-400 transition-colors font-bold uppercase tracking-wider">
                Edit
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {accountDetails.map((item) => (
                <div key={item.label} className="px-6 py-3.5 flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex-shrink-0 w-32">{item.label}</span>
                  {item.badge ? (
                    <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
                      item.verified === true ? "bg-green-500/10 text-green-400" :
                      item.verified === false ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-white/5 text-gray-400"
                    }`}>
                      {item.value}
                    </span>
                  ) : (
                    <span className={`text-sm text-white text-right truncate ${item.mono ? "font-mono text-xs text-gray-400" : ""}`}>
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/[0.02] border border-white/10">
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="text-sm font-black text-white uppercase tracking-wider">Quick Actions</h2>
              </div>
              <div className="p-3 space-y-1">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                    </svg>
                    {action.label}
                  </Link>
                ))}
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Project
                </button>
              </div>
            </div>

            {/* Plan & Storage */}
            <div className="bg-white/[0.02] border border-white/10">
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="text-sm font-black text-white uppercase tracking-wider">Plan & Storage</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Plan</span>
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">Free</span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Storage</span>
                    <span className="text-xs text-gray-400">4.2 GB / 10 GB</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10">
                    <div className="h-full w-[42%] bg-blue-500" />
                  </div>
                </div>
                <Link href="/settings?section=billing" className="block w-full py-2 text-center bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider transition-colors">
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity placeholder */}
        <div className="bg-white/[0.02] border border-white/10">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">Recent Activity</h2>
            <Link href="/settings?section=security" className="text-xs text-blue-500 hover:text-blue-400 transition-colors font-bold uppercase tracking-wider">
              View All
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { action: "Signed in", time: "Just now", icon: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1", color: "text-green-400" },
              { action: "Profile updated", time: lastUpdated, icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", color: "text-blue-400" },
              { action: "Account created", time: joinedDate, icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z", color: "text-purple-400" },
            ].map((item, i) => (
              <div key={i} className="px-6 py-3.5 flex items-center gap-4">
                <div className="w-7 h-7 bg-white/5 flex items-center justify-center flex-shrink-0">
                  <svg className={`w-3.5 h-3.5 ${item.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{item.action}</p>
                </div>
                <span className="text-xs text-gray-600">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <ProjectCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={(name, template) => console.log("Creating project:", name, template)}
      />
    </div>
  );
}
