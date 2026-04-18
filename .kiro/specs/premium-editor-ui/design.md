# Premium Editor UI Design Document

## Overview

This design transforms the CodeCollab editor from a functional code editor into a premium VS Code-like experience with enhanced UI components, smooth animations, comprehensive keyboard shortcuts, and professional visual polish. The design maintains the existing Monaco Editor foundation while adding 25 major feature enhancements including Activity Bar, enhanced Status Bar, Command Palette, Breadcrumbs, Minimap enhancements, premium theming, comprehensive icon system, and more.

The implementation will be incremental, building on the existing React + Monaco Editor architecture with TypeScript, Tailwind CSS, and the CodeCollab design system (sharp corners, blue accent #3b82f6, Inter + JetBrains Mono fonts).

## Architecture

### High-Level Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      Editor Layout                           │
├──────┬──────────────────────────────────────────────────────┤
│      │                  Top Bar (Optional)                   │
│      ├──────────────────────────────────────────────────────┤
│      │                  Breadcrumbs                          │
│ Act  ├────────┬─────────────────────────────────────────────┤
│ Bar  │        │              Tab Bar                         │
│      │ Side   ├─────────────────────────────────────────────┤
│      │ bar    │                                       Mini   │
│      │        │         Editor Content                map    │
│      │        │                                              │
│      │        ├──────────────────────────────────────────────┤
│      │        │              Panel (Terminal)                │
├──────┴────────┴──────────────────────────────────────────────┤
│                      Status Bar                              │
└──────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
EditorLayout
├── ActivityBar
├── Sidebar
│   ├── FileTreeView
│   ├── SearchView
│   ├── GitView
│   └── CollaborationView
├── EditorArea
│   ├── Breadcrumbs
│   ├── TabBar
│   ├── EditorGroup (supports splits)
│   │   └── MonacoEditor + Minimap
│   └── Panel
│       ├── TerminalView
│       ├── OutputView
│       └── ProblemsView
├── StatusBar
├── CommandPalette (overlay)
├── QuickOpen (overlay)
├── ContextMenu (overlay)
├── NotificationStack (overlay)
└── WelcomeScreen (conditional)
```

### State Management Architecture

The design extends the existing EditorContext with additional contexts for UI state:

1. **EditorContext** (existing, enhanced): File tree, tabs, active file, content
2. **UIContext** (new): Activity bar state, sidebar visibility, panel state, layout preferences
3. **ThemeContext** (new): Theme settings, icon set, color customization
4. **CommandContext** (new): Command registry, keyboard shortcuts, command history
5. **NotificationContext** (new): Notification queue, toast management

### Technology Stack

- **React 18+**: Component framework
- **TypeScript**: Type safety
- **Monaco Editor**: Core editor engine
- **Tailwind CSS**: Styling with custom design tokens
- **Framer Motion**: Smooth animations (60fps)
- **Zustand** (optional): Lightweight state management for UI state
- **react-hotkeys-hook**: Keyboard shortcut management
- **react-icons**: Comprehensive icon library
- **@vscode/codicons**: VS Code icon set

## Components and Interfaces

### 1. ActivityBar Component

**Purpose**: Vertical navigation bar for switching between major views

**Interface**:
```typescript
interface ActivityBarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  customActions?: ActivityBarAction[];
}

type ViewType = 'explorer' | 'search' | 'git' | 'extensions' | 'collaboration';

interface ActivityBarAction {
  id: string;
  icon: ReactNode;
  label: string;
  badge?: number;
  onClick: () => void;
}
```

**Key Features**:
- 48px fixed width
- Icon-only buttons with tooltips
- Active indicator (2px blue bar on left edge)
- Keyboard navigation support
- Badge support for notifications

### 2. Enhanced StatusBar Component

**Purpose**: Bottom bar showing editor state and contextual information

**Interface**:
```typescript
interface StatusBarProps {
  items: StatusBarItem[];
  onItemClick: (itemId: string) => void;
}

interface StatusBarItem {
  id: string;
  position: 'left' | 'right';
  content: ReactNode;
  tooltip?: string;
  onClick?: () => void;
  priority: number; // for responsive hiding
}

