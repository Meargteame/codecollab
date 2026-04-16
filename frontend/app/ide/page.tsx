"use client";

import { useState } from "react";

export default function IDE() {
  const [activeFile, setActiveFile] = useState("app.tsx");
  const [openFiles, setOpenFiles] = useState(["app.tsx", "utils.ts", "styles.css"]);

  const fileTree = [
    { name: "src", type: "folder", children: [
      { name: "components", type: "folder", children: [
        { name: "Button.tsx", type: "file" },
        { name: "Header.tsx", type: "file" }
      ]},
      { name: "app.tsx", type: "file" },
      { name: "utils.ts", type: "file" }
    ]},
    { name: "public", type: "folder", children: [
      { name: "index.html", type: "file" }
    ]},
    { name: "styles.css", type: "file" },
    { name: "package.json", type: "file" }
  ];

  const codeContent = `import React from 'react';
import { Button } from './components/Button';

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="app">
      <h1>CodeCollab IDE</h1>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </div>
  );
}

export default App;`;

  const collaborators = [
    { name: "Alex", color: "bg-blue-500", active: true },
    { name: "Sam", color: "bg-green-500", active: true },
    { name: "Jordan", color: "bg-purple-500", active: false }
  ];

  const renderFileTree = (items: any[], level = 0) => {
    return items.map((item, index) => (
      <div key={index}>
        <div 
          className={`flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-white/5 cursor-pointer ${
            item.name === activeFile ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400'
          }`}
          style={{ paddingLeft: `${level * 12 + 12}px` }}
          onClick={() => item.type === 'file' && setActiveFile(item.name)}
        >
          {item.type === 'folder' ? (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          <span className="font-mono">{item.name}</span>
        </div>
        {item.children && renderFileTree(item.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-12 bg-white/[0.02] border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="text-white font-bold text-sm">
              CODE<span className="text-blue-500">COLLAB</span>
            </span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">my-awesome-project</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Collaborators */}
          <div className="flex items-center gap-2">
            {collaborators.map((collab, index) => (
              <div
                key={index}
                className={`w-7 h-7 ${collab.color} flex items-center justify-center text-white text-xs font-bold relative`}
                title={collab.name}
              >
                {collab.name[0]}
                {collab.active && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 border border-black" />
                )}
              </div>
            ))}
          </div>

          <div className="h-6 w-px bg-white/10" />

          <button className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider transition-all">
            SHARE
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Sidebar */}
        <div className="w-64 bg-white/[0.02] border-r border-white/10 flex flex-col">
          <div className="h-10 border-b border-white/10 flex items-center px-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Explorer</span>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {renderFileTree(fileTree)}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* File Tabs */}
          <div className="h-10 bg-white/[0.02] border-b border-white/10 flex items-center">
            {openFiles.map((file, index) => (
              <div
                key={index}
                className={`h-full px-4 flex items-center gap-2 text-xs font-mono border-r border-white/10 cursor-pointer ${
                  file === activeFile 
                    ? 'bg-black text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setActiveFile(file)}
              >
                <span>{file}</span>
                <button 
                  className="hover:text-red-400 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenFiles(openFiles.filter(f => f !== file));
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-auto p-4 bg-black">
            <pre className="text-sm font-mono text-gray-300 leading-relaxed">
              <code>{codeContent}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Terminal Panel */}
      <div className="h-48 bg-white/[0.02] border-t border-white/10 flex flex-col">
        <div className="h-10 border-b border-white/10 flex items-center justify-between px-3">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Terminal</span>
            <span className="text-xs text-gray-600 font-mono">bash</span>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 font-mono text-xs text-gray-300">
          <div className="text-green-400">$ npm run dev</div>
          <div className="text-gray-500 mt-1">
            &gt; my-awesome-project@1.0.0 dev<br />
            &gt; vite
          </div>
          <div className="mt-2">
            <span className="text-blue-400">VITE</span> v5.0.0 ready in 234 ms
          </div>
          <div className="mt-1 text-gray-400">
            ➜ Local: <span className="text-blue-400">http://localhost:5173/</span><br />
            ➜ Network: use --host to expose
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-green-400">$</span>
            <span className="ml-2 animate-pulse">_</span>
          </div>
        </div>
      </div>
    </div>
  );
}
