import PageLayout from "@/components/PageLayout";
import DashboardProjectCard from "@/components/DashboardProjectCard";

export default function Dashboard() {
  // Mock project data
  const projects = [
    { 
      id: 1, 
      name: "E-Commerce Platform", 
      lastModified: "2 hours ago", 
      collaborators: 3,
      language: "TypeScript",
      status: "active" as const
    },
    { 
      id: 2, 
      name: "Mobile App Backend", 
      lastModified: "1 day ago", 
      collaborators: 5,
      language: "Node.js",
      status: "active" as const
    },
    { 
      id: 3, 
      name: "Analytics Dashboard", 
      lastModified: "3 days ago", 
      collaborators: 2,
      language: "React",
      status: "active" as const
    },
    { 
      id: 4, 
      name: "API Gateway Service", 
      lastModified: "1 week ago", 
      collaborators: 4,
      language: "Go",
      status: "active" as const
    },
    { 
      id: 5, 
      name: "Machine Learning Pipeline", 
      lastModified: "2 weeks ago", 
      collaborators: 6,
      language: "Python",
      status: "active" as const
    },
    { 
      id: 6, 
      name: "Legacy Monolith", 
      lastModified: "3 months ago", 
      collaborators: 1,
      language: "Java",
      status: "archived" as const
    }
  ];

  const recentActivity = [
    { user: "Sarah Chen", action: "pushed to", project: "E-Commerce Platform", time: "5 min ago" },
    { user: "Mike Johnson", action: "commented on", project: "Mobile App Backend", time: "1 hour ago" },
    { user: "Alex Rivera", action: "created", project: "Analytics Dashboard", time: "3 hours ago" }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tight">
              YOUR WORKSPACE
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your projects and collaborations
            </p>
          </div>
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-wider transition-all relative overflow-hidden group w-full md:w-auto">
            <span className="relative z-10">+ NEW PROJECT</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white/[0.02] border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                Total Projects
              </span>
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div className="text-3xl font-black text-white">{projects.length}</div>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                Active Projects
              </span>
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-black text-white">
              {projects.filter(p => p.status === "active").length}
            </div>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                Team Members
              </span>
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="text-3xl font-black text-white">
              {projects.reduce((sum, p) => sum + p.collaborators, 0)}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
            YOUR PROJECTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <DashboardProjectCard key={project.id} {...project} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
            RECENT ACTIVITY
          </h2>
          <div className="bg-white/[0.02] border border-white/10 divide-y divide-white/10">
            {recentActivity.map((activity, index) => (
              <div key={index} className="p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-500 font-bold text-sm">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300">
                      <span className="text-white font-bold">{activity.user}</span>
                      {' '}{activity.action}{' '}
                      <span className="text-blue-500 font-bold">{activity.project}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
