# Command System Quick Reference

## Setup

```tsx
import { CommandProvider } from '@/contexts/CommandContext';
import { useBuiltInCommands } from '@/hooks/useBuiltInCommands';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

function App() {
  return (
    <CommandProvider>
      <YourApp />
    </CommandProvider>
  );
}

function YourApp() {
  useBuiltInCommands();        // Register 34 built-in commands
  useKeyboardShortcuts();      // Enable keyboard shortcuts
  return <div>...</div>;
}
```

## Register a Command

```tsx
import { useCommands } from '@/contexts/CommandContext';

const { registerCommand } = useCommands();

registerCommand({
  id: 'my.command',
  label: 'My Command',
  category: 'Custom',
  keywords: ['my', 'command'],
  shortcut: {
    key: 'm',
    modifiers: ['cmd', 'shift'],
    display: '⌘⇧M',
  },
  action: () => {
    console.log('Command executed!');
  },
});
```

## Execute a Command

```tsx
const { executeCommand } = useCommands();

executeCommand('file.save');
```

## Get Commands

```tsx
const { getAllCommands, getCommandsByCategory, getCommand } = useCommands();

const all = getAllCommands();                    // All commands
const fileCommands = getCommandsByCategory('File'); // Commands in category
const saveCommand = getCommand('file.save');     // Specific command
```

## Recent Commands

```tsx
const { recentCommands, getCommand } = useCommands();

recentCommands.forEach(id => {
  const cmd = getCommand(id);
  console.log(cmd?.label);
});
```

## Built-in Command Categories

- **File** (6): new, open, save, saveAll, close, closeAll
- **Edit** (8): undo, redo, cut, copy, paste, find, replace, findGlobal
- **View** (7): commandPalette, quickOpen, toggleSidebar, togglePanel, toggleMinimap, zenMode, toggleActivityBar
- **Navigation** (5): goToFile, goToLine, goToSymbol, nextTab, previousTab
- **Terminal** (4): toggle, new, split, clear
- **Editor** (4): split, focusFirst, focusSecond, focusThird

## Common Shortcuts

| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| Command Palette | ⌘⇧P | Ctrl+Shift+P |
| Quick Open | ⌘P | Ctrl+P |
| Save | ⌘S | Ctrl+S |
| Find | ⌘F | Ctrl+F |
| Toggle Sidebar | ⌘B | Ctrl+B |
| Toggle Panel | ⌘J | Ctrl+J |
| Toggle Terminal | Ctrl+` | Ctrl+` |
| Split Editor | ⌘\ | Ctrl+\ |

## API Reference

### CommandContext

```typescript
interface CommandContextType {
  registry: CommandRegistry;
  registerCommand: (command: Command) => void;
  unregisterCommand: (commandId: string) => void;
  executeCommand: (commandId: string) => Promise<void>;
  getCommand: (commandId: string) => Command | undefined;
  getCommandsByCategory: (category: string) => Command[];
  getAllCommands: () => Command[];
  getCommandByShortcut: (shortcut: string) => Command | undefined;
  recentCommands: string[];
  addRecentCommand: (commandId: string) => void;
}
```

### Command Interface

```typescript
interface Command {
  id: string;
  label: string;
  category: string;
  keywords: string[];
  shortcut?: KeyboardShortcut;
  when?: string;
  action: () => void | Promise<void>;
}

interface KeyboardShortcut {
  key: string;
  modifiers: ('cmd' | 'ctrl' | 'shift' | 'alt')[];
  display: string;
}
```

## Testing

```bash
npm test CommandContext.test.tsx
```

## Documentation

- Full docs: `frontend/docs/command-system.md`
- Task summary: `frontend/docs/task-1.4-summary.md`
- Example: `frontend/components/CommandSystemExample.tsx`
