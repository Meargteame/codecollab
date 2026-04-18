# UIContext Usage Guide

## Overview

The `UIContext` provides centralized state management for the editor's layout and UI components. It manages the visibility, dimensions, and configuration of major UI elements including the Activity Bar, Sidebar, Panel, and various overlays.

## Features

- **Activity Bar**: View switching and visibility control
- **Sidebar**: Toggle, resize, and position management
- **Panel**: Terminal/output panel control
- **Minimap**: Toggle minimap visibility
- **Zen Mode**: Distraction-free editing mode
- **Command Palette**: Quick command access
- **Quick Open**: Fast file navigation
- **Context Menu**: Right-click menu management
- **Welcome Screen**: First-time user experience
- **LocalStorage Persistence**: Automatic state persistence

## Installation

The UIContext is already set up. To use it in your components:

```tsx
import { useUI } from '@/contexts/UIContext';

function MyComponent() {
  const { uiState, toggleSidebar, setActiveView } = useUI();
  
  // Access state
  const isSidebarVisible = uiState.sidebar.visible;
  
  // Trigger actions
  const handleToggle = () => toggleSidebar();
  
  return (
    <button onClick={handleToggle}>
      {isSidebarVisible ? 'Hide' : 'Show'} Sidebar
    </button>
  );
}
```

## Provider Setup

Wrap your application with the `UIProvider`:

```tsx
import { UIProvider } from '@/contexts/UIContext';

export default function RootLayout({ children }) {
  return (
    <UIProvider>
      {children}
    </UIProvider>
  );
}
```

## API Reference

### State Structure

```typescript
interface UIState {
  activityBar: {
    visible: boolean;
    activeView: 'explorer' | 'search' | 'git' | 'extensions' | 'collaboration';
  };
  sidebar: {
    visible: boolean;
    width: number;
    position: 'left' | 'right';
  };
  panel: {
    visible: boolean;
    height: number;
    activeView: 'terminal' | 'output' | 'problems';
  };
  minimap: {
    enabled: boolean;
  };
  zenMode: boolean;
  commandPalette: {
    isOpen: boolean;
    recentCommands: string[];
  };
  quickOpen: {
    isOpen: boolean;
    recentFiles: string[];
  };
  contextMenu: {
    isOpen: boolean;
    position: { x: number; y: number };
    items: ContextMenuItem[];
  };
  welcomeScreen: {
    visible: boolean;
    dismissed: boolean;
  };
}
```

### Actions

#### Activity Bar

```typescript
// Change active view (explorer, search, git, extensions, collaboration)
setActiveView(view: ViewType): void

// Toggle activity bar visibility
toggleActivityBar(): void
```

#### Sidebar

```typescript
// Toggle sidebar visibility
toggleSidebar(): void

// Set sidebar width (in pixels)
setSidebarWidth(width: number): void

// Set sidebar position (left or right)
setSidebarPosition(position: 'left' | 'right'): void
```

#### Panel

```typescript
// Toggle panel visibility
togglePanel(): void

// Set panel height (in pixels)
setPanelHeight(height: number): void

// Change panel active view (terminal, output, problems)
setPanelActiveView(view: PanelViewType): void
```

#### Minimap

```typescript
// Toggle minimap visibility
toggleMinimap(): void
```

#### Zen Mode

```typescript
// Toggle zen mode (hides all UI chrome)
toggleZenMode(): void
```

#### Command Palette

```typescript
// Open command palette
openCommandPalette(): void

// Close command palette
closeCommandPalette(): void

// Add command to recent history (max 10)
addRecentCommand(commandId: string): void
```

#### Quick Open

```typescript
// Open quick open dialog
openQuickOpen(): void

// Close quick open dialog
closeQuickOpen(): void

// Add file to recent history (max 20)
addRecentFile(filePath: string): void
```

#### Context Menu

```typescript
// Open context menu at position with items
openContextMenu(
  position: { x: number; y: number },
  items: ContextMenuItem[]
): void

// Close context menu
closeContextMenu(): void
```

#### Welcome Screen

```typescript
// Show welcome screen
showWelcomeScreen(): void

// Hide welcome screen (temporary)
hideWelcomeScreen(): void

// Dismiss welcome screen (permanent)
dismissWelcomeScreen(): void
```

## Usage Examples

### Example 1: Activity Bar Component

```tsx
import { useUI } from '@/contexts/UIContext';
import { FiFolder, FiSearch, FiGitBranch } from 'react-icons/fi';

export function ActivityBar() {
  const { uiState, setActiveView } = useUI();
  const { activeView } = uiState.activityBar;

  const views = [
    { id: 'explorer', icon: FiFolder, label: 'Explorer' },
    { id: 'search', icon: FiSearch, label: 'Search' },
    { id: 'git', icon: FiGitBranch, label: 'Source Control' },
  ];

  return (
    <div className="w-12 bg-gray-900 flex flex-col">
      {views.map(view => (
        <button
          key={view.id}
          onClick={() => setActiveView(view.id)}
          className={`p-3 ${activeView === view.id ? 'bg-blue-600' : ''}`}
          title={view.label}
        >
          <view.icon size={24} />
        </button>
      ))}
    </div>
  );
}
```

