import { renderHook, act } from '@testing-library/react';
import { UIProvider, useUI } from './UIContext';
import { ReactNode } from 'react';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('UIContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <UIProvider>{children}</UIProvider>
  );

  describe('Activity Bar', () => {
    it('should initialize with default activity bar state', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current.uiState.activityBar.visible).toBe(true);
      expect(result.current.uiState.activityBar.activeView).toBe('explorer');
    });

    it('should change active view', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.setActiveView('search');
      });

      expect(result.current.uiState.activityBar.activeView).toBe('search');
      expect(result.current.uiState.sidebar.visible).toBe(true);
    });

    it('should toggle activity bar visibility', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.toggleActivityBar();
      });

      expect(result.current.uiState.activityBar.visible).toBe(false);

      act(() => {
        result.current.toggleActivityBar();
      });

      expect(result.current.uiState.activityBar.visible).toBe(true);
    });
  });

  describe('Sidebar', () => {
    it('should initialize with default sidebar state', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current.uiState.sidebar.visible).toBe(true);
      expect(result.current.uiState.sidebar.width).toBe(250);
      expect(result.current.uiState.sidebar.position).toBe('left');
    });

    it('should toggle sidebar visibility', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.uiState.sidebar.visible).toBe(false);

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.uiState.sidebar.visible).toBe(true);
    });

    it('should update sidebar width', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.setSidebarWidth(300);
      });

      expect(result.current.uiState.sidebar.width).toBe(300);
    });

    it('should update sidebar position', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.setSidebarPosition('right');
      });

      expect(result.current.uiState.sidebar.position).toBe('right');
    });
  });

  describe('Panel', () => {
    it('should initialize with default panel state', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current.uiState.panel.visible).toBe(false);
      expect(result.current.uiState.panel.height).toBe(200);
      expect(result.current.uiState.panel.activeView).toBe('terminal');
    });

    it('should toggle panel visibility', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.togglePanel();
      });

      expect(result.current.uiState.panel.visible).toBe(true);

      act(() => {
        result.current.togglePanel();
      });

      expect(result.current.uiState.panel.visible).toBe(false);
    });

    it('should update panel height', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.setPanelHeight(300);
      });

      expect(result.current.uiState.panel.height).toBe(300);
    });

    it('should change panel active view', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.setPanelActiveView('output');
      });

      expect(result.current.uiState.panel.activeView).toBe('output');
    });
  });

  describe('Minimap', () => {
    it('should initialize with minimap enabled', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current.uiState.minimap.enabled).toBe(true);
    });

    it('should toggle minimap', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.toggleMinimap();
      });

      expect(result.current.uiState.minimap.enabled).toBe(false);

      act(() => {
        result.current.toggleMinimap();
      });

      expect(result.current.uiState.minimap.enabled).toBe(true);
    });
  });

  describe('Zen Mode', () => {
    it('should initialize with zen mode disabled', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current.uiState.zenMode).toBe(false);
    });

    it('should toggle zen mode', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.toggleZenMode();
      });

      expect(result.current.uiState.zenMode).toBe(true);

      act(() => {
        result.current.toggleZenMode();
      });

      expect(result.current.uiState.zenMode).toBe(false);
    });
  });

  describe('Command Palette', () => {
    it('should initialize with command palette closed', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current.uiState.commandPalette.isOpen).toBe(false);
      expect(result.current.uiState.commandPalette.recentCommands).toEqual([]);
    });

    it('should open and close command palette', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.openCommandPalette();
      });

      expect(result.current.uiState.commandPalette.isOpen).toBe(true);

      act(() => {
        result.current.closeCommandPalette();
      });

      expect(result.current.uiState.commandPalette.isOpen).toBe(false);
    });

    it('should add recent commands', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.addRecentCommand('file.save');
        result.current.addRecentCommand('file.open');
      });

      expect(result.current.uiState.commandPalette.recentCommands).toEqual([
        'file.open',
        'file.save',
      ]);
    });

    it('should limit recent commands to 10', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        for (let i = 0; i < 15; i++) {
          result.current.addRecentCommand(`command-${i}`);
        }
      });

      expect(result.current.uiState.commandPalette.recentCommands).toHaveLength(10);
      expect(result.current.uiState.commandPalette.recentCommands[0]).toBe('command-14');
    });

    it('should not duplicate recent commands', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.addRecentCommand('file.save');
        result.current.addRecentCommand('file.open');
        result.current.addRecentCommand('file.save');
      });

      expect(result.current.uiState.commandPalette.recentCommands).toEqual([
        'file.save',
        'file.open',
      ]);
    });
  });

  describe('Quick Open', () => {
    it('should initialize with quick open closed', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current.uiState.quickOpen.isOpen).toBe(false);
      expect(result.current.uiState.quickOpen.recentFiles).toEqual([]);
    });

    it('should open and close quick open', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.openQuickOpen();
      });

      expect(result.current.uiState.quickOpen.isOpen).toBe(true);

      act(() => {
        result.current.closeQuickOpen();
      });

      expect(result.current.uiState.quickOpen.isOpen).toBe(false);
    });

    it('should add recent files', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.addRecentFile('/src/App.tsx');
        result.current.addRecentFile('/src/index.tsx');
      });

      expect(result.current.uiState.quickOpen.recentFiles).toEqual([
        '/src/index.tsx',
        '/src/App.tsx',
      ]);
    });

    it('should limit recent files to 20', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        for (let i = 0; i < 25; i++) {
          result.current.addRecentFile(`/src/file-${i}.tsx`);
        }
      });

      expect(result.current.uiState.quickOpen.recentFiles).toHaveLength(20);
      expect(result.current.uiState.quickOpen.recentFiles[0]).toBe('/src/file-24.tsx');
    });

    it('should not duplicate recent files', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.addRecentFile('/src/App.tsx');
        result.current.addRecentFile('/src/index.tsx');
        result.current.addRecentFile('/src/App.tsx');
      });

      expect(result.current.uiState.quickOpen.recentFiles).toEqual([
        '/src/App.tsx',
        '/src/index.tsx',
      ]);
    });
  });

  describe('Context Menu', () => {
    it('should initialize with context menu closed', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current.uiState.contextMenu.isOpen).toBe(false);
    });

    it('should open and close context menu', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      const items = [
        { id: '1', label: 'Copy' },
        { id: '2', label: 'Paste' },
      ];

      act(() => {
        result.current.openContextMenu({ x: 100, y: 200 }, items);
      });

      expect(result.current.uiState.contextMenu.isOpen).toBe(true);
      expect(result.current.uiState.contextMenu.position).toEqual({ x: 100, y: 200 });
      expect(result.current.uiState.contextMenu.items).toEqual(items);

      act(() => {
        result.current.closeContextMenu();
      });

      expect(result.current.uiState.contextMenu.isOpen).toBe(false);
    });
  });

  describe('Welcome Screen', () => {
    it('should initialize with welcome screen hidden', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current.uiState.welcomeScreen.visible).toBe(false);
      expect(result.current.uiState.welcomeScreen.dismissed).toBe(false);
    });

    it('should show and hide welcome screen', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.showWelcomeScreen();
      });

      expect(result.current.uiState.welcomeScreen.visible).toBe(true);

      act(() => {
        result.current.hideWelcomeScreen();
      });

      expect(result.current.uiState.welcomeScreen.visible).toBe(false);
    });

    it('should dismiss welcome screen', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.showWelcomeScreen();
        result.current.dismissWelcomeScreen();
      });

      expect(result.current.uiState.welcomeScreen.visible).toBe(false);
      expect(result.current.uiState.welcomeScreen.dismissed).toBe(true);
    });
  });

  describe('LocalStorage Persistence', () => {
    it('should persist layout state to localStorage', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.setSidebarWidth(350);
        result.current.setPanelHeight(250);
        result.current.toggleZenMode();
      });

      const stored = JSON.parse(localStorageMock.getItem('editor-ui-state') || '{}');

      expect(stored.sidebar.width).toBe(350);
      expect(stored.panel.height).toBe(250);
      expect(stored.zenMode).toBe(true);
    });

    it('should load persisted state from localStorage', () => {
      const persistedState = {
        sidebar: { visible: false, width: 300, position: 'right' },
        panel: { visible: true, height: 250, activeView: 'output' },
        zenMode: true,
      };

      localStorageMock.setItem('editor-ui-state', JSON.stringify(persistedState));

      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current.uiState.sidebar.width).toBe(300);
      expect(result.current.uiState.sidebar.position).toBe('right');
      expect(result.current.uiState.panel.height).toBe(250);
      expect(result.current.uiState.zenMode).toBe(true);
    });

    it('should not persist transient overlay states', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.openCommandPalette();
        result.current.openQuickOpen();
      });

      const stored = JSON.parse(localStorageMock.getItem('editor-ui-state') || '{}');

      expect(stored.commandPalette?.isOpen).toBeUndefined();
      expect(stored.quickOpen?.isOpen).toBeUndefined();
    });

    it('should persist recent commands and files', () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      act(() => {
        result.current.addRecentCommand('file.save');
        result.current.addRecentFile('/src/App.tsx');
      });

      const stored = JSON.parse(localStorageMock.getItem('editor-ui-state') || '{}');

      expect(stored.commandPalette.recentCommands).toContain('file.save');
      expect(stored.quickOpen.recentFiles).toContain('/src/App.tsx');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when useUI is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useUI());
      }).toThrow('useUI must be used within a UIProvider');

      consoleSpy.mockRestore();
    });
  });
});
