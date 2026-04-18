"use client";

import { useEffect, useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";

interface CodeEditorProps {
  content: string;
  language: string;
  onChange: (content: string) => void;
  onSave: () => void;
  onCursorPositionChange?: (position: { line: number; column: number }) => void;
  readOnly?: boolean;
}

export default function CodeEditor({ 
  content, 
  language, 
  onChange, 
  onSave,
  onCursorPositionChange,
  readOnly = false 
}: CodeEditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Add save command
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave();
    });

    // Track cursor position
    editor.onDidChangeCursorPosition((e) => {
      const position = {
        line: e.position.lineNumber,
        column: e.position.column,
      };
      setCursorPosition(position);
      onCursorPositionChange?.(position);
    });

    // Focus the editor
    editor.focus();
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  // Map language names to Monaco language IDs
  const getMonacoLanguage = (lang: string): string => {
    const languageMap: Record<string, string> = {
      'TypeScript': 'typescript',
      'JavaScript': 'javascript',
      'Python': 'python',
      'Go': 'go',
      'Rust': 'rust',
      'Java': 'java',
      'C++': 'cpp',
      'C': 'c',
      'C#': 'csharp',
      'Ruby': 'ruby',
      'PHP': 'php',
      'HTML': 'html',
      'CSS': 'css',
      'JSON': 'json',
      'Markdown': 'markdown',
      'YAML': 'yaml',
      'XML': 'xml',
      'SQL': 'sql',
      'Shell': 'shell',
      'Bash': 'shell',
      'Plain Text': 'plaintext',
    };
    return languageMap[lang] || 'plaintext';
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Editor Toolbar */}
      <div className="h-8 border-b border-white/10 flex items-center justify-between px-4 bg-white/[0.02] flex-shrink-0">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="uppercase tracking-wider">{language}</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={content}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            readOnly,
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
            lineNumbers: 'on',
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'off',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            quickSuggestions: true,
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            matchBrackets: 'always',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            renderWhitespace: 'selection',
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="h-6 border-t border-white/10 flex items-center justify-between px-4 bg-white/[0.02] text-xs text-gray-500 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span>⌘S to save</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Spaces: 2</span>
          <span>Tab Size: 2</span>
        </div>
      </div>
    </div>
  );
}
