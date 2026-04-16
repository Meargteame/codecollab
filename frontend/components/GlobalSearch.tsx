"use client";

import { useState, useEffect, useRef } from "react";

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const results = [
    { type: "project", name: "E-commerce Platform", path: "/workspace/editor/1" },
    { type: "project", name: "Mobile App Backend", path: "/workspace/editor/2" },
    { type: "file", name: "index.tsx", path: "/workspace/editor/1/file/index.tsx" },
    { type: "file", name: "api.ts", path: "/workspace/editor/2/file/api.ts" },
  ].filter(item => 
    query.length > 0 && item.name.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-32">
      <div className="w-full max-w-2xl bg-black border border-white/10 shadow-2xl">
        {/* Search Input */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects and files..."
              className="flex-1 bg-transparent text-white text-sm focus:outline-none"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="px-2 py-1 bg-white/10 text-xs text-gray-400 hover:text-white transition-colors"
            >
              ESC
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              Start typing to search projects and files
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No results found for "{query}"
            </div>
          ) : (
            <div className="p-2">
              {results.map((result, index) => (
                <a
                  key={index}
                  href={result.path}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  {result.type === "project" ? (
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  <div className="flex-1">
                    <div className="text-sm text-white group-hover:text-blue-500 transition-colors">
                      {result.name}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">
                      {result.type}
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/10">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white/10">↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/10">↵</kbd>
              <span>Open</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white/10">ESC</kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