interface EditorStatus {
  branch: string;
  cursorPosition: { line: number; column: number };
  encoding: string;
  lineEnding: 'LF' | 'CRLF';
  language: string;
  indentation: { type: 'spaces' | 'tabs'; size: number };
  errors: number;
  warnings: number;
  collaborators: number;
}
```

**Key Features**:
- 24px fixed height
- Clickable segments for quick settings
- Real-time cursor position updates
- Git branch indicator
- Error/warning counts with colors
- Collaborator presence indicators

### 3. CommandPalette Component

**Purpose**: Fuzzy search overlay for executing commands

**Interface**:
```typescript
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
  recentCommands: string[];
}

interface Command {
  id: string;
  label: string;
  category: string;
  keywords: string[];
  shortcut?: KeyboardShortcut;
  action: () => void | Promise<void>;
}

interface KeyboardShortcut {
  key: string;
  modifiers: ('cmd' | 'ctrl' | 'shift' | 'alt')[];
  display: string; // e.g., "⌘⇧P"
}
```

**Key Features**:
- Centered overlay (600px width)
- Fuzzy search with <50ms response
- Category grouping
- Recent commands prioritization
- Keyboard navigation (arrows, enter, escape)

### 4. QuickOpen Component

**Purpose**: Fast file navigation with fuzzy search

**Interface**:
```typescript
interface QuickOpenProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileNode[];
  recentFiles: string[];
  onFileSelect: (file: FileNode) => void;
}

interface FileSearchResult {
  file: FileNode;
  matchScore: number;
  matchedSegments: [number, number][]; // for highlighting
}
```

**Key Features**:
- Fuzzy file path matching
- File type icons
- Recent files when empty
- Preview on hover (500ms delay)
- Path highlighting for matches

### 5. Breadcrumbs Component

**Purpose**: File path navigation above editor

**Interface**:
```typescript
interface BreadcrumbsProps {
  filePath: string;
  fileTree: FileNode[];
  onNavigate: (path: string) => void;
}

interface BreadcrumbSegment {
  name: string;
  path: string;
  siblings: FileNode[];
}
```

**Key Features**:
- 28px fixed height
- Clickable path segments
- Dropdown showing siblings on click
- Path truncation with ellipsis
- File type icon for current file

### 6. Enhanced FileTree Component

**Purpose**: Hierarchical file explorer with rich interactions

**Interface**:
```typescript
interface FileTreeProps {
  files: FileNode[];
  activeFileId: string | null;
  expandedFolders: Set<string>;
  gitStatus: Map<string, GitStatus>;
  onFileSelect: (file: FileNode) => void;
  onFileRename: (fileId: string, newName: string) => void;
  onFileMove: (fileId: string, targetFolderId: string) => void;
  onContextMenu: (file: FileNode, position: { x: number; y: number }) => void;
}

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  gitStatus?: GitStatus;
  size?: number;
  modified?: Date;
}

type GitStatus = 'modified' | 'added' | 'deleted' | 'untracked' | 'conflict';

interface FileIcon {
  type: string; // file extension or folder name
  icon: ReactNode;
  color: string;
}
```

**Key Features**:
- Comprehensive icon set (50+ file types)
- Git status indicators
- Drag-and-drop support
- Inline rename (F2)
- Context menu on right-click
- Multi-select (Cmd+Click, Shift+Click)
- Hover tooltips with metadata

### 7. Premium TabBar Component

**Purpose**: Enhanced tab management with drag-and-drop

**Interface**:
```typescript
interface TabBarProps {
  tabs: EditorTab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabMove: (tabId: string, newIndex: number) => void;
  onTabSplit: (tabId: string, direction: 'horizontal' | 'vertical') => void;
}

