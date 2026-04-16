"use client";

import Link from "next/link";
import WorkspaceSwitcher from "@/components/WorkspaceSwitcher";
import GlobalSearch from "@/components/GlobalSearch";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import UserMenu from "@/components/UserMenu";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/workspace" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="text-white font-bold text-sm">
              CODE<span className="text-blue-500">COLLAB</span>
            </span>
          </Link>

          {/* Workspace Switcher */}
          <WorkspaceSwitcher />
        </div>

        <div className="flex items-center gap-3">
          {/* Global Search */}
          <GlobalSearch />

          {/* Notifications */}
          <NotificationsDropdown />

          {/* User Menu */}
          <UserMenu />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  );
}
