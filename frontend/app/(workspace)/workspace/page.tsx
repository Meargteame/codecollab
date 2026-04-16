"use client";

import Link from "next/link";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProjectCreationModal from "@/components/ProjectCreationModal";
import ProjectShareModal from "@/components/ProjectShareModal";

export default function Workspace() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"lastModified" | "name" | "createdDate">("lastModified");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [shareProjectId, setShareProjectId] = useState<string | null>(null);

  const allProjects = [
    { id: "1", name: "E-commerce Platform", language: "TypeScript", lastModified: "2 hours ago", collaborators: 3, status: "active", createdDate: "2024-01-15" },
    { id: "2", name: "Mobile App Backend", language: "Python", lastModified: "5 hours ago", collaborators: 2, status: "active", createdDate: "2024-01-20" },
    { id: "3", name: "Data Analytics Dashboard", language: "JavaScript", lastModified: "1 day ago", collaborators: 5, status: "active", createdDate: "2024-01-10" },
    { id: "4", name: "ML Model Training", language: "Python", lastModified: "2 days ago", collaborators: 1, status: "idle", createdDate: "2024-01-05" },
    { id: "5", name: "API Gateway Service", language: "Go", lastModified: "3 days ago", collaborators: 4, status: "idle", createdDate: "2024-01-25" },
    { id: "6", name: "Documentation Site", language: "Markdown", lastModified: "1 week ago", collaborators: 2, status: "idle", createdDate: "2024-01-01" },
  ];

  // Filter projects by search query
  const filteredProjects = allProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort projects
  const projects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "createdDate") {
      return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    }
    // Default: lastModified (simplified comparison)
    return 0;
  });

  const handleCreateProject = (name: string, template: string) => {
    // TODO: API call to create project
    console.log("Creating project:", name, template);
  };

  const templates = [
    { name: "React + TypeScript", icon: "⚛️", description: "Modern React app with TypeScript" },
    { name: "Node.js API", icon: "🟢", description: "Express.js REST API starter" },
    { name: "Python Flask", icon: "🐍", description: "Flask web application" },
    { name: "Next.js App", icon: "▲", description: "Full-stack Next.js project" },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onNewProject={() => setIsCreateModalOpen(true)} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Your Projects</h1>
                <p className="text-gray-400 text-sm">Manage and collaborate on your coding projects</p>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center border border-white/10">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-2 ${view === "grid" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"} transition-colors`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`p-2 ${view === "list" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"} transition-colors`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                {/* Sort */}
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="lastModified">Last Modified</option>
                  <option value="name">Name</option>
                  <option value="createdDate">Created Date</option>
                </select>
              </div>
            </div>

            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Quick Start Templates */}
            <div className="mb-8">
              <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Quick Start</h2>
              <div className="grid grid-cols-4 gap-4">
                {templates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setIsCreateModalOpen(true)}
                    className="p-4 bg-white/[0.02] border border-white/10 hover:border-blue-500/50 transition-all text-left group"
                  >
                    <div className="text-2xl mb-2">{template.icon}</div>
                    <div className="text-sm font-bold text-white mb-1">{template.name}</div>
                    <div className="text-xs text-gray-500">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div>
              <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">
                All Projects ({projects.length})
                {searchQuery && ` - Filtered`}
              </h2>
              {projects.length === 0 ? (
                <div className="p-12 text-center bg-white/[0.02] border border-white/10">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <p className="text-gray-500 mb-4">No projects found</p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-blue-500 hover:text-blue-400 text-sm"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <div className={view === "grid" ? "grid grid-cols-3 gap-4" : "space-y-2"}>
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className={`${
                        view === "grid"
                          ? "p-6 bg-white/[0.02] border border-white/10 hover:border-blue-500/50 transition-all group"
                          : "p-4 bg-white/[0.02] border border-white/10 hover:border-blue-500/50 transition-all flex items-center justify-between"
                      }`}
                    >
                      {view === "grid" ? (
                        <>
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 bg-blue-500/10 flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                              </svg>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`px-2 py-1 text-xs font-bold uppercase tracking-wider ${
                                project.status === "active" ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"
                              }`}>
                                {project.status}
                              </div>
                              <button
                                onClick={() => setShareProjectId(project.id)}
                                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <Link href={`/editor/${project.id}`}>
                            <h3 className="text-white font-bold mb-2 hover:text-blue-500 transition-colors">{project.name}</h3>
                          </Link>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                            <span>{project.language}</span>
                            <span>•</span>
                            <span>{project.lastModified}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {[...Array(project.collaborators)].map((_, i) => (
                                <div key={i} className="w-6 h-6 bg-blue-500 border-2 border-black flex items-center justify-center text-white text-xs font-bold">
                                  {String.fromCharCode(65 + i)}
                                </div>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">{project.collaborators} collaborators</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-500/10 flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <Link href={`/editor/${project.id}`}>
                                <h3 className="text-white font-bold mb-1 hover:text-blue-500 transition-colors">{project.name}</h3>
                              </Link>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>{project.language}</span>
                                <span>•</span>
                                <span>{project.lastModified}</span>
                                <span>•</span>
                                <span>{project.collaborators} collaborators</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                              project.status === "active" ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"
                            }`}>
                              {project.status}
                            </div>
                            <button
                              onClick={() => setShareProjectId(project.id)}
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <ProjectCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
      <ProjectShareModal
        isOpen={shareProjectId !== null}
        onClose={() => setShareProjectId(null)}
        projectId={shareProjectId || ""}
      />
    </div>
  );
}
