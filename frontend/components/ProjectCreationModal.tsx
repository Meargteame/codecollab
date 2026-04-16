"use client";

import { useState } from "react";

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (name: string, template: string) => void;
}

export default function ProjectCreationModal({ isOpen, onClose, onCreateProject }: ProjectCreationModalProps) {
  const [projectName, setProjectName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [error, setError] = useState("");

  const templates = [
    { id: "react-ts", name: "React + TypeScript", icon: "⚛️", description: "Modern React app with TypeScript" },
    { id: "node-api", name: "Node.js API", icon: "🟢", description: "Express.js REST API starter" },
    { id: "python-flask", name: "Python Flask", icon: "🐍", description: "Flask web application" },
    { id: "nextjs", name: "Next.js App", icon: "▲", description: "Full-stack Next.js project" },
    { id: "blank", name: "Blank Project", icon: "📄", description: "Start from scratch" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (projectName.length < 3) {
      setError("Project name must be at least 3 characters");
      return;
    }
    
    if (projectName.length > 50) {
      setError("Project name must be less than 50 characters");
      return;
    }

    if (!selectedTemplate) {
      setError("Please select a template");
      return;
    }

    onCreateProject(projectName, selectedTemplate);
    setProjectName("");
    setSelectedTemplate("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-black border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Create New Project</h2>
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
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  setError("");
                }}
                placeholder="My Awesome Project"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              {error && error.includes("name") && (
                <p className="mt-2 text-xs text-red-400">{error}</p>
              )}
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-xs text-gray-400 mb-3 uppercase tracking-wider font-bold">
                Choose Template
              </label>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setError("");
                    }}
                    className={`p-4 text-left transition-all ${
                      selectedTemplate === template.id
                        ? 'bg-blue-500/10 border-2 border-blue-500'
                        : 'bg-white/[0.02] border border-white/10 hover:border-blue-500/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{template.icon}</div>
                    <div className="text-sm font-bold text-white mb-1">{template.name}</div>
                    <div className="text-xs text-gray-500">{template.description}</div>
                  </button>
                ))}
              </div>
              {error && error.includes("template") && (
                <p className="mt-2 text-xs text-red-400">{error}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold uppercase tracking-wider transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Create Project</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
