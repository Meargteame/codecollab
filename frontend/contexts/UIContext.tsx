'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// View types for Activity Bar
export type ViewType = 'explorer' | 'search' | 'git' | 'extensions' | 'collaboration';

// Panel view types
export type PanelViewType = 'terminal' | 'output' | 'problems';

// Layout state interfaces
interface ActivityBarState {
  visible: boolean;
  activeView: ViewType;
}

interface SidebarState {
  visible: boolean;
  width: number;
  position: 'left' | 'right';
}

interface PanelState {
  visible: boolean;
  height: number;
  activeView: PanelViewType;
}

interface MinimapState {
  enabled: boolean;
}

interface CommandPaletteState {
  isOpen: boolean;
  recentCommands: string[];
}

interface QuickOpenState {
  isOpen: boolean;
  recentFiles: string[];
}

interface ContextMenuState {
  isOpen: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
}

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  submenu?: ContextMenuItem[];
  action?: () => void;
}

interface WelcomeScreenState {
  visible: boolean;
  dismissed: boolean;
}

// Complete UI state
interface UIState {
  activityBar: ActivityBarState;
  sidebar: SidebarState;
  panel: PanelState;
  minimap: MinimapState;
  zenMode: boolean;
  commandPalette: CommandPaletteState;
  quickOpen: QuickOpenState;
  contextMenu: ContextMenuState;
  welcomeScreen: WelcomeScreenState;
}

// Context type with state and actions
interface UIContextType {
  uiState: UIState;
  
  // Activity Bar actions
  setActiveView: (view: ViewType) => void;
  toggleActivityBar: () => void;
  
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  setSidebarPosition: (position: 'left' | 'right') => void;
  
  // Panel actions
  togglePanel: () => void;
  setPanelHeight: (height: number) => void;
  setPanelActiveView: (view: PanelViewType) => void;
  
  // Minimap actions
  toggleMinimap: () => void;
  
  // Zen mode actions
  toggleZenMode: () => void;
  
  // Command Palette actions
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  addRecentCommand: (commandId: string) => void;
  
  // Quick Open actions
  openQuickOpen: () => void;
  closeQuickOpen: () => void;
  addRecentFile: (filePath: string) => void;
  
  // Context Menu actions
  openContextMenu: (position: { x: number; y: number }, items: ContextMenuItem[]) => void;
  closeContextMenu: () => void;
  
  // Welcome Screen actions
  showWelcomeScreen: () => void;
  hideWelcomeScreen: () => void;
  dismissWelcomeScreen: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

// Default UI state
const defaultUIState: UIState = {
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
};

// Storage key for localStorage
const UI_STATE_STORAGE_KEY = 'editor-ui-state';

// Helper to load state from localStorage
function loadUIStateFromStorage(): Partial<UIState> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(UI_STATE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load UI state from localStorage:', error);
  }
  
  return {};
}

// Helper to save state to localStorage
function saveUIStateToStorage(state: UIState): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Only persist layout-related state, not transient overlay states
    const persistedState = {
      activityBar: state.activityBar,
      sidebar: state.sidebar,
      panel: state.panel,
      minimap: state.minimap,
      zenMode: state.zenMode,
      commandPalette: {
        recentCommands: state.commandPalette.recentCommands,
      },
      quickOpen: {
        recentFiles: state.quickOpen.recentFiles,
      },
      welcomeScreen: {
        dismissed: state.welcomeScreen.dismissed,
      },
    };
    
    localStorage.setItem(UI_STATE_STORAGE_KEY, JSON.stringify(persistedState));
  } catch (error) {
    console.error('Failed to save UI state to localStorage:', error);
  }
}

