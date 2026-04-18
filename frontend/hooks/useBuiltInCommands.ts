import { useEffect } from 'react';
import { useCommands, Command, KeyboardShortcut } from '@/contexts/CommandContext';
import { useUI } from '@/contexts/UIContext';
import { useEditor } from '@/contexts/EditorContext';

// Helper to create keyboard shortcuts
function createShortcut(
  key: string,
  modifiers: ('cmd' | 'ctrl' | 'shift' | 'alt')[],
  isMac: boolean = true
): KeyboardShortcut {
  const displayModifiers = modifiers.map(mod => {
    if (mod === 'cmd') return isMac ? '⌘' : 'Ctrl';
    if (mod === 'ctrl') return isMac ? '⌃' : 'Ctrl';
    if (mod === 'shift') return '⇧';
    if (mod === 'alt') return isMac ? '⌥' : 'Alt';
    return mod;
  });
  
  const displayKey = key.length === 1 ? key.toUpperCase() : key;
  const display = [...displayModifiers, displayKey].join('');
  
  return { key, modifiers, display };
}

export function useBuiltInCommands() {
  const { registerCommand } = useCommands();
  const ui = useUI();
  const editor = useEditor();

  useEffect(() => {
    const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdKey = isMac ? 'cmd' : 'ctrl';

    // File operations
    const fileCommands: Command[] = [
      {
        id: 'file.new',
        label: 'New File',
        category: 'File',
        keywords: ['new', 'create', 'file'],
        shortcut: createShortcut('n', [cmdKey], isMac),
        action: () => {
          console.log('New file');
          // TODO: Implement new file creation
        },
      },
      {
        id: 'file.open',
        label: 'Open File',
        category: 'File',
        keywords: ['open', 'file'],
        shortcut: createShortcut('o', [cmdKey], isMac),
        action: () => {
          console.log('Open file');
          ui.openQuickOpen();
        },
      },
      {
        id: 'file.save',
        label: 'Save',
        category: 'File',
        keywords: ['save', 'file'],
        shortcut: createShortcut('s', [cmdKey], isMac),
        action: () => {
          console.log('Save file');
          // TODO: Implement save
        },
      },
      {
        id: 'file.saveAll',
        label: 'Save All',
        category: 'File',
        keywords: ['save', 'all', 'files'],
        shortcut: createShortcut('s', [cmdKey, 'shift'], isMac),
        action: () => {
          console.log('Save all files');
          // TODO: Implement save all
        },
      },
      {
        id: 'file.close',
        label: 'Close Editor',
        category: 'File',
        keywords: ['close', 'editor', 'tab'],
        shortcut: createShortcut('w', [cmdKey], isMac),
        action: () => {
          if (editor.activeTabId) {
            editor.closeTab(editor.activeTabId);
          }
        },
      },
      {
        id: 'file.closeAll',
        label: 'Close All Editors',
        category: 'File',
        keywords: ['close', 'all', 'editors', 'tabs'],
        shortcut: createShortcut('w', [cmdKey, 'shift'], isMac),
        action: () => {
          editor.openTabs.forEach(tab => editor.closeTab(tab.id));
        },
      },
    ];

    // Edit operations
    const editCommands: Command[] = [
      {
        id: 'edit.undo',
        label: 'Undo',
        category: 'Edit',
        keywords: ['undo'],
        shortcut: createShortcut('z', [cmdKey], isMac),
        action: () => {
          document.execCommand('undo');
        },
      },
      {
        id: 'edit.redo',
        label: 'Redo',
        category: 'Edit',
        keywords: ['redo'],
        shortcut: createShortcut('z', [cmdKey, 'shift'], isMac),
        action: () => {
          document.execCommand('redo');
        },
      },
      {
        id: 'edit.cut',
        label: 'Cut',
        category: 'Edit',
        keywords: ['cut'],
        shortcut: createShortcut('x', [cmdKey], isMac),
        action: () => {
          document.execCommand('cut');
        },
      },
      {
        id: 'edit.copy',
        label: 'Copy',
        category: 'Edit',
        keywords: ['copy'],
        shortcut: createShortcut('c', [cmdKey], isMac),
        action: () => {
          document.execCommand('copy');
        },
      },
      {
        id: 'edit.paste',
        label: 'Paste',
        category: 'Edit',
        keywords: ['paste'],
        shortcut: createShortcut('v', [cmdKey], isMac),
        action: () => {
          document.execCommand('paste');
        },
      },
      {
        id: 'edit.find',
        label: 'Find',
        category: 'Edit',
        keywords: ['find', 'search'],
        shortcut: createShortcut('f', [cmdKey], isMac),
        action: () => {
          console.log('Find in file');
          // TODO: Implement find widget
        },
      },
      {
        id: 'edit.replace',
        label: 'Replace',
        category: 'Edit',
        keywords: ['replace', 'find'],
        shortcut: createShortcut('h', [cmdKey], isMac),
        action: () => {
          console.log('Replace in file');
          // TODO: Implement replace widget
        },
      },
      {
        id: 'edit.findGlobal',
        label: 'Find in Files',
        category: 'Edit',
        keywords: ['find', 'search', 'global', 'files'],
        shortcut: createShortcut('f', [cmdKey, 'shift'], isMac),
        action: () => {
          ui.setActiveView('search');
        },
      },
    ];

    // View operations
    const viewCommands: Command[] = [
      {
        id: 'view.commandPalette',
        label: 'Show Command Palette',
        category: 'View',
        keywords: ['command', 'palette', 'show'],
        shortcut: createShortcut('p', [cmdKey, 'shift'], isMac),
        action: () => {
          ui.openCommandPalette();
        },
      },
      {
        id: 'view.quickOpen',
        label: 'Quick Open',
        category: 'View',
        keywords: ['quick', 'open', 'file'],
        shortcut: createShortcut('p', [cmdKey], isMac),
        action: () => {
          ui.openQuickOpen();
        },
      },
      {
        id: 'view.toggleSidebar',
        label: 'Toggle Sidebar',
        category: 'View',
        keywords: ['toggle', 'sidebar', 'hide', 'show'],
        shortcut: createShortcut('b', [cmdKey], isMac),
        action: () => {
          ui.toggleSidebar();
        },
      },
      {
        id: 'view.togglePanel',
        label: 'Toggle Panel',
        category: 'View',
        keywords: ['toggle', 'panel', 'terminal', 'hide', 'show'],
        shortcut: createShortcut('j', [cmdKey], isMac),
        action: () => {
          ui.togglePanel();
        },
      },
      {
        id: 'view.toggleMinimap',
        label: 'Toggle Minimap',
        category: 'View',
        keywords: ['toggle', 'minimap', 'hide', 'show'],
        action: () => {
          ui.toggleMinimap();
        },
      },
      {
        id: 'view.zenMode',
        label: 'Toggle Zen Mode',
        category: 'View',
        keywords: ['zen', 'mode', 'focus', 'distraction', 'free'],
        shortcut: createShortcut('k z', [cmdKey], isMac),
        action: () => {
          ui.toggleZenMode();
        },
      },
      {
        id: 'view.toggleActivityBar',
        label: 'Toggle Activity Bar',
        category: 'View',
        keywords: ['toggle', 'activity', 'bar', 'hide', 'show'],
        action: () => {
          ui.toggleActivityBar();
        },
      },
    ];

    // Navigation commands
    const navigationCommands: Command[] = [
      {
        id: 'nav.goToFile',
        label: 'Go to File',
        category: 'Navigation',
        keywords: ['go', 'file', 'navigate'],
        shortcut: createShortcut('p', [cmdKey], isMac),
        action: () => {
          ui.openQuickOpen();
        },
      },
      {
        id: 'nav.goToLine',
        label: 'Go to Line',
        category: 'Navigation',
        keywords: ['go', 'line', 'navigate'],
        shortcut: createShortcut('g', [cmdKey], isMac),
        action: () => {
          console.log('Go to line');
          // TODO: Implement go to line dialog
        },
      },
      {
        id: 'nav.goToSymbol',
        label: 'Go to Symbol',
        category: 'Navigation',
        keywords: ['go', 'symbol', 'navigate', 'function', 'class'],
        shortcut: createShortcut('o', [cmdKey, 'shift'], isMac),
        action: () => {
          console.log('Go to symbol');
          // TODO: Implement symbol search
        },
      },
      {
        id: 'nav.nextTab',
        label: 'Next Tab',
        category: 'Navigation',
        keywords: ['next', 'tab', 'navigate'],
        shortcut: createShortcut('Tab', ['ctrl'], isMac),
        action: () => {
          const tabs = editor.openTabs;
          const currentIndex = tabs.findIndex(t => t.id === editor.activeTabId);
          if (currentIndex >= 0 && tabs.length > 1) {
            const nextIndex = (currentIndex + 1) % tabs.length;
            editor.setActiveTab(tabs[nextIndex].id);
          }
        },
      },
      {
        id: 'nav.previousTab',
        label: 'Previous Tab',
        category: 'Navigation',
        keywords: ['previous', 'tab', 'navigate'],
        shortcut: createShortcut('Tab', ['ctrl', 'shift'], isMac),
        action: () => {
          const tabs = editor.openTabs;
          const currentIndex = tabs.findIndex(t => t.id === editor.activeTabId);
          if (currentIndex >= 0 && tabs.length > 1) {
            const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            editor.setActiveTab(tabs[prevIndex].id);
          }
        },
      },
    ];

    // Terminal commands
    const terminalCommands: Command[] = [
      {
        id: 'terminal.toggle',
        label: 'Toggle Terminal',
        category: 'Terminal',
        keywords: ['toggle', 'terminal', 'show', 'hide'],
        shortcut: createShortcut('`', ['ctrl'], isMac),
        action: () => {
          editor.setTerminalOpen(!editor.terminalOpen);
        },
      },
      {
        id: 'terminal.new',
        label: 'New Terminal',
        category: 'Terminal',
        keywords: ['new', 'terminal', 'create'],
        shortcut: createShortcut('`', [cmdKey, 'shift'], isMac),
        action: () => {
          console.log('New terminal');
          editor.setTerminalOpen(true);
          // TODO: Create new terminal instance
        },
      },
      {
        id: 'terminal.split',
        label: 'Split Terminal',
        category: 'Terminal',
        keywords: ['split', 'terminal'],
        action: () => {
          console.log('Split terminal');
          // TODO: Implement terminal split
        },
      },
      {
        id: 'terminal.clear',
        label: 'Clear Terminal',
        category: 'Terminal',
        keywords: ['clear', 'terminal', 'reset'],
        action: () => {
          console.log('Clear terminal');
          // TODO: Implement terminal clear
        },
      },
    ];

    // Editor commands
    const editorCommands: Command[] = [
      {
        id: 'editor.split',
        label: 'Split Editor',
        category: 'Editor',
        keywords: ['split', 'editor', 'pane'],
        shortcut: createShortcut('\\', [cmdKey], isMac),
        action: () => {
          console.log('Split editor');
          // TODO: Implement editor split
        },
      },
      {
        id: 'editor.focusFirst',
        label: 'Focus First Editor Group',
        category: 'Editor',
        keywords: ['focus', 'first', 'editor', 'group'],
        shortcut: createShortcut('1', [cmdKey], isMac),
        action: () => {
          console.log('Focus first editor group');
          // TODO: Implement editor group focus
        },
      },
      {
        id: 'editor.focusSecond',
        label: 'Focus Second Editor Group',
        category: 'Editor',
        keywords: ['focus', 'second', 'editor', 'group'],
        shortcut: createShortcut('2', [cmdKey], isMac),
        action: () => {
          console.log('Focus second editor group');
          // TODO: Implement editor group focus
        },
      },
      {
        id: 'editor.focusThird',
        label: 'Focus Third Editor Group',
        category: 'Editor',
        keywords: ['focus', 'third', 'editor', 'group'],
        shortcut: createShortcut('3', [cmdKey], isMac),
        action: () => {
          console.log('Focus third editor group');
          // TODO: Implement editor group focus
        },
      },
    ];

    // Register all commands
    const allCommands = [
      ...fileCommands,
      ...editCommands,
      ...viewCommands,
      ...navigationCommands,
      ...terminalCommands,
      ...editorCommands,
    ];

    allCommands.forEach(command => registerCommand(command));

    // Cleanup: unregister commands on unmount
    return () => {
      // Note: In a real implementation, we might want to keep commands registered
      // This is just for demonstration of the cleanup pattern
    };
  }, [registerCommand, ui, editor]);
}