### Example 2: Sidebar with Resize

```tsx
import { useUI } from '@/contexts/UIContext';
import { useState } from 'react';

export function Sidebar() {
  const { uiState, setSidebarWidth } = useUI();
  const { visible, width } = uiState.sidebar;
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = () => setIsResizing(true);
  
  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      setSidebarWidth(e.clientX);
    }
  };

  const handleMouseUp = () => setIsResizing(false);

  if (!visible) return null;

  return (
    <div 
      className="bg-gray-800 relative"
      style={{ width: `${width}px` }}
    >
      <div className="p-4">
        {/* Sidebar content */}
      </div>
      
      <div
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}
```

### Example 3: Command Palette

```tsx
import { useUI } from '@/contexts/UIContext';
import { useEffect } from 'react';

export function CommandPalette() {
  const { uiState, closeCommandPalette, addRecentCommand } = useUI();
  const { isOpen, recentCommands } = uiState.commandPalette;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        openCommandPalette();
      }
      if (e.key === 'Escape' && isOpen) {
        closeCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20">
      <div className="bg-gray-800 w-[600px] rounded-lg shadow-xl">
        <input
          type="text"
          placeholder="Type a command..."
          className="w-full p-4 bg-transparent border-b border-gray-700"
          autoFocus
        />
        
        {recentCommands.length > 0 && (
          <div className="p-2">
            <div className="text-xs text-gray-400 px-2 py-1">Recent</div>
            {recentCommands.map(cmd => (
              <div key={cmd} className="px-2 py-1 hover:bg-gray-700 rounded">
                {cmd}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Example 4: Zen Mode Toggle

```tsx
import { useUI } from '@/contexts/UIContext';

export function ZenModeButton() {
  const { uiState, toggleZenMode } = useUI();
  const { zenMode } = uiState;

  return (
    <button
      onClick={toggleZenMode}
      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
    >
      {zenMode ? 'Exit' : 'Enter'} Zen Mode
    </button>
  );
}
```

### Example 5: Context Menu

```tsx
import { useUI } from '@/contexts/UIContext';

export function FileTreeItem({ file }) {
  const { openContextMenu } = useUI();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    
    openContextMenu(
      { x: e.clientX, y: e.clientY },
      [
        { id: 'open', label: 'Open', action: () => console.log('Open') },
        { id: 'rename', label: 'Rename', shortcut: 'F2', action: () => {} },
        { id: 'delete', label: 'Delete', action: () => {} },
      ]
    );
  };

  return (
    <div onContextMenu={handleContextMenu}>
      {file.name}
    </div>
  );
}
```

## LocalStorage Persistence

The UIContext automatically persists the following state to localStorage:

- Activity bar visibility and active view
- Sidebar visibility, width, and position
- Panel visibility, height, and active view
- Minimap enabled state
- Zen mode state
- Recent commands (last 10)
- Recent files (last 20)
- Welcome screen dismissed state

Transient states (like overlay open/closed) are NOT persisted and reset on page reload.

## Best Practices

1. **Use the hook at component level**: Don't pass UI state through props unnecessarily
2. **Destructure only what you need**: `const { toggleSidebar } = useUI()` instead of `const ui = useUI()`
3. **Combine with other contexts**: UIContext works alongside EditorContext, ThemeContext, etc.
4. **Handle keyboard shortcuts**: Use react-hotkeys-hook for consistent keyboard handling
5. **Respect zen mode**: Check `uiState.zenMode` to conditionally hide UI chrome

## Integration with Existing Contexts

The UIContext is designed to work alongside existing contexts:

```tsx
import { useEditor } from '@/contexts/EditorContext';
import { useUI } from '@/contexts/UIContext';
import { useTheme } from '@/contexts/ThemeContext';

export function EditorLayout() {
  const { openTabs, activeTabId } = useEditor();
  const { uiState, toggleSidebar } = useUI();
  const { theme } = useTheme();

  return (
    <div style={{ backgroundColor: theme.colors.background }}>
      {uiState.sidebar.visible && <Sidebar />}
      <EditorArea tabs={openTabs} activeTab={activeTabId} />
    </div>
  );
}
```

## Testing

The UIContext includes comprehensive unit tests. To run them:

```bash
npm test -- UIContext.test.tsx
```

Test coverage includes:
- All state initialization
- All action functions
- LocalStorage persistence
- State merging on load
- Error handling
