"use client";

import { useState } from "react";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileNode[];
}

interface FileTreeProps {
  files: FileNode[];
  activeFileId: string | null;
  onFileSelect: (file: FileNode) => void;
}

function TreeNode({ 
  node, 
  level = 0, 
  activeFileId, 
  onFileSelect 
}: { 
  node: FileNode; 
  level?: number; 
  activeFileId: string | null;
  onFileSelect: (file: FileNode) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleClick = () => {
    if (node.type === "folder") {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(node);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'ts':
        return '⚛️';
      case 'jsx':
      case 'js':
        return '📜';
      case 'json':
        return '📋';
      case 'md':
        return '📝';
      case 'html':
        return '🌐';
      case 'css':
        return '🎨';
      default:
        return '📄';
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-2 px-2 py-1 text-sm hover:bg-white/5 transition-colors ${
          node.type === 'file' && activeFileId === node.id
            ? 'bg-blue-500/10 text-white border-l-2 border-blue-500'
            : 'text-gray-400'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {node.type === "folder" ? (
          <>
            <svg 
              className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </>
        ) : (
          <>
            <span className="w-3" />
            <span className="text-xs">{getFileIcon(node.name)}</span>
          </>
        )}
        <span className={node.type === 'file' && activeFileId === node.id ? 'text-white' : ''}>
          {node.name}
        </span>
      </button>

      {node.type === "folder" && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              activeFileId={activeFileId}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree({ files, activeFileId, onFileSelect }: FileTreeProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-2 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Explorer</span>
          <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="py-2">
        {files.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            activeFileId={activeFileId}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
    </div>
  );
}
