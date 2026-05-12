"use client";

import { useState, useEffect } from "react";
import { teams, Team, TeamMember } from "@/lib/api";

const ROLES = ["admin", "member", "viewer"] as const;
type Role = typeof ROLES[number];

// ---------------------------------------------------------------------------
// Reusable confirm modal
// ---------------------------------------------------------------------------
function ConfirmModal({
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  loading,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-black border border-white/10 shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-base font-black text-white uppercase tracking-tight">{title}</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-400">{message}</p>
        </div>
        <div className="px-6 pb-6 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 text-white text-sm font-bold uppercase tracking-wider transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-bold uppercase tracking-wider transition-colors"
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function TeamSection({ currentUserId }: { currentUserId: string }) {
  const [teamList, setTeamList] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("member");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Confirm modal state
  const [deleteTeamTarget, setDeleteTeamTarget] = useState<Team | null>(null);
  const [removeMemberTarget, setRemoveMemberTarget] = useState<TeamMember | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const flash = (msg: string, isError = false) => {
    isError ? setError(msg) : setSuccess(msg);
    setTimeout(() => { setError(""); setSuccess(""); }, 3000);
  };

  const loadMembers = async (team: Team) => {
    setSelectedTeam(team);
    setMembersLoading(true);
    try { setMembers(await teams.listMembers(team.id)); }
    catch { flash("Failed to load members", true); }
    finally { setMembersLoading(false); }
  };

  useEffect(() => {
    teams.list().then(data => {
      setTeamList(data);
      if (data.length > 0) loadMembers(data[0]);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setCreating(true);
    try {
      const team = await teams.create(newTeamName.trim());
      setTeamList(prev => [team, ...prev]);
      setNewTeamName("");
      setShowCreateForm(false);
      flash("Team created");
      loadMembers(team);
    } catch { flash("Failed to create team", true); }
    finally { setCreating(false); }
  };

  const confirmDeleteTeam = async () => {
    if (!deleteTeamTarget) return;
    setConfirmLoading(true);
    try {
      await teams.delete(deleteTeamTarget.id);
      const next = teamList.filter(t => t.id !== deleteTeamTarget.id);
      setTeamList(next);
      if (selectedTeam?.id === deleteTeamTarget.id) {
        if (next.length > 0) loadMembers(next[0]);
        else { setSelectedTeam(null); setMembers([]); }
      }
      flash("Team deleted");
    } catch { flash("Failed to delete team", true); }
    finally { setConfirmLoading(false); setDeleteTeamTarget(null); }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !newEmail.trim()) return;
    setAdding(true);
    try {
      const member = await teams.addMember(selectedTeam.id, newEmail.trim(), newRole);
      setMembers(prev => [...prev, member]);
      setNewEmail("");
      flash("Member added");
    } catch (err: any) { flash(err.message ?? "Failed to add member", true); }
    finally { setAdding(false); }
  };

  const handleRoleChange = async (member: TeamMember, role: string) => {
    if (!selectedTeam) return;
    try {
      const updated = await teams.updateRole(selectedTeam.id, member.user_id, role);
      setMembers(prev => prev.map(m => m.id === member.id ? updated : m));
      flash("Role updated");
    } catch { flash("Failed to update role", true); }
  };

  const confirmRemoveMember = async () => {
    if (!selectedTeam || !removeMemberTarget) return;
    setConfirmLoading(true);
    try {
      await teams.removeMember(selectedTeam.id, removeMemberTarget.user_id);
      setMembers(prev => prev.filter(m => m.id !== removeMemberTarget.id));
      flash("Member removed");
    } catch { flash("Failed to remove member", true); }
    finally { setConfirmLoading(false); setRemoveMemberTarget(null); }
  };

  const roleColor = (role: string) => {
    if (role === "owner") return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
    if (role === "admin") return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    if (role === "member") return "bg-green-500/10 text-green-400 border border-green-500/20";
    return "bg-white/5 text-gray-400 border border-white/10";
  };

  return (
    <>
      {/* Delete team modal */}
      {deleteTeamTarget && (
        <ConfirmModal
          title="Delete Team"
          message={`Are you sure you want to delete "${deleteTeamTarget.name}"? This cannot be undone.`}
          confirmLabel="Delete Team"
          onConfirm={confirmDeleteTeam}
          onCancel={() => setDeleteTeamTarget(null)}
          loading={confirmLoading}
        />
      )}

      {/* Remove member modal */}
      {removeMemberTarget && (
        <ConfirmModal
          title="Remove Member"
          message={`Remove ${removeMemberTarget.full_name ?? removeMemberTarget.email ?? "this member"} from the team?`}
          confirmLabel="Remove"
          onConfirm={confirmRemoveMember}
          onCancel={() => setRemoveMemberTarget(null)}
          loading={confirmLoading}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-white mb-1 uppercase tracking-tight">Team</h2>
            <p className="text-gray-400 text-sm">Manage your teams and members</p>
          </div>
          <button
            onClick={() => setShowCreateForm(v => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Team
          </button>
        </div>

        {/* Banners */}
        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/30">
            <p className="text-green-400 text-sm font-bold uppercase tracking-wider">✓ {success}</p>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30">
            <p className="text-red-400 text-sm font-bold uppercase tracking-wider">✗ {error}</p>
          </div>
        )}

        {/* Create team form */}
        {showCreateForm && (
          <div className="p-5 bg-white/[0.02] border border-blue-500/30">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3">Create New Team</h3>
            <form onSubmit={handleCreateTeam} className="flex flex-wrap gap-3">
              <input
                type="text"
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                placeholder="Team name"
                autoFocus
                className="flex-1 min-w-48 px-4 py-2.5 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                disabled={creating || !newTeamName.trim()}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-bold uppercase tracking-wider transition-colors"
              >
                {creating ? "Creating..." : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 text-sm font-bold uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
          </div>
        ) : teamList.length === 0 ? (
          <div className="p-12 bg-white/[0.02] border border-white/10 text-center">
            <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-500 text-sm mb-4">No teams yet. Create one to get started.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold uppercase tracking-wider transition-colors"
            >
              Create Team
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Team list */}
            <div className="xl:col-span-1 bg-white/[0.02] border border-white/10 h-fit">
              <div className="px-4 py-3 border-b border-white/10">
                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Your Teams</span>
              </div>
              <div className="divide-y divide-white/5">
                {teamList.map(team => (
                  <button
                    key={team.id}
                    onClick={() => loadMembers(team)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors group ${
                      selectedTeam?.id === team.id
                        ? "bg-blue-500/10 border-l-2 border-blue-500"
                        : "hover:bg-white/5 border-l-2 border-transparent"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">{team.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {team.owner_id === currentUserId ? "Owner" : "Member"}
                      </p>
                    </div>
                    {team.owner_id === currentUserId && (
                      <span
                        role="button"
                        onClick={e => { e.stopPropagation(); setDeleteTeamTarget(team); }}
                        className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-gray-600 hover:text-red-400 transition-all flex-shrink-0 ml-2"
                        title="Delete team"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Members panel */}
            <div className="xl:col-span-3 bg-white/[0.02] border border-white/10">
              {!selectedTeam ? (
                <div className="flex items-center justify-center p-16 text-gray-500 text-sm">
                  Select a team to manage members
                </div>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-black text-white uppercase tracking-tight">{selectedTeam.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {members.length} member{members.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider flex-shrink-0 ${
                      selectedTeam.owner_id === currentUserId
                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        : "bg-white/5 text-gray-400 border border-white/10"
                    }`}>
                      {selectedTeam.owner_id === currentUserId ? "Owner" : "Member"}
                    </span>
                  </div>

                  {/* Add member */}
                  {selectedTeam.owner_id === currentUserId && (
                    <div className="px-6 py-4 border-b border-white/10 bg-white/[0.01]">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Add Member</p>
                      <form onSubmit={handleAddMember} className="flex flex-wrap gap-2">
                        <input
                          type="email"
                          value={newEmail}
                          onChange={e => setNewEmail(e.target.value)}
                          placeholder="member@example.com"
                          className="flex-1 min-w-0 px-3 py-2 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <select
                          value={newRole}
                          onChange={e => setNewRole(e.target.value as Role)}
                          className="px-3 py-2 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        >
                          {ROLES.map(r => (
                            <option key={r} value={r} className="bg-black">
                              {r.charAt(0).toUpperCase() + r.slice(1)}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          disabled={adding || !newEmail.trim()}
                          className="px-5 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-bold uppercase tracking-wider transition-colors"
                        >
                          {adding ? "Adding..." : "Add"}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Members list */}
                  {membersLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
                    </div>
                  ) : members.length === 0 ? (
                    <div className="py-10 text-center text-gray-500 text-sm">No members yet.</div>
                  ) : (
                    <>
                      <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-2 border-b border-white/5">
                        <span className="col-span-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Member</span>
                        <span className="col-span-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</span>
                        <span className="col-span-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</span>
                        <span className="col-span-1" />
                      </div>
                      <div className="divide-y divide-white/5">
                        {members.map(member => {
                          const isOwner = member.role === "owner";
                          const canManage = selectedTeam.owner_id === currentUserId && !isOwner;
                          const initials = (member.full_name ?? member.email ?? "?")
                            .split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
                          return (
                            <div key={member.id} className="flex flex-wrap sm:grid sm:grid-cols-12 gap-3 sm:gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors">
                              <div className="col-span-5 flex items-center gap-3 min-w-0 w-full sm:w-auto">
                                {member.avatar_url ? (
                                  <img src={member.avatar_url} alt="" className="w-8 h-8 object-cover flex-shrink-0" />
                                ) : (
                                  <div className="w-8 h-8 bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {initials}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-white truncate">{member.full_name ?? "—"}</p>
                                  <p className="text-xs text-gray-500 truncate">{member.email}</p>
                                </div>
                              </div>

                              <div className="col-span-3">
                                {canManage ? (
                                  <select
                                    value={member.role}
                                    onChange={e => handleRoleChange(member, e.target.value)}
                                    className="w-full px-2 py-1.5 bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                                  >
                                    {ROLES.map(r => (
                                      <option key={r} value={r} className="bg-black">
                                        {r.charAt(0).toUpperCase() + r.slice(1)}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${roleColor(member.role)}`}>
                                    {member.role}
                                  </span>
                                )}
                              </div>

                              <div className="col-span-3">
                                <span className="text-xs text-gray-500">
                                  {new Date(member.joined_at).toLocaleDateString("en-US", {
                                    month: "short", day: "numeric", year: "numeric",
                                  })}
                                </span>
                              </div>

                              <div className="col-span-1 flex justify-end">
                                {canManage && (
                                  <button
                                    onClick={() => setRemoveMemberTarget(member)}
                                    className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors"
                                    title="Remove member"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
