"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import Sidebar from "@/components/Sidebar";
import FormInput from "@/components/FormInput";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex@codecollab.io",
    username: "alexj",
    bio: "Full-stack developer passionate about collaborative coding"
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    projectUpdates: true,
    collaboratorInvites: true,
    weeklyDigest: false,
    marketingEmails: false
  });

  const [saved, setSaved] = useState(false);

  const sidebarItems = [
    { label: "Profile", href: "#profile", active: activeSection === "profile" },
    { label: "Security", href: "#security", active: activeSection === "security" },
    { label: "Notifications", href: "#notifications", active: activeSection === "notifications" },
    { label: "Danger Zone", href: "#danger", active: activeSection === "danger" }
  ];

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.id]: e.target.value
    });
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecurityData({
      ...securityData,
      [e.target.id]: e.target.value
    });
  };

  const handleNotificationToggle = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications]
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-6xl font-black text-white mb-4 uppercase tracking-tight">
            SETTINGS
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex gap-12">
          {/* Sidebar */}
          <Sidebar items={sidebarItems} />

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Success Message */}
            {saved && (
              <div className="p-4 bg-green-500/10 border border-green-500/30">
                <p className="text-green-400 text-sm font-bold uppercase tracking-wider">
                  ✓ Settings saved successfully!
                </p>
              </div>
            )}

            {/* Profile Section */}
            <section id="profile" className="p-8 bg-white/[0.02] border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              
              <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
                PROFILE
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="FULL NAME"
                    id="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder="Your full name"
                  />
                  <FormInput
                    label="USERNAME"
                    id="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    placeholder="Your username"
                  />
                </div>

                <FormInput
                  label="EMAIL"
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  placeholder="your@email.com"
                />

                <div>
                  <label 
                    htmlFor="bio"
                    className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold"
                  >
                    BIO
                  </label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-wider transition-all relative overflow-hidden group"
                >
                  <span className="relative z-10">SAVE PROFILE</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </div>
            </section>


            {/* Security Section */}
            <section id="security" className="p-8 bg-white/[0.02] border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              
              <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
                SECURITY
              </h2>

              <div className="space-y-6">
                <FormInput
                  label="CURRENT PASSWORD"
                  id="currentPassword"
                  type="password"
                  value={securityData.currentPassword}
                  onChange={handleSecurityChange}
                  placeholder="Enter current password"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="NEW PASSWORD"
                    id="newPassword"
                    type="password"
                    value={securityData.newPassword}
                    onChange={handleSecurityChange}
                    placeholder="Enter new password"
                  />
                  <FormInput
                    label="CONFIRM PASSWORD"
                    id="confirmPassword"
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={handleSecurityChange}
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/30">
                  <p className="text-blue-400 text-xs uppercase tracking-wider">
                    Password must be at least 8 characters with uppercase, lowercase, and numbers
                  </p>
                </div>

                <button
                  onClick={handleSave}
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-wider transition-all relative overflow-hidden group"
                >
                  <span className="relative z-10">UPDATE PASSWORD</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </div>
            </section>

            {/* Notifications Section */}
            <section id="notifications" className="p-8 bg-white/[0.02] border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              
              <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
                NOTIFICATIONS
              </h2>

              <div className="space-y-6">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-white/5 border border-white/10">
                    <div>
                      <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                        {key === 'projectUpdates' && 'Get notified when projects are updated'}
                        {key === 'collaboratorInvites' && 'Receive invitations from other collaborators'}
                        {key === 'weeklyDigest' && 'Get a weekly summary of your activity'}
                        {key === 'marketingEmails' && 'Receive news and product updates'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle(key)}
                      className={`relative w-14 h-7 border transition-all ${
                        value 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-5 h-5 bg-white transition-all ${
                          value ? 'left-8' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}

                <button
                  onClick={handleSave}
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-wider transition-all relative overflow-hidden group"
                >
                  <span className="relative z-10">SAVE PREFERENCES</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </div>
            </section>

            {/* Danger Zone Section */}
            <section id="danger" className="p-8 bg-red-500/5 border border-red-500/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              
              <h2 className="text-2xl font-black text-red-400 mb-6 uppercase tracking-tight">
                DANGER ZONE
              </h2>

              <div className="space-y-6">
                <div className="p-6 bg-white/[0.02] border border-red-500/30">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">
                    DELETE ACCOUNT
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    className="px-6 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/50 hover:border-red-500 text-red-400 hover:text-white font-bold text-sm uppercase tracking-wider transition-all"
                  >
                    DELETE ACCOUNT
                  </button>
                </div>

                <div className="p-6 bg-white/[0.02] border border-red-500/30">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">
                    EXPORT DATA
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Download a copy of all your data including projects, settings, and activity.
                  </p>
                  <button
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm uppercase tracking-wider transition-all"
                  >
                    EXPORT DATA
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
