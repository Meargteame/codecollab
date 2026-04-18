"use client";

import { useTheme } from "@/contexts/ThemeContext";

interface StatusBarProps {
  // Git information
  branch?: string;
  
  // Cursor position
  cursorPosition: { line: number; column: number };
  
  // File information
  encoding?: string;
  lineEnding?: 'LF' | 'CRLF';
  language?: string;
  
  // Indentation settings
  indentation: { type: 'spaces' | 'tabs'; size: number };
  
  // Diagnostics
  errors?: number;
  warnings?: number;
  
  // Collaboration
  collaboratorCount?: number;
  
  // Click handlers
  onBranchClick?: () => void;
  onCursorClick?: () => void;
  onEncodingClick?: () => void;
  onLineEndingClick?: () => void;
  onLanguageClick?: () => void;
  onIndentationClick?: () => void;
  onDiagnosticsClick?: () => void;
  onCollaboratorsClick?: () => void;
}

export default function StatusBar({
  branch = 'main',
  cursorPosition,
  encoding = 'UTF-8',
  lineEnding = 'LF',
  language = 'Plain Text',
  indentation,
  errors = 0,
  warnings = 0,
  collaboratorCount = 0,
  onBranchClick,
  onCursorClick,
  onEncodingClick,
  onLineEndingClick,
  onLanguageClick,
  onIndentationClick,
  onDiagnosticsClick,
  onCollaboratorsClick,
}: StatusBarProps) {
  const { theme } = useTheme();

  const StatusBarItem = ({ 
    children, 
    onClick, 
    className = '' 
  }: { 
    children: React.ReactNode; 
    onClick?: () => void; 
    className?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`
        h-full px-3 flex items-center gap-1.5 text-xs
        transition-colors duration-150
        ${onClick ? 'hover:bg-white/5 cursor-pointer' : 'cursor-default'}
        ${className}
      `}
      style={{
        color: theme.colors.foreground,
      }}
    >
      {children}
    </button>
  );

  return (
    <div 
      className="h-6 flex items-center justify-between border-t"
      style={{
        backgroundColor: theme.colors.statusBar,
        borderColor: theme.ui.border,
      }}
    >
      {/* Left section */}
      <div className="flex items-center h-full">
        {/* Git branch */}
        <StatusBarItem onClick={onBranchClick}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span>{branch}</span>
        </StatusBarItem>

        {/* Errors */}
        {errors > 0 && (
          <StatusBarItem onClick={onDiagnosticsClick} className="text-red-400">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errors}</span>
          </StatusBarItem>
        )}

        {/* Warnings */}
        {warnings > 0 && (
          <StatusBarItem onClick={onDiagnosticsClick} className="text-yellow-400">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{warnings}</span>
          </StatusBarItem>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center h-full">
        {/* Collaborators */}
        {collaboratorCount > 0 && (
          <StatusBarItem onClick={onCollaboratorsClick}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>{collaboratorCount}</span>
          </StatusBarItem>
        )}

        {/* Cursor position */}
        <StatusBarItem onClick={onCursorClick}>
          <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
        </StatusBarItem>

        {/* Indentation */}
        <StatusBarItem onClick={onIndentationClick}>
          <span>{indentation.type === 'spaces' ? 'Spaces' : 'Tabs'}: {indentation.size}</span>
        </StatusBarItem>

        {/* Encoding */}
        <StatusBarItem onClick={onEncodingClick}>
          <span>{encoding}</span>
        </StatusBarItem>

        {/* Line ending */}
        <StatusBarItem onClick={onLineEndingClick}>
          <span>{lineEnding}</span>
        </StatusBarItem>

        {/* Language */}
        <StatusBarItem onClick={onLanguageClick}>
          <span>{language}</span>
        </StatusBarItem>
      </div>
    </div>
  );
}
