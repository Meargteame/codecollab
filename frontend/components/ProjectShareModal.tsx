"use client";

import { useState } from "react";

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "owner" | "editor" | "viewer";
}

interface ProjectShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export default function ProjectShareModal({ isOpen, onClose, projectId }: ProjectShareModalProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [linkCopied, setLinkCopied] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: "1", name: "Alex Johnson", email: "alex@codecollab.io", avatar: "A", role: "owner" },
    { id: "2", name: "Sarah Chen", email: "sarah@codecollab.io", avatar: "S", role: "editor" },
    { id: "3", name: "Mike Davis", email: "mike@codecollab.io", avatar: "M", role: "viewer" },
  ]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Check if already invited
    if (collaborators.some(c => c.email === email)) {
      setEmailError("This user is already a collaborator");
      return;
    }

    // TODO: Send invitation API call
    console.log("Inviting:", email);
    setEmail("");
    setEmailError("");
    
    // Show success message
    alert(`Invitation sent to ${email}`);
  };

  const handleRoleChange = (userId: string, newRole: "owner" | "editor" | "viewer") => {
    setCollaborators(collaborators.map(c => 
      c.id === userId ? { ...c, role: newRole } : c
    ));
    // TODO: API call to update role
  };

  const handleRemove = (userId: string) => {
    const collab = collaborators.find(c => c.id === userId);
    if (collab && window.confirm(`Remove ${collab.name} from this project?`)) {
      setCollaborators(collaborators.filter(c => c.id !== userId));
      // TODO: API call to remove collaborator
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://codecollab.io/project/${projectId}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleVisibilityChange = (newVisibility: "private" | "public") => {
    if (newVisibility === "public") {
      const confirmed = window.confirm(
        "Making this project public will allow anyone with the link to view it. Are you sure?"
      );
      if (!confirmed) return;
    }
    setVisibility(newVisibility);
    // TODO: API call to update visibility
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-black border border-white/10 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Share Project</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Invite by Email */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">
              Invite by Email
            </label>
            <form onSubmit={handleInvite} className="flex gap-2">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="colleague@example.com"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                {emailError && (
                  <p className="mt-1 text-xs text-red-400">{emailError}</p>
                )}
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold uppercase tracking-wider transition-colors"
              >
                Invite
              </button>
            </form>
          </div>

          {/* Visibility Toggle */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">
              Project Visibility
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleVisibilityChange("private")}
                className={`flex-1 px-4 py-3 border transition-all ${
                  visibility === "private"
                    ? "bg-blue-500/10 border-blue-500 text-white"
                    : "bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm font-bold">Private</span>
                </div>
                <p className="text-xs text-gray-500">Only invited collaborators can access</p>
              </button>
              <button
                onClick={() => handleVisibilityChange("public")}
                className={`flex-1 px-4 py-3 border transition-all ${
                  visibility === "public"
                    ? "bg-blue-500/10 border-blue-500 text-white"
                    : "bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-bold">Public</span>
                </div>
                <p className="text-xs text-gray-500">Anyone with the link can view</p>
              </button>
            </div>
          </div>

          {/* Share Link */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={`https://codecollab.io/project/${projectId}`}
                readOnly
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-gray-400 text-sm focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-5 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold uppercase tracking-wider transition-colors"
              >
                {linkCopied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Collaborators List */}
          <div>
            <label className="block text-xs text-gray-400 mb-3 uppercase tracking-wider font-bold">
              Collaborators ({collaborators.length})
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      {collaborator.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{collaborator.name}</div>
                      <div className="text-xs text-gray-500">{collaborator.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={collaborator.role}
                      onChange={(e) => handleRoleChange(collaborator.id, e.target.value as any)}
                      disabled={collaborator.role === "owner"}
                      className="px-3 py-1 bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="owner">Owner</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    {collaborator.role !== "owner" && (
                      <button
                        onClick={() => handleRemove(collaborator.id)}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Descriptions */}
          <div className="p-4 bg-white/[0.02] border border-white/10">
            <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Role Permissions</div>
            <div className="space-y-1 text-xs text-gray-500">
              <div><span className="text-white">Owner:</span> Full access, can delete project</div>
              <div><span className="text-white">Editor:</span> Can edit files and invite others</div>
              <div><span className="text-white">Viewer:</span> Read-only access</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex items-center justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold uppercase tracking-wider transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
