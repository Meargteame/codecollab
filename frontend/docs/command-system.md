# Command System Documentation

## Overview

The Command System provides a centralized registry for all editor commands with keyboard shortcut mapping. It powers the Command Palette and enables consistent keyboard-driven workflows throughout the editor.

## Architecture

### Core Components

1. **CommandContext** - React context providing command registry and execution
2. **useBuiltInCommands** - Hook that registers 30+ built-in commands
3. **useKeyboardShortcuts** - Hook that handles global keyboard shortcuts
4. **Command Interface** - Type-safe command definitions

## Command Interface

```typescript
interface Command {
  id: string;                    // Unique identifier (e.g., 'file.save')
  label: string;                 // Display name (e.g., 'Save File')
  category: string;              // Category for grouping (e.g., 'File')
  keywords: string[];            // Search keywords
  shortcut?: KeyboardShortcut;   // Optional keyboard shortcut
  when?: string;                 // Optional context expression
  action: () => void | Promise<void>; // Command action
}

interface KeyboardShortcut {
  key: string;                   // Key name (e.g., 's', 'Enter')
  modifiers: ('cmd' | 'ctrl' | 'shift' | 'alt')[]; // Modifier keys
  display: string;               // Display string (e.g., '⌘S')
}
```

## Built-in Commands

### File Operations (6 commands)
- `file.new` - New File (⌘N / Ctrl+N)
- `file.open` - Open File (⌘O / Ctrl+O)
- `file.save` - Save (⌘S / Ctrl+S)
- `file.saveAll` - Save All (⌘⇧S / Ctrl+Shift+S)
- `file.close` - Close Editor (⌘W / Ctrl+W)
- `file.closeAll` - Close All Editors (⌘⇧W / Ctrl+Shift+W)

### Edit Operations (8 commands)
- `edit.undo` - Undo (⌘Z / Ctrl+Z)
- `edit.redo` - Redo (⌘⇧Z / Ctrl+Shift+Z)
- `edit.cut` - Cut (⌘X / Ctrl+X)
- `edit.copy` - Copy (⌘C / Ctrl+C)
- `edit.paste` - Paste (⌘V / Ctrl+V)
- `edit.find` - Find (⌘F / Ctrl+F)
- `edit.replace` - Replace (⌘H / Ctrl+H)
- `edit.findGlobal` - Find in Files (⌘⇧F / Ctrl+Shift+F)

### View Operations (7 commands)
- `view.commandPalette` - Show Command Palette (⌘⇧P / Ctrl+Shift+P)
- `view.quickOpen` - Quick Open (⌘P / Ctrl+P)
- `view.toggleSidebar` - Toggle Sidebar (⌘B / Ctrl+B)
- `view.togglePanel` - Toggle Panel (⌘J / Ctrl+J)
- `view.toggleMinimap` - Toggle Minimap
- `view.zenMode` - Toggle Zen Mode (⌘K Z / Ctrl+K Z)
- `view.toggleActivityBar` - Toggle Activity Bar

### Navigation (5 commands)
- `nav.goToFile` - Go to File (⌘P / Ctrl+P)
- `nav.goToLine` - Go to Line (⌘G / Ctrl+G)
- `nav.goToSymbol` - Go to Symbol (⌘⇧O / Ctrl+Shift+O)
- `nav.nextTab` - Next Tab (Ctrl+Tab)
- `nav.previousTab` - Previous Tab (Ctrl+Shift+Tab)

