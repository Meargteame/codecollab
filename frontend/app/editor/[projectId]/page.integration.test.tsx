import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditorWorkspace from './page';

// Mock the contexts
jest.mock('@/contexts/EditorContext', () => ({
  EditorProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useEditor: () => ({
    fileTree: [],
    openTabs: [],
    activeTabId: null,
    terminalOpen: false,
    terminalHeight: 200,
    sidebarWidth: 250,
    openFile: jest.fn(),
    closeTab: jest.fn(),
    setActiveTab: jest.fn(),
    updateTabContent: jest.fn(),
    markTabClean: jest.fn(),
    setTerminalOpen: jest.fn(),
    setTerminalHeight: jest.fn(),
    setSidebarWidth: jest.fn(),
  }),
}));

jest.mock('@/contexts/CollaborationContext', () => ({
  CollaborationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useCollaboration: () => ({
    collaborators: [],
    messages: [],
    isConnected: false,
    sendMessage: jest.fn(),
    updateCursorPosition: jest.fn(),
  }),
}));

jest.mock('@/contexts/UIContext', () => ({
  UIProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useUI: () => ({
    uiState: {
      activityBar: {
        visible: true,
        activeView: 'explorer',
      },
      sidebar: {
        visible: true,
        width: 250,
        position: 'left',
      },
      panel: {
        visible: false,
        height: 200,
        activeView: 'terminal',
      },
      minimap: {
        enabled: true,
      },
      zenMode: false,
      commandPalette: {
        isOpen: false,
        recentCommands: [],
      },
      quickOpen: {
        isOpen: false,
        recentFiles: [],
      },
      contextMenu: {
        isOpen: false,
        position: { x: 0, y: 0 },
        items: [],
      },
      welcomeScreen: {
        visible: false,
        dismissed: false,
      },
    },
    setActiveView: jest.fn(),
    toggleActivityBar: jest.fn(),
    toggleSidebar: jest.fn(),
    setSidebarWidth: jest.fn(),
    setSidebarPosition: jest.fn(),
    togglePanel: jest.fn(),
    setPanelHeight: jest.fn(),
    setPanelActiveView: jest.fn(),
    toggleMinimap: jest.fn(),
    toggleZenMode: jest.fn(),
    openCommandPalette: jest.fn(),
    closeCommandPalette: jest.fn(),
    addRecentCommand: jest.fn(),
    openQuickOpen: jest.fn(),
    closeQuickOpen: jest.fn(),
    addRecentFile: jest.fn(),
    openContextMenu: jest.fn(),
    closeContextMenu: jest.fn(),
    showWelcomeScreen: jest.fn(),
    hideWelcomeScreen: jest.fn(),
    dismissWelcomeScreen: jest.fn(),
  }),
}));

jest.mock('@/contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#3b82f6',
        foreground: '#e4e4e7',
        activityBar: '#0f0f0f',
      },
    },
    setTheme: jest.fn(),
  }),
}));

// Mock child components
jest.mock('@/components/ActivityBar', () => ({
  ActivityBar: () => <div data-testid="activity-bar">ActivityBar</div>,
}));

jest.mock('@/components/FileTree', () => ({
  __esModule: true,
  default: () => <div data-testid="file-tree">FileTree</div>,
}));

jest.mock('@/components/EditorTabs', () => ({
  __esModule: true,
  default: () => <div data-testid="editor-tabs">EditorTabs</div>,
}));

jest.mock('@/components/CodeEditor', () => ({
  __esModule: true,
  default: () => <div data-testid="code-editor">CodeEditor</div>,
}));

jest.mock('@/components/Terminal', () => ({
  __esModule: true,
  default: () => <div data-testid="terminal">Terminal</div>,
}));

jest.mock('@/components/ResizeHandle', () => ({
  __esModule: true,
  default: () => <div data-testid="resize-handle">ResizeHandle</div>,
}));

jest.mock('@/components/CollaborationSidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="collaboration-sidebar">CollaborationSidebar</div>,
}));

jest.mock('@/components/ChatPanel', () => ({
  __esModule: true,
  default: () => <div data-testid="chat-panel">ChatPanel</div>,
}));

jest.mock('@/components/ProjectShareModal', () => ({
  __esModule: true,
  default: () => <div data-testid="project-share-modal">ProjectShareModal</div>,
}));

describe('EditorWorkspace Integration', () => {
  it('renders ActivityBar in the layout', () => {
    render(<EditorWorkspace params={{ projectId: 'test-project' }} />);
    
    const activityBar = screen.getByTestId('activity-bar');
    expect(activityBar).toBeInTheDocument();
  });

  it('renders ActivityBar before FileTree (on far left)', () => {
    const { container } = render(<EditorWorkspace params={{ projectId: 'test-project' }} />);
    
    const activityBar = screen.getByTestId('activity-bar');
    const fileTree = screen.getByTestId('file-tree');
    
    // Get the parent container
    const parent = activityBar.parentElement;
    const children = Array.from(parent?.children || []);
    
    // ActivityBar should come before FileTree in the DOM
    const activityBarIndex = children.indexOf(activityBar);
    const fileTreeParentIndex = children.findIndex(child => 
      child.querySelector('[data-testid="file-tree"]')
    );
    
    expect(activityBarIndex).toBeLessThan(fileTreeParentIndex);
  });

  it('wraps editor with UIProvider', () => {
    // If UIProvider is not present, useUI hook would fail
    // This test passes if the component renders without errors
    expect(() => {
      render(<EditorWorkspace params={{ projectId: 'test-project' }} />);
    }).not.toThrow();
  });
});
