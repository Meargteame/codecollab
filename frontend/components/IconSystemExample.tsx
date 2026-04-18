'use client';

import React from 'react';
import { FileIcon, FolderIcon, getFileIconType, getFolderIconType } from '@/lib/icons';

/**
 * Example component demonstrating the icon system usage
 * This shows how to use file and folder icons throughout the UI
 */
export default function IconSystemExample() {
  // Example file names
  const exampleFiles = [
    'index.tsx',
    'App.jsx',
    'styles.css',
    'config.json',
    'README.md',
    'main.py',
    'server.go',
    'lib.rs',
    'package.json',
    'dockerfile',
    '.gitignore',
    'app.test.ts',
    '.env',
    'logo.svg',
    'data.sql',
  ];

  // Example folder names
  const exampleFolders = [
    'src',
    'components',
    'utils',
    'test',
    'public',
    'config',
    'docs',
    'api',
    'hooks',
    'contexts',
    'node_modules',
    '.git',
    '.vscode',
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Icon System Example</h2>
        <p className="text-gray-600 mb-6">
          Comprehensive icon system with 50+ file types and special folder icons
        </p>
      </div>

      {/* File Icons Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">File Icons</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {exampleFiles.map((fileName) => {
            const iconType = getFileIconType(fileName);
            return (
              <div
                key={fileName}
                className="flex items-center gap-2 p-3 border rounded hover:bg-gray-50 transition-colors"
              >
                <FileIcon type={iconType} size={20} />
                <span className="text-sm truncate">{fileName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Folder Icons Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Folder Icons</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {exampleFolders.map((folderName) => {
            const iconType = getFolderIconType(folderName);
            return (
              <div
                key={folderName}
                className="flex items-center gap-2 p-3 border rounded hover:bg-gray-50 transition-colors"
              >
                <FolderIcon type={iconType} size={20} />
                <span className="text-sm truncate">{folderName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Folder States Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Folder States (Open/Closed)</h3>
        <div className="flex gap-8">
          <div className="flex items-center gap-2 p-3 border rounded">
            <FolderIcon type="folder" isOpen={false} size={24} />
            <span className="text-sm">Closed Folder</span>
          </div>
          <div className="flex items-center gap-2 p-3 border rounded">
            <FolderIcon type="folder" isOpen={true} size={24} />
            <span className="text-sm">Open Folder</span>
          </div>
        </div>
      </div>

      {/* Icon Sizes Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Icon Sizes</h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FileIcon type="javascript" size={12} />
            <span className="text-sm">12px</span>
          </div>
          <div className="flex items-center gap-2">
            <FileIcon type="javascript" size={16} />
            <span className="text-sm">16px (default)</span>
          </div>
          <div className="flex items-center gap-2">
            <FileIcon type="javascript" size={20} />
            <span className="text-sm">20px</span>
          </div>
          <div className="flex items-center gap-2">
            <FileIcon type="javascript" size={24} />
            <span className="text-sm">24px</span>
          </div>
          <div className="flex items-center gap-2">
            <FileIcon type="javascript" size={32} />
            <span className="text-sm">32px</span>
          </div>
        </div>
      </div>

      {/* Programming Languages Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Programming Languages</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'JavaScript', type: 'javascript' },
            { name: 'TypeScript', type: 'typescript' },
            { name: 'React', type: 'react' },
            { name: 'Python', type: 'python' },
            { name: 'Go', type: 'go' },
            { name: 'Rust', type: 'rust' },
            { name: 'Java', type: 'java' },
            { name: 'C++', type: 'cpp' },
            { name: 'Ruby', type: 'ruby' },
            { name: 'PHP', type: 'php' },
            { name: 'Swift', type: 'swift' },
            { name: 'Kotlin', type: 'kotlin' },
          ].map((lang) => (
            <div
              key={lang.type}
              className="flex flex-col items-center gap-2 p-3 border rounded hover:bg-gray-50 transition-colors"
            >
              <FileIcon type={lang.type} size={32} />
              <span className="text-xs text-center">{lang.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Example Code */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Usage Example</h3>
        <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
          <pre>{`import { FileIcon, getFileIconType } from '@/lib/icons';

// Resolve icon type from filename
const iconType = getFileIconType('index.tsx');

// Render the icon
<FileIcon type={iconType} size={16} />

// Or use directly
<FileIcon type="javascript" size={20} className="mr-2" />`}</pre>
        </div>
      </div>
    </div>
  );
}
