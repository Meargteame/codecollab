'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// Keyboard shortcut interface
export interface KeyboardShortcut {
  key: string;
  modifiers: ('cmd' | 'ctrl' | 'shift' | 'alt')[];
  display: string;
}

// Command interface
export interface Command {
  id: string;
  label: string;
  category: string;
  keywords: string[];
  shortcut?: KeyboardShortcut;
  when?: string;
  action: () => void | Promise<void>;
}

// Command registry data structure
interface CommandRegistry {
  commands: Map<string, Command>;
  shortcuts: Map<string, string>;
  categories: Map<string, string[]>;
}

// Context type
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

const CommandContext = createContext<CommandContextType | undefined>(undefined);

const RECENT_COMMANDS_KEY = 'editor-recent-commands';
const MAX_RECENT_COMMANDS = 10;

export function CommandProvider({ children }: { children: ReactNode }) {
  const [registry, setRegistry] = useState<CommandRegistry>({
    commands: new Map(),
    shortcuts: new Map(),
    categories: new Map(),
  });

  const [recentCommands, setRecentCommands] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(RECENT_COMMANDS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save recent commands to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(RECENT_COMMANDS_KEY, JSON.stringify(recentCommands));
    }
  }, [recentCommands]);

  const registerCommand = useCallback((command: Command) => {
    setRegistry(prev => {
      const newCommands = new Map(prev.commands);
      const newShortcuts = new Map(prev.shortcuts);
      const newCategories = new Map(prev.categories);

      // Add command
      newCommands.set(command.id, command);

      // Add shortcut mapping
      if (command.shortcut) {
        const shortcutKey = formatShortcutKey(command.shortcut);
        newShortcuts.set(shortcutKey, command.id);
      }

      // Add to category
      const categoryCommands = newCategories.get(command.category) || [];
      if (!categoryCommands.includes(command.id)) {
        newCategories.set(command.category, [...categoryCommands, command.id]);
      }

      return {
        commands: newCommands,
        shortcuts: newShortcuts,
        categories: newCategories,
      };
    });
  }, []);

  const unregisterCommand = useCallback((commandId: string) => {
    setRegistry(prev => {
      const command = prev.commands.get(commandId);
      if (!command) return prev;

      const newCommands = new Map(prev.commands);
      const newShortcuts = new Map(prev.shortcuts);
      const newCategories = new Map(prev.categories);

      // Remove command
      newCommands.delete(commandId);

      // Remove shortcut
      if (command.shortcut) {
        const shortcutKey = formatShortcutKey(command.shortcut);
        newShortcuts.delete(shortcutKey);
      }

      // Remove from category
      const categoryCommands = newCategories.get(command.category);
      if (categoryCommands) {
        newCategories.set(
          command.category,
          categoryCommands.filter(id => id !== commandId)
        );
      }

      return {
        commands: newCommands,
        shortcuts: newShortcuts,
        categories: newCategories,
      };
    });
  }, []);

  const executeCommand = useCallback(async (commandId: string) => {
    const command = registry.commands.get(commandId);
    if (!command) {
      console.warn(`Command not found: ${commandId}`);
      return;
    }

    try {
      await command.action();
      addRecentCommand(commandId);
    } catch (error) {
      console.error(`Error executing command ${commandId}:`, error);
    }
  }, [registry.commands]);

  const getCommand = useCallback((commandId: string) => {
    return registry.commands.get(commandId);
  }, [registry.commands]);

  const getCommandsByCategory = useCallback((category: string) => {
    const commandIds = registry.categories.get(category) || [];
    return commandIds
      .map(id => registry.commands.get(id))
      .filter((cmd): cmd is Command => cmd !== undefined);
  }, [registry.commands, registry.categories]);

  const getAllCommands = useCallback(() => {
    return Array.from(registry.commands.values());
  }, [registry.commands]);

  const getCommandByShortcut = useCallback((shortcut: string) => {
    const commandId = registry.shortcuts.get(shortcut);
    return commandId ? registry.commands.get(commandId) : undefined;
  }, [registry.commands, registry.shortcuts]);

  const addRecentCommand = useCallback((commandId: string) => {
    setRecentCommands(prev => {
      const filtered = prev.filter(id => id !== commandId);
      return [commandId, ...filtered].slice(0, MAX_RECENT_COMMANDS);
    });
  }, []);

  return (
    <CommandContext.Provider
      value={{
        registry,
        registerCommand,
        unregisterCommand,
        executeCommand,
        getCommand,
        getCommandsByCategory,
        getAllCommands,
        getCommandByShortcut,
        recentCommands,
        addRecentCommand,
      }}
    >
      {children}
    </CommandContext.Provider>
  );
}

export function useCommands() {
  const context = useContext(CommandContext);
  if (context === undefined) {
    throw new Error('useCommands must be used within a CommandProvider');
  }
  return context;
}

// Helper function to format shortcut key
function formatShortcutKey(shortcut: KeyboardShortcut): string {
  const modifiers = shortcut.modifiers.sort().join('+');
  return modifiers ? `${modifiers}+${shortcut.key}` : shortcut.key;
}
