"use client";

import { useState } from "react";

type Section = "profile" | "account" | "workspace" | "editor" | "billing" | "team" | "integrations";

export default function WorkspaceSettings() {
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [saved, setSaved] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex@codecollab.io",
    bio: "Full-stack developer passionate about collaborative coding",
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

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sections = [
    { id: "profile" as Section, name: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "account" as Section, name: "Account", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    { id: "workspace" as Section, name: "Workspace", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" },
    { id: "editor" as Section, name: "Editor", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
    { id: "billing" as Section, name: "Billing", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { id: "team" as Section, name: "Team", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { id: "integrations" as Section, name: "Integrations", icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" },
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
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
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
            </button>
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
                    <div className="w-20 h-20 bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                      {profile.name.charAt(0)}
                    </div>
                    <button className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold uppercase tracking-wider transition-colors">
                      Upload New
                    </button>
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

                <button onClick={handleSave} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold uppercase tracking-wider transition-colors">
                  Save Changes
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

                <button onClick={handleSave} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold uppercase tracking-wider transition-colors">
                  Update Password
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
                
                <button className="px-6 py-2 bg-red-500/10 border border-red-500/50 hover:bg-red-500 hover:border-red-500 text-red-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors">
                  Delete Account
                </button>
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

                <button onClick={handleSave} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold uppercase tracking-wider transition-colors">
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

                <button onClick={handleSave} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold uppercase tracking-wider transition-colors">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Billing Section */}
          {activeSection === "billing" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Billing</h2>
                <p className="text-gray-400 text-sm">Manage your subscription and payment methods</p>
              </div>

              <div className="p-6 bg-white/[0.02] border border-white/10 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4">Current Plan</h3>
                  <div className="p-6 bg-blue-500/10 border border-blue-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-black text-white mb-1">PRO PLAN</div>
                        <div className="text-sm text-gray-400">$29/month • Renews on May 15, 2024</div>
                      </div>
                      <button className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold uppercase tracking-wider transition-colors">
                        Change Plan
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500 mb-1">Projects</div>
                        <div className="text-white font-bold">Unlimited</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Storage</div>
                        <div className="text-white font-bold">100 GB</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Collaborators</div>
                        <div className="text-white font-bold">Unlimited</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4">Payment Method</h3>
                  <div className="p-4 bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                        VISA
                      </div>
                      <div>
                        <div className="text-sm text-white font-bold">•••• •••• •••• 4242</div>
                        <div className="text-xs text-gray-500">Expires 12/2025</div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold uppercase tracking-wider transition-colors">
                      Update
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4">Billing History</h3>
                  <div className="space-y-2">
                    {[
                      { date: "Apr 15, 2024", amount: "$29.00", status: "Paid" },
                      { date: "Mar 15, 2024", amount: "$29.00", status: "Paid" },
                      { date: "Feb 15, 2024", amount: "$29.00", status: "Paid" },
                    ].map((invoice, i) => (
                      <div key={i} className="p-4 bg-white/5 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-white">{invoice.date}</div>
                          <div className="text-sm font-bold text-white">{invoice.amount}</div>
                          <div className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-wider">
                            {invoice.status}
                          </div>
                        </div>
                        <button className="text-blue-500 hover:text-blue-400 text-sm font-bold uppercase tracking-wider transition-colors">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Section */}
          {activeSection === "team" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Team</h2>
                <p className="text-gray-400 text-sm">Manage your team members and permissions</p>
              </div>

              <div className="p-6 bg-white/[0.02] border border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Team Members (3)</h3>
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold uppercase tracking-wider transition-colors">
                    Invite Member
                  </button>
                </div>

                <div className="space-y-2">
                  {[
                    { name: "Alex Johnson", email: "alex@codecollab.io", role: "Owner", avatar: "A" },
                    { name: "Sarah Chen", email: "sarah@codecollab.io", role: "Admin", avatar: "S" },
                    { name: "Mike Davis", email: "mike@codecollab.io", role: "Member", avatar: "M" },
                  ].map((member, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                          {member.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{member.name}</div>
                          <div className="text-xs text-gray-500">{member.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={member.role}
                          disabled={member.role === "Owner"}
                          className="px-3 py-1 bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500 disabled:opacity-50"
                        >
                          <option>Owner</option>
                          <option>Admin</option>
                          <option>Member</option>
                        </select>
                        {member.role !== "Owner" && (
                          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
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
            </div>
          )}

          {/* Integrations Section */}
          {activeSection === "integrations" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Integrations</h2>
                <p className="text-gray-400 text-sm">Connect external services to your workspace</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "GitHub", icon: "🐙", connected: true, description: "Sync repositories and commits" },
                  { name: "GitLab", icon: "🦊", connected: false, description: "Import projects from GitLab" },
                  { name: "Slack", icon: "💬", connected: true, description: "Get notifications in Slack" },
                  { name: "Discord", icon: "🎮", connected: false, description: "Connect with Discord server" },
                ].map((integration, i) => (
                  <div key={i} className="p-6 bg-white/[0.02] border border-white/10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{integration.icon}</div>
                      <div>
                        <div className="text-lg font-bold text-white">{integration.name}</div>
                        <div className="text-xs text-gray-500">{integration.description}</div>
                      </div>
                    </div>
                    <button
                      className={`w-full px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                        integration.connected
                          ? "bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500/20"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {integration.connected ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
