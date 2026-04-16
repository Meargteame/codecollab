"use client";

import { useState } from "react";
import { EditorProvider, useEditor } from "@/contexts/EditorContext";
import { CollaborationProvider, useCollaboration } from "@/contexts/CollaborationContext";
import FileTree from "@/components/FileTree";
import EditorTabs from "@/components/EditorTabs";
import CodeEditor from "@/components/CodeEditor";
import Terminal from "@/components/Terminal";
import ResizeHandle from "@/components/ResizeHandle";
import CollaborationSidebar from "@/components/CollaborationSidebar";
import ChatPanel from "@/components/ChatPanel";
import ProjectShareModal from "@/components/ProjectShareModal";

// Sample file contents
const fileContents: Record<string, string> = {
  "2": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
  "3": `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Welcome to CodeCollab</h1>
      <p>Start building amazing projects!</p>
    </div>
  );
}

export default App;`,
  "5": `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={\`btn btn-\${variant}\`}
    >
      {children}
    </button>
  );
}`,
  "6": `import React from 'react';

export default function Header() {
  return (
    <header className="header">
      <h1>My App</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </header>
  );
}`,
  "8": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeCollab App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
  "9": `{
  "name": "codecollab-project",
  "version": "1.0.0",
  "description": "A CodeCollab project",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.0"
  }
}`,
  "10": `# CodeCollab Project

This is a project created with CodeCollab.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

- Real-time collaboration
- Integrated terminal
- File management
- Code editor with syntax highlighting

## Learn More

Visit [codecollab.io](https://codecollab.io) for documentation.`,
};

function EditorWorkspaceContent({ projectId }: { projectId: string }) {
  const {
    fileTree,
    openTabs,
    activeTabId,
    terminalOpen,
    terminalHeight,
    sidebarWidth,
    openFile,
    closeTab,
    setActiveTab,
    updateTabContent,
    markTabClean,
    setTerminalOpen,
    setTerminalHeight,
    setSidebarWidth,
  } = useEditor();

  const {
    collaborators,
    messages,
    isConnected,
    sendMessage,
    updateCursorPosition,
  } = useCollaboration();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const activeTab = openTabs.find(tab => tab.id === activeTabId);

  const handleFileSelect = (file: any) => {
    const content = fileContents[file.id] || `// ${file.name}\n\n// Start coding...`;
    openFile(file, content);
  };

  const handleSave = () => {
    if (activeTabId) {
      // TODO: API call to save file
      console.log("Saving file:", activeTab?.filePath);
      markTabClean(activeTabId);
    }
  };

  const handleSidebarResize = (delta: number) => {
    const newWidth = Math.max(200, Math.min(500, sidebarWidth + delta));
    setSidebarWidth(newWidth);
  };

  const getLanguage = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'ts':
        return 'TypeScript';
      case 'jsx':
      case 'js':
        return 'JavaScript';
      case 'json':
        return 'JSON';
      case 'md':
        return 'Markdown';
      case 'html':
        return 'HTML';
      case 'css':
        return 'CSS';
      default:
        return 'Plain Text';
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* File Tree Sidebar */}
      <div style={{ width: sidebarWidth }} className="border-r border-white/10 bg-white/[0.02] flex flex-col">
        <FileTree
          files={fileTree}
          activeFileId={activeTab?.fileId || null}
          onFileSelect={handleFileSelect}
        />
      </div>

        <ResizeHandle direction="horizontal" onResize={handleSidebarResize} />

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <EditorTabs
            tabs={openTabs}
            activeTabId={activeTabId}
            onTabSelect={setActiveTab}
            onTabClose={closeTab}
          />

          <div className="flex-1 overflow-hidden">
            {activeTab ? (
              <CodeEditor
                content={activeTab.content}
                language={getLanguage(activeTab.fileName)}
                onChange={(content) => updateTabContent(activeTab.id, content)}
                onSave={handleSave}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-black">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 mb-2">No file open</p>
                  <p className="text-gray-600 text-sm">Select a file from the explorer to start editing</p>
                </div>
              </div>
            )}
          </div>

          {/* Chat Panel */}
          {showChat && (
            <ChatPanel
              messages={messages}
              onSendMessage={sendMessage}
            />
          )}

          {/* Terminal Toggle Button */}
          {!terminalOpen && !showChat && (
            <button
              onClick={() => setTerminalOpen(true)}
              className="h-8 border-t border-white/10 flex items-center justify-center gap-2 bg-white/[0.02] hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wider">Open Terminal</span>
            </button>
          )}

          {/* Terminal */}
          {terminalOpen && !showChat && (
            <Terminal
              height={terminalHeight}
              onResize={setTerminalHeight}
              onClose={() => setTerminalOpen(false)}
            />
          )}
        </div>

        {/* Collaboration Sidebar */}
        <CollaborationSidebar
          collaborators={collaborators}
          isConnected={isConnected}
          onInvite={() => setIsShareModalOpen(true)}
        />
      </div>

      {/* Share Modal */}
      <ProjectShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        projectId={projectId}
      />
    </div>
  );
}

export default function EditorWorkspace({ params }: { params: { projectId: string } }) {
  return (
    <EditorProvider>
      <CollaborationProvider projectId={params.projectId}>
        <EditorWorkspaceContent projectId={params.projectId} />
      </CollaborationProvider>
    </EditorProvider>
  );
}