### Terminal (4 commands)
- `terminal.toggle` - Toggle Terminal (Ctrl+`)
- `terminal.new` - New Terminal (⌘⇧` / Ctrl+Shift+`)
- `terminal.split` - Split Terminal
- `terminal.clear` - Clear Terminal

### Editor (4 commands)
- `editor.split` - Split Editor (⌘\ / Ctrl+\)
- `editor.focusFirst` - Focus First Editor Group (⌘1 / Ctrl+1)
- `editor.focusSecond` - Focus Second Editor Group (⌘2 / Ctrl+2)
- `editor.focusThird` - Focus Third Editor Group (⌘3 / Ctrl+3)

**Total: 34 built-in commands**

## Usage

### Basic Setup

Wrap your application with the CommandProvider:

```tsx
import { CommandProvider } from '@/contexts/CommandContext';
import { useBuiltInCommands } from '@/hooks/useBuiltInCommands';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

function App() {
  return (
    <CommandProvider>
      <EditorApp />
    </CommandProvider>
  );
}

function EditorApp() {
  // Register built-in commands
  useBuiltInCommands();
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts();
  
  return <div>Your editor UI</div>;
}
```

### Registering Custom Commands

```tsx
import { useCommands } from '@/contexts/CommandContext';

function MyComponent() {
  const { registerCommand } = useCommands();
  
  useEffect(() => {
    registerCommand({
      id: 'custom.myCommand',
      label: 'My Custom Command',
      category: 'Custom',
      keywords: ['custom', 'my', 'command'],
      shortcut: {
        key: 'm',
        modifiers: ['cmd', 'shift'],
        display: '⌘⇧M',
      },
      action: () => {
        console.log('Custom command executed!');
      },
    });
  }, [registerCommand]);
}
```

### Executing Commands

```tsx
import { useCommands } from '@/contexts/CommandContext';

function MyButton() {
  const { executeCommand } = useCommands();
  
  return (
    <button onClick={() => executeCommand('file.save')}>
      Save File
    </button>
  );
}
```

### Retrieving Commands

```tsx
import { useCommands } from '@/contexts/CommandContext';

function CommandList() {
  const { getAllCommands, getCommandsByCategory } = useCommands();
  
  const allCommands = getAllCommands();
  const fileCommands = getCommandsByCategory('File');
  
  return (
    <div>
      <h2>All Commands: {allCommands.length}</h2>
      <h3>File Commands: {fileCommands.length}</h3>
    </div>
  );
}
```

### Recent Commands

The system automatically tracks recently executed commands:

```tsx
import { useCommands } from '@/contexts/CommandContext';

function RecentCommands() {
  const { recentCommands, getCommand } = useCommands();
  
  return (
    <div>
      <h3>Recent Commands</h3>
      {recentCommands.map(commandId => {
        const command = getCommand(commandId);
        return <div key={commandId}>{command?.label}</div>;
      })}
    </div>
  );
}
```

## Keyboard Shortcuts

### Platform Detection

The system automatically detects the platform and uses appropriate modifiers:
- **macOS**: Cmd (⌘), Ctrl (⌃), Shift (⇧), Alt (⌥)
- **Windows/Linux**: Ctrl, Shift, Alt

### Shortcut Format

Shortcuts are stored in a normalized format:
- Modifiers are sorted alphabetically: `cmd+shift+s`
- Keys are lowercase: `cmd+p`
- Special keys are normalized: `space`, `esc`, `tab`, `up`, `down`, etc.

### Global Keyboard Handler

The `useKeyboardShortcuts` hook installs a global keyboard event listener that:
1. Captures all keydown events
2. Builds a shortcut key from the event
3. Looks up the command in the registry
4. Executes the command if found
5. Prevents default browser behavior

## Command Registry

The registry maintains three data structures:

1. **commands**: `Map<string, Command>` - All registered commands by ID
2. **shortcuts**: `Map<string, string>` - Shortcut key to command ID mapping
3. **categories**: `Map<string, string[]>` - Category to command IDs mapping

### Registry Operations

- **registerCommand(command)** - Add a command to the registry
- **unregisterCommand(commandId)** - Remove a command from the registry
- **executeCommand(commandId)** - Execute a command by ID
- **getCommand(commandId)** - Retrieve a command by ID
- **getCommandsByCategory(category)** - Get all commands in a category
- **getAllCommands()** - Get all registered commands
- **getCommandByShortcut(shortcut)** - Find command by shortcut key

## Persistence

Recent commands are persisted to localStorage:
- **Key**: `editor-recent-commands`
- **Format**: JSON array of command IDs
- **Limit**: 10 most recent commands

## Integration Points

The command system integrates with:

1. **UIContext** - For view and layout commands
2. **EditorContext** - For file and tab commands
3. **Command Palette** - For command search and execution
4. **Context Menus** - For displaying shortcuts
5. **Keyboard Shortcuts Panel** - For viewing and customizing shortcuts

## Future Enhancements

Potential improvements for future iterations:

1. **Context Expressions** - Implement `when` clause evaluation
2. **Command Arguments** - Support parameterized commands
3. **Custom Shortcuts** - Allow users to customize keyboard shortcuts
4. **Shortcut Conflicts** - Detect and warn about conflicting shortcuts
5. **Command History** - Track command execution history
6. **Command Macros** - Chain multiple commands together
7. **Command Aliases** - Support alternative command names
8. **Command Groups** - Organize commands into collapsible groups

## Testing

The command system includes comprehensive unit tests:

```bash
npm test CommandContext.test.tsx
```

Tests cover:
- Command registration and retrieval
- Command execution
- Recent commands tracking
- Shortcut lookup
- Category filtering
- Error handling

## Performance Considerations

- Commands are stored in Maps for O(1) lookup
- Keyboard event handler uses event capturing for priority
- Recent commands are limited to 10 entries
- localStorage writes are debounced via React effects

## Accessibility

- All commands have descriptive labels
- Keyboard shortcuts are clearly displayed
- Commands can be executed via Command Palette (keyboard-only)
- Screen readers can announce command execution

## Requirements Validation

This implementation satisfies:

- **Requirement 3.1**: Command Palette with fuzzy search (command registry foundation)
- **Requirement 3.4**: Keyboard shortcuts display (shortcut interface)
- **Requirement 13.1**: Keyboard shortcuts panel (command registry with shortcuts)
- **Requirement 13.2**: Shortcut customization (extensible registry design)