interface EditorTab {
  id: string;
  fileId: string;
  fileName: string;
  filePath: string;
  isDirty: boolean;
  content: string;
  icon: ReactNode;
  gitStatus?: GitStatus;
}
```

**Key Features**:
- File type icons
- Dirty indicator (colored dot)
- Close button on hover
- Drag-to-reorder
- Split editor button
- Scroll arrows when overflow
- Middle-click to close
- Tab preview on hover (600ms)

### 8. Enhanced Terminal Component

**Purpose**: Multi-instance terminal with tabs and splits

**Interface**:
```typescript
interface TerminalPanelProps {
  terminals: TerminalInstance[];
  activeTerminalId: string | null;
  height: number;
  onResize: (height: number) => void;
  onClose: () => void;
  onTerminalCreate: (shell: ShellType) => void;
  onTerminalClose: (terminalId: string) => void;
  onTerminalSplit: (terminalId: string) => void;
}

interface TerminalInstance {
  id: string;
  title: string;
  shell: ShellType;
  cwd: string;
  history: string[];
}

type ShellType = 'bash' | 'zsh' | 'powershell' | 'cmd' | 'fish';
```

**Key Features**:
- Multiple terminal tabs
- Shell type icons
- Split terminal view
- Persistent history
- Theme matching
- Shell selector dropdown
- Resizable with drag handle

### 9. Minimap Enhancements

**Purpose**: Enhanced code overview with syntax highlighting

**Interface**:
```typescript
interface MinimapConfig {
  enabled: boolean;
  showSlider: 'always' | 'mouseover';
  side: 'right' | 'left';
  maxColumn: number;
  renderCharacters: boolean;
  scale: number;
}

interface MinimapDecorations {
  gitChanges: MinimapDecoration[];
  searchMatches: MinimapDecoration[];
  errors: MinimapDecoration[];
  warnings: MinimapDecoration[];
}

interface MinimapDecoration {
  line: number;
  color: string;
  type: 'line' | 'block';
}
```

**Key Features**:
- Syntax highlighting
- Viewport overlay
- Click-to-scroll
- Drag-to-scroll
- Git change indicators
- Toggleable via command palette
- Responsive scaling

### 10. Theme System

**Purpose**: Comprehensive theming with design tokens

**Interface**:
```typescript
interface Theme {
  id: string;
  name: string;
  type: 'dark' | 'light';
  colors: ThemeColors;
  syntax: SyntaxColors;
  ui: UIColors;
}

interface ThemeColors {
  // Editor
  background: string;
  foreground: string;
  selection: string;
  lineHighlight: string;
  cursor: string;
  
  // UI
  activityBar: string;
  sideBar: string;
  statusBar: string;
  panel: string;
  
  // Accents
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface SyntaxColors {
  keyword: string;
  string: string;
  number: string;
  comment: string;
  function: string;
  variable: string;
  type: string;
  operator: string;
}

interface UIColors {
  border: string;
  hover: string;
  active: string;
  focus: string;
  disabled: string;
  shadow: string;
}
```

**Key Features**:
- WCAG AA contrast compliance
- Subtle gradients and shadows
- Consistent spacing (4px grid)
- 150ms transition duration
- Semi-transparent overlays
- State-specific colors (hover, active, focus, disabled)

### 11. Icon System

**Purpose**: Comprehensive file and UI icon library

**Interface**:
```typescript
interface IconConfig {
  fileIcons: Map<string, IconDefinition>;
  folderIcons: Map<string, IconDefinition>;
  uiIcons: Map<string, IconDefinition>;
}

interface IconDefinition {
  component: ReactNode;
  color: string;
  size: number;
  variants?: {
    light?: ReactNode;
    dark?: ReactNode;
  };
}

// File type mappings
const FILE_ICON_MAP: Record<string, string> = {
  'tsx': 'react-typescript',
  'ts': 'typescript',
  'jsx': 'react',
  'js': 'javascript',
  'json': 'json',
  'md': 'markdown',
  'html': 'html',
  'css': 'css',
  'scss': 'sass',
  'py': 'python',
  'go': 'go',
  'rs': 'rust',
  // ... 50+ mappings
};

// Folder name mappings
const FOLDER_ICON_MAP: Record<string, string> = {
  'src': 'folder-src',
  'test': 'folder-test',
  'public': 'folder-public',
  'components': 'folder-components',
  'utils': 'folder-utils',
  // ... special folder mappings
};
```

**Key Features**:
- 50+ file type icons
- Special folder icons
- Consistent 16x16px sizing
- Color-coded by type
- Light/dark variants
- Crisp rendering at all zoom levels

### 12. ContextMenu Component

**Purpose**: Right-click context menus throughout the UI

**Interface**:
```typescript
interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
}

