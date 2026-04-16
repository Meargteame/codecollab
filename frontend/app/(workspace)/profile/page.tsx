"use client";

import Link from "next/link";

export default function ProfilePage() {
  const user = {
    name: "Alex Johnson",
    username: "alexj",
    email: "alex@codecollab.io",
    avatar: "A",
    bio: "Full-stack developer passionate about collaborative coding and open source. Building the future of development tools.",
    joinedDate: "January 2024",
    location: "San Francisco, CA",
    website: "https://alexjohnson.dev",
  };

  const stats = [
    { label: "Projects", value: "24" },
    { label: "Collaborations", value: "156" },
    { label: "Contributions", value: "1,234" },
    { label: "Followers", value: "89" },
  ];

  const recentProjects = [
    { name: "E-commerce Platform", language: "TypeScript", updated: "2 hours ago" },
    { name: "Mobile App Backend", language: "Python", updated: "5 hours ago" },
    { name: "Data Analytics Dashboard", language: "JavaScript", updated: "1 day ago" },
  ];

  const activity = [
    { type: "created", project: "E-commerce Platform", time: "2 hours ago" },
    { type: "collaborated", project: "Mobile App Backend", time: "5 hours ago" },
    { type: "committed", project: "Data Analytics Dashboard", time: "1 day ago" },
    { type: "starred", project: "ML Model Training", time: "2 days ago" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-black">
      <div className="max-w-6xl mx-auto p-8">
        {/* Profile Header */}
        <div className="p-8 bg-white/[0.02] border border-white/10 mb-8">
          <div className="flex items-start gap-8">
            <div className="w-32 h-32 bg-blue-500 flex items-center justify-center text-white text-5xl font-bold flex-shrink-0">
              {user.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">{user.name}</h1>
                  <p className="text-gray-400 text-sm mb-2">@{user.username}</p>
                  <p className="text-gray-300 text-sm max-w-2xl">{user.bio}</p>
                </div>
                <Link
                  href="/settings"
                  className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold uppercase tracking-wider transition-colors"
                >
                  Edit Profile
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {user.location}
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors">
                    {user.website}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Joined {user.joinedDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 bg-white/[0.02] border border-white/10 text-center">
              <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div>
            <h2 className="text-xl font-black text-white mb-4 uppercase tracking-tight">Recent Projects</h2>
            <div className="space-y-2">
              {recentProjects.map((project, i) => (
                <div key={i} className="p-4 bg-white/[0.02] border border-white/10 hover:border-blue-500/50 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span className="text-white font-bold text-sm">{project.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{project.language}</span>
                    <span>•</span>
                    <span>Updated {project.updated}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <h2 className="text-xl font-black text-white mb-4 uppercase tracking-tight">Recent Activity</h2>
            <div className="space-y-2">
              {activity.map((item, i) => (
                <div key={i} className="p-4 bg-white/[0.02] border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      {item.type === "created" && (
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                      {item.type === "collaborated" && (
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      )}
                      {item.type === "committed" && (
                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      {item.type === "starred" && (
                        <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white mb-1">
                        <span className="capitalize">{item.type}</span> <span className="text-blue-500">{item.project}</span>
                      </p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
