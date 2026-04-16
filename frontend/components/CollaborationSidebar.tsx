"use client";

import { useState } from "react";

interface CollaboratorPresence {
  id: string;
  name: string;
  avatar: string;
  color: string;
  status: "active" | "idle" | "offline";
  currentFile: string | null;
  lastSeen: Date;
}

interface CollaborationSidebarProps {
  collaborators: CollaboratorPresence[];
  isConnected: boolean;
  onInvite: () => void;
}

export default function CollaborationSidebar({ 
  collaborators, 
  isConnected, 
  onInvite 
}: CollaborationSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (collapsed) {
    return (
      <div className="w-12 border-l border-white/10 bg-white/[0.02] flex flex-col items-center py-4 gap-4">
        <button
          onClick={() => setCollapsed(false)}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Expand"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex flex-col gap-2">
          {collaborators.slice(0, 3).map((collab) => (
            <div
              key={collab.id}
              className="w-8 h-8 flex items-center justify-center text-white text-xs font-bold relative"
              style={{ backgroundColor: collab.color }}
              title={collab.name}
            >
              {collab.avatar}
              <div className={`absolute bottom-0 right-0 w-2 h-2 ${getStatusColor(collab.status)} rounded-full border border-black`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-white/10 bg-white/[0.02] flex flex-col">
      {/* Header */}
      <div className="h-10 border-b border-white/10 flex items-center justify-between px-4 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Collaboration</span>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Collapse"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Collaborators List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Online ({collaborators.filter(c => c.status === "active").length})
            </span>
            <button
              onClick={onInvite}
              className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Invite
            </button>
          </div>

          <div className="space-y-2">
            {collaborators.map((collab) => (
              <div
                key={collab.id}
                className="p-3 bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-10 h-10 flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: collab.color }}
                    >
                      {collab.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(collab.status)} rounded-full border-2 border-black`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white mb-0.5">{collab.name}</div>
                    <div className="text-xs text-gray-500 mb-1">
                      {collab.status === "active" ? "Active" : collab.status === "idle" ? "Idle" : "Offline"}
                      {" • "}
                      {formatLastSeen(collab.lastSeen)}
                    </div>
                    {collab.currentFile && (
                      <div className="text-xs text-gray-400 truncate flex items-center gap-1">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="truncate">{collab.currentFile}</span>
                      </div>
                    )}
                  </div>
                  {collab.status === "active" && (
                    <button
                      className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Follow"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="p-4 border-t border-white/10 bg-yellow-500/10">
          <div className="flex items-center gap-2 text-yellow-500 text-xs">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Connecting to collaboration server...</span>
          </div>
        </div>
      )}
    </div>
  );
}