interface ContextMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  submenu?: ContextMenuItem[];
  action?: () => void;
}
```

**Key Features**:
- Position-aware rendering
- Keyboard shortcuts display
- Nested submenus (300ms hover delay)
- Disabled state styling
- Separator support
- Click-outside to close

### 13. SearchWidget Component

**Purpose**: Inline and global search functionality

**Interface**:
```typescript
interface SearchWidgetProps {
  mode: 'inline' | 'global';
  onSearch: (query: SearchQuery) => void;
  onReplace: (replacement: string, replaceAll: boolean) => void;
}

interface SearchQuery {
  text: string;
  regex: boolean;
  caseSensitive: boolean;
  wholeWord: boolean;
  filesInclude?: string;
  filesExclude?: string;
}

interface SearchResult {
  fileId: string;
  filePath: string;
  matches: SearchMatch[];
}

interface SearchMatch {
  line: number;
  column: number;
  length: number;
  lineText: string;
}
```

**Key Features**:
- Regex support
- Case-sensitive toggle
- Whole-word matching
- Match count display
- Replace with preview
- File filtering for global search
- Results grouped by file

### 14. NotificationSystem Component

**Purpose**: Non-intrusive toast notifications

**Interface**:
```typescript
interface NotificationProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  actions?: NotificationAction[];
  autoDismiss: boolean;
  duration: number; // ms
}

interface NotificationAction {
  label: string;
  action: () => void;
}
```

**Key Features**:
- Bottom-right positioning
- Type-specific colors
- Auto-dismiss after 5s
- Stack limit of 3
- Action buttons
- Slide-up animation (200ms)
- Dismissible with X button

### 15. SettingsPanel Component

**Purpose**: Comprehensive editor configuration

**Interface**:
```typescript
interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EditorSettings;
  onSettingChange: (key: string, value: any) => void;
}

interface EditorSettings {
  editor: EditorConfig;
  theme: ThemeConfig;
  keyboard: KeyboardConfig;
  extensions: ExtensionConfig;
}

interface SettingDefinition {
  key: string;
  label: string;
  description: string;
  type: 'boolean' | 'number' | 'string' | 'select' | 'color';
  default: any;
  options?: any[];
  validation?: (value: any) => boolean;
}
```

**Key Features**:
- Category organization
- Search filtering
- UI and JSON editing modes
- Setting descriptions
- Default value display
- Input validation
- Modified indicator with reset
- Cloud sync support

## Data Models

### EditorState

```typescript
interface EditorState {
  // File system
  fileTree: FileNode[];
  openTabs: EditorTab[];
  activeTabId: string | null;
  
  // Layout
  layout: LayoutState;
  
  // UI state
  ui: UIState;
  
  // Settings
  settings: EditorSettings;
  
  // Collaboration
  collaboration: CollaborationState;
}

