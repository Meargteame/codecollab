"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNewProject?: () => void;
}

export default function Sidebar({ collapsed = false, onToggleCollapse, onNewProject }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>(["projects"]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isActive = (path: string) => pathname === path;

  if (collapsed) {
    return (
      <aside className="w-16 border-r border-white/10 flex flex-col bg-white/[0.02] transition-all duration-300">
        <div className="flex flex-col items-center py-4 gap-4">
          <button 
            onClick={onNewProject}
            className="w-10 h-10 bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors"
            title="New Project"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 border-r border-white/10 flex flex-col bg-white/[0.02] transition-all duration-300">
      {/* New Project Button */}
      <div className="p-4 border-b border-white/10">
        <button
          onClick={onNewProject}
          className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="relative z-10">New Project</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {/* Projects Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection("projects")}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-400 transition-colors"
          >
            <span>Projects</span>
            <svg 
              className={`w-3 h-3 transition-transform ${expandedSections.includes("projects") ? "rotate-90" : ""}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {expandedSections.includes("projects") && (
            <div className="space-y-1 mt-1">
              <Link 
                href="/workspace" 
                className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                  isActive("/workspace")
                    ? "text-white bg-blue-500/10 border-l-2 border-blue-500"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                All Projects
              </Link>
              <Link 
                href="/workspace/recent" 
                className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                  isActive("/workspace/recent")
                    ? "text-white bg-blue-500/10 border-l-2 border-blue-500"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent
              </Link>
              <Link 
                href="/workspace/shared" 
                className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                  isActive("/workspace/shared")
                    ? "text-white bg-blue-500/10 border-l-2 border-blue-500"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Shared with me
              </Link>
              <Link 
                href="/workspace/starred" 
                className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                  isActive("/workspace/starred")
                    ? "text-white bg-blue-500/10 border-l-2 border-blue-500"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Starred
              </Link>
            </div>
          )}
        </div>

        {/* Teams Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection("teams")}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-400 transition-colors"
          >
            <span>Teams</span>
            <svg 
              className={`w-3 h-3 transition-transform ${expandedSections.includes("teams") ? "rotate-90" : ""}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {expandedSections.includes("teams") && (
            <div className="space-y-1 mt-1">
              <Link 
                href="/workspace/team/frontend" 
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <div className="w-5 h-5 bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  F
                </div>
                Frontend Team
              </Link>
              <Link 
                href="/workspace/team/backend" 
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <div className="w-5 h-5 bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                  B
                </div>
                Backend Team
              </Link>
            </div>
          )}
        </div>

        {/* Workspace Section */}
        <div className="mb-4 pt-4 border-t border-white/10">
          <div className="px-3 mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Workspace</span>
          </div>
          <div className="space-y-1">
            <Link 
              href="/profile" 
              className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                isActive("/profile")
                  ? "text-white bg-blue-500/10 border-l-2 border-blue-500"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Your Profile
            </Link>
            <Link 
              href="/settings" 
              className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                isActive("/settings")
                  ? "text-white bg-blue-500/10 border-l-2 border-blue-500"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
          </div>
        </div>
      </nav>

      {/* Storage Widget */}
      <div className="p-4 border-t border-white/10">
        <div className="p-3 bg-blue-500/10 border border-blue-500/30">
          <div className="text-xs font-bold text-white mb-1 uppercase tracking-wider">Storage</div>
          <div className="text-xs text-gray-400 mb-2">4.2 GB of 10 GB used</div>
          <div className="w-full h-1.5 bg-white/10">
            <div className="h-full w-[42%] bg-blue-500" />
          </div>
        </div>
      </div>
    </aside>
  );
}
