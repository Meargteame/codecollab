"use client";

import { useState } from "react";
import { SiReact, SiNextdotjs, SiNodedotjs, SiPython, SiVuedotjs, SiDjango, SiHtml5, SiCss, SiJavascript } from "react-icons/si";
import { VscFile } from "react-icons/vsc";

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (name: string, template: string) => void;
}

const TemplateIcon = ({ id }: { id: string }) => {
  switch (id) {
    case "react-ts":
      return (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#20232a" }}>
          <SiReact size={22} color="#61DAFB" />
        </div>
      );
    case "nextjs":
      return (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white">
          <SiNextdotjs size={22} color="#000000" />
        </div>
      );
    case "node-api":
      return (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#1a1a1a" }}>
          <SiNodedotjs size={22} color="#339933" />
        </div>
      );
    case "python-flask":
      return (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#1c2b3a" }}>
          <SiPython size={22} color="#4B8BBE" />
        </div>
      );
    case "vue":
      return (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#1a2a1a" }}>
          <SiVuedotjs size={22} color="#4FC08D" />
        </div>
      );
    case "django":
      return (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#0c4b33" }}>
          <SiDjango size={22} color="#44b78b" />
        </div>
      );
    case "blank":
      return (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
          <VscFile size={22} color="#9ca3af" />
        </div>
      );
    case "html":
      return (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#1e1a00" }}>
          <SiHtml5 size={22} color="#E34F26" />
        </div>
      );
    case "css":
      return (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#001a2e" }}>
          <SiCss size={22} color="#1572B6" />
        </div>
      );
    case "javascript":
      return (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#1a1a00" }}>
          <SiJavascript size={22} color="#F7DF1E" />
        </div>
      );
    case "python":
      return (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#1c2b3a" }}>
          <SiPython size={22} color="#4B8BBE" />
        </div>
      );
    default:
      return null;
  }
};

export default function ProjectCreationModal({ isOpen, onClose, onCreateProject }: ProjectCreationModalProps) {
  const [projectName, setProjectName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [error, setError] = useState("");

  const templates = [
    { id: "react-ts",     name: "React + TypeScript", description: "Modern React app with TypeScript" },
    { id: "nextjs",       name: "Next.js App",         description: "Full-stack Next.js project"       },
    { id: "node-api",     name: "Node.js API",          description: "Express.js REST API starter"     },
    { id: "python-flask", name: "Python Flask",         description: "Flask web application"           },
    { id: "vue",          name: "Vue.js",               description: "Progressive Vue.js application"  },
    { id: "django",       name: "Django",               description: "Python Django web framework"     },
    { id: "html",         name: "HTML",                  description: "Plain HTML starter"              },
    { id: "css",          name: "CSS",                   description: "Styled HTML with CSS"            },
    { id: "javascript",   name: "JavaScript",            description: "Vanilla JS project"              },
    { id: "python",       name: "Python",                description: "Pure Python script/project"      },
    { id: "blank",        name: "Blank Project",         description: "Start from scratch"              },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.length < 3) { setError("Project name must be at least 3 characters"); return; }
    if (projectName.length > 50) { setError("Project name must be less than 50 characters"); return; }
    if (!selectedTemplate) { setError("Please select a template"); return; }
    onCreateProject(projectName, selectedTemplate);
    setProjectName(""); setSelectedTemplate(""); setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-black border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Create New Project</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Project Name */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => { setProjectName(e.target.value); setError(""); }}
                placeholder="My Awesome Project"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              {error && error.includes("name") && <p className="mt-2 text-xs text-red-400">{error}</p>}
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-xs text-gray-400 mb-3 uppercase tracking-wider font-bold">Choose Template</label>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => { setSelectedTemplate(template.id); setError(""); }}
                    className={`p-4 text-left transition-all flex items-center gap-3 ${
                      selectedTemplate === template.id
                        ? "bg-blue-500/10 border-2 border-blue-500"
                        : "bg-white/[0.02] border border-white/10 hover:border-white/30"
                    }`}
                  >
                    <TemplateIcon id={template.id} />
                    <div>
                      <div className="text-sm font-bold text-white mb-0.5">{template.name}</div>
                      <div className="text-xs text-gray-500">{template.description}</div>
                    </div>
                  </button>
                ))}
              </div>
              {error && error.includes("template") && <p className="mt-2 text-xs text-red-400">{error}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-bold">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold uppercase tracking-wider transition-all relative overflow-hidden group">
              <span className="relative z-10">Create Project</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
