"use client";

import { useState, useRef, useEffect } from "react";

interface Workspace {
  id: string;
  name: string;
}

export default function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState("My Workspace");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const workspaces: Workspace[] = [
    { id: "1", name: "My Workspace" },
    { id: "2", name: "Team Workspace" },
    { id: "3", name: "Client Projects" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        <span className="text-xs font-bold uppercase tracking-wider">{currentWorkspace}</span>
        <svg 
          className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-black border border-white/10 shadow-xl z-50">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              Your Workspaces
            </div>
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => {
                  setCurrentWorkspace(workspace.name);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-sm text-left transition-colors ${
                  workspace.name === currentWorkspace
                    ? 'text-white bg-blue-500/10 border-l-2 border-blue-500'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {workspace.name}
              </button>
            ))}
          </div>

          <div className="border-t border-white/10 p-2">
            <button className="w-full px-3 py-2 text-sm text-blue-500 hover:bg-white/5 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