export function UIProvider({ children }: { children: ReactNode }) {
  // Initialize state with defaults merged with stored state
  const [uiState, setUIState] = useState<UIState>(() => {
    const stored = loadUIStateFromStorage();
    return {
      ...defaultUIState,
      ...stored,
      // Ensure nested objects are properly merged
      activityBar: { ...defaultUIState.activityBar, ...stored.activityBar },
      sidebar: { ...defaultUIState.sidebar, ...stored.sidebar },
      panel: { ...defaultUIState.panel, ...stored.panel },
      minimap: { ...defaultUIState.minimap, ...stored.minimap },
      commandPalette: {
        ...defaultUIState.commandPalette,
        recentCommands: stored.commandPalette?.recentCommands || [],
      },
      quickOpen: {
        ...defaultUIState.quickOpen,
        recentFiles: stored.quickOpen?.recentFiles || [],
      },
      welcomeScreen: {
        ...defaultUIState.welcomeScreen,
        dismissed: stored.welcomeScreen?.dismissed || false,
      },
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveUIStateToStorage(uiState);
  }, [uiState]);

  // Activity Bar actions
  const setActiveView = (view: ViewType) => {
    setUIState(prev => ({
      ...prev,
      activityBar: { ...prev.activityBar, activeView: view },
      sidebar: { ...prev.sidebar, visible: true }, // Show sidebar when switching views
    }));
  };

  const toggleActivityBar = () => {
    setUIState(prev => ({
      ...prev,
      activityBar: { ...prev.activityBar, visible: !prev.activityBar.visible },
    }));
  };

  // Sidebar actions
  const toggleSidebar = () => {
    setUIState(prev => ({
      ...prev,
      sidebar: { ...prev.sidebar, visible: !prev.sidebar.visible },
    }));
  };

  const setSidebarWidth = (width: number) => {
    setUIState(prev => ({
      ...prev,
      sidebar: { ...prev.sidebar, width },
    }));
  };

  const setSidebarPosition = (position: 'left' | 'right') => {
    setUIState(prev => ({
      ...prev,
      sidebar: { ...prev.sidebar, position },
    }));
  };

  // Panel actions
  const togglePanel = () => {
    setUIState(prev => ({
      ...prev,
      panel: { ...prev.panel, visible: !prev.panel.visible },
    }));
  };

  const setPanelHeight = (height: number) => {
    setUIState(prev => ({
      ...prev,
      panel: { ...prev.panel, height },
    }));
  };

  const setPanelActiveView = (view: PanelViewType) => {
    setUIState(prev => ({
      ...prev,
      panel: { ...prev.panel, activeView: view },
    }));
  };

  // Minimap actions
  const toggleMinimap = () => {
    setUIState(prev => ({
      ...prev,
      minimap: { enabled: !prev.minimap.enabled },
    }));
  };

  // Zen mode actions
  const toggleZenMode = () => {
    setUIState(prev => ({
      ...prev,
      zenMode: !prev.zenMode,
    }));
  };

  // Command Palette actions
  const openCommandPalette = () => {
    setUIState(prev => ({
      ...prev,
      commandPalette: { ...prev.commandPalette, isOpen: true },
    }));
  };

  const closeCommandPalette = () => {
    setUIState(prev => ({
      ...prev,
      commandPalette: { ...prev.commandPalette, isOpen: false },
    }));
  };

  const addRecentCommand = (commandId: string) => {
    setUIState(prev => {
      const recentCommands = [
        commandId,
        ...prev.commandPalette.recentCommands.filter(id => id !== commandId),
      ].slice(0, 10); // Keep only last 10 commands
      
      return {
        ...prev,
        commandPalette: { ...prev.commandPalette, recentCommands },
      };
    });
  };

  // Quick Open actions
  const openQuickOpen = () => {
    setUIState(prev => ({
      ...prev,
      quickOpen: { ...prev.quickOpen, isOpen: true },
    }));
  };

  const closeQuickOpen = () => {
    setUIState(prev => ({
      ...prev,
      quickOpen: { ...prev.quickOpen, isOpen: false },
    }));
  };

  const addRecentFile = (filePath: string) => {
    setUIState(prev => {
      const recentFiles = [
        filePath,
        ...prev.quickOpen.recentFiles.filter(path => path !== filePath),
      ].slice(0, 20); // Keep only last 20 files
      
      return {
        ...prev,
        quickOpen: { ...prev.quickOpen, recentFiles },
      };
    });
  };

  // Context Menu actions
  const openContextMenu = (position: { x: number; y: number }, items: ContextMenuItem[]) => {
    setUIState(prev => ({
      ...prev,
      contextMenu: { isOpen: true, position, items },
    }));
  };

  const closeContextMenu = () => {
    setUIState(prev => ({
      ...prev,
      contextMenu: { ...prev.contextMenu, isOpen: false },
    }));
  };

  // Welcome Screen actions
  const showWelcomeScreen = () => {
    setUIState(prev => ({
      ...prev,
      welcomeScreen: { ...prev.welcomeScreen, visible: true },
    }));
  };

  const hideWelcomeScreen = () => {
    setUIState(prev => ({
      ...prev,
      welcomeScreen: { ...prev.welcomeScreen, visible: false },
    }));
  };

  const dismissWelcomeScreen = () => {
    setUIState(prev => ({
      ...prev,
      welcomeScreen: { visible: false, dismissed: true },
    }));
  };

  return (
    <UIContext.Provider
      value={{
        uiState,
        setActiveView,
        toggleActivityBar,
        toggleSidebar,
        setSidebarWidth,
        setSidebarPosition,
        togglePanel,
        setPanelHeight,
        setPanelActiveView,
        toggleMinimap,
        toggleZenMode,
        openCommandPalette,
        closeCommandPalette,
        addRecentCommand,
        openQuickOpen,
        closeQuickOpen,
        addRecentFile,
        openContextMenu,
        closeContextMenu,
        showWelcomeScreen,
        hideWelcomeScreen,
        dismissWelcomeScreen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