interface LayoutState {
  activityBar: {
    visible: boolean;
    activeView: ViewType;
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
  editorGroups: EditorGroup[];
  minimap: {
    enabled: boolean;
  };
  zenMode: boolean;
}

interface UIState {
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
  notifications: Notification[];
  welcomeScreen: {
    visible: boolean;
    dismissed: boolean;
  };
}

interface EditorGroup {
  id: string;
  tabs: string[]; // tab IDs
  activeTabId: string | null;
  split?: {
    direction: 'horizontal' | 'vertical';
    groups: [EditorGroup, EditorGroup];
    ratio: number; // 0-1
  };
}
```

### Command Registry

```typescript
interface CommandRegistry {
  commands: Map<string, Command>;
  shortcuts: Map<string, string>; // shortcut -> command ID
  categories: Map<string, string[]>; // category -> command IDs
}

interface Command {
  id: string;
  label: string;
  category: string;
  keywords: string[];
  shortcut?: KeyboardShortcut;
  when?: string; // context expression
  action: CommandAction;
}

type CommandAction = () => void | Promise<void>;

// Built-in commands
const CORE_COMMANDS = {
  // File operations
  'file.new': 'New File',
  'file.open': 'Open File',
  'file.save': 'Save',
  'file.saveAll': 'Save All',
  'file.close': 'Close Editor',
  'file.closeAll': 'Close All Editors',
  
  // Edit operations
  'edit.undo': 'Undo',
  'edit.redo': 'Redo',
  'edit.cut': 'Cut',
  'edit.copy': 'Copy',
  'edit.paste': 'Paste',
  'edit.find': 'Find',
  'edit.replace': 'Replace',
  
  // View operations
  'view.commandPalette': 'Show Command Palette',
  'view.quickOpen': 'Quick Open',
  'view.toggleSidebar': 'Toggle Sidebar',
  'view.togglePanel': 'Toggle Panel',
  'view.toggleMinimap': 'Toggle Minimap',
  'view.zenMode': 'Toggle Zen Mode',
  
  // Navigation
  'nav.goToFile': 'Go to File',
  'nav.goToLine': 'Go to Line',
  'nav.goToSymbol': 'Go to Symbol',
  'nav.nextTab': 'Next Tab',
  'nav.previousTab': 'Previous Tab',
  
  // Terminal
  'terminal.new': 'New Terminal',
  'terminal.split': 'Split Terminal',
  'terminal.clear': 'Clear Terminal',
  
  // Editor
  'editor.split': 'Split Editor',
  'editor.focusNext': 'Focus Next Editor',
  'editor.focusPrevious': 'Focus Previous Editor',
};
```

### Keyboard Shortcuts

```typescript
interface KeyboardShortcutMap {
  // File operations
  'cmd+n': 'file.new',
  'cmd+o': 'file.open',
  'cmd+s': 'file.save',
  'cmd+shift+s': 'file.saveAll',
  'cmd+w': 'file.close',
  'cmd+shift+w': 'file.closeAll',
  
  // Edit operations
  'cmd+z': 'edit.undo',
  'cmd+shift+z': 'edit.redo',
  'cmd+x': 'edit.cut',
  'cmd+c': 'edit.copy',
  'cmd+v': 'edit.paste',
  'cmd+f': 'edit.find',
  'cmd+shift+f': 'edit.findGlobal',
  'cmd+h': 'edit.replace',
  
  // View operations
  'cmd+shift+p': 'view.commandPalette',
  'cmd+p': 'view.quickOpen',
  'cmd+b': 'view.toggleSidebar',
  'cmd+j': 'view.togglePanel',
  'cmd+k z': 'view.zenMode',
  
  // Navigation
  'cmd+g': 'nav.goToLine',
  'cmd+shift+o': 'nav.goToSymbol',
  'ctrl+tab': 'nav.nextTab',
  'ctrl+shift+tab': 'nav.previousTab',
  
  // Terminal
  'ctrl+`': 'terminal.toggle',
  'cmd+shift+`': 'terminal.new',
  
  // Editor
  'cmd+\\': 'editor.split',
  'cmd+1': 'editor.focusFirst',
  'cmd+2': 'editor.focusSecond',
  'cmd+3': 'editor.focusThird',
}
```

### Git Integration Data

```typescript
interface GitState {
  repository: GitRepository | null;
  status: GitFileStatus[];
  branch: string;
  changes: GitChange[];
}

interface GitRepository {
  path: string;
  remote: string;
  branches: string[];
}

interface GitFileStatus {
  path: string;
  status: GitStatus;
  staged: boolean;
}

interface GitChange {
  fileId: string;
  hunks: GitHunk[];
}

interface GitHunk {
  startLine: number;
  endLine: number;
  type: 'added' | 'modified' | 'deleted';
  oldContent?: string;
  newContent?: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

