import { useEffect } from 'react';
import { useCommands } from '@/contexts/CommandContext';

export function useKeyboardShortcuts() {
  const { getCommandByShortcut, executeCommand } = useCommands();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Build shortcut key from event
      const modifiers: string[] = [];
      
      // Detect platform
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      
      // Add modifiers in consistent order
      if (event.metaKey && isMac) modifiers.push('cmd');
      if (event.ctrlKey && !isMac) modifiers.push('ctrl');
      if (event.ctrlKey && isMac && !event.metaKey) modifiers.push('ctrl');
      if (event.shiftKey) modifiers.push('shift');
      if (event.altKey) modifiers.push('alt');
      
      // Get the key
      let key = event.key.toLowerCase();
      
      // Normalize special keys
      if (key === ' ') key = 'space';
      if (key === 'escape') key = 'esc';
      if (key === 'arrowup') key = 'up';
      if (key === 'arrowdown') key = 'down';
      if (key === 'arrowleft') key = 'left';
      if (key === 'arrowright') key = 'right';
      
      // Build shortcut string
      const shortcutKey = modifiers.length > 0 
        ? `${modifiers.sort().join('+')}+${key}`
        : key;
      
      // Find and execute command
      const command = getCommandByShortcut(shortcutKey);
      
      if (command) {
        // Prevent default browser behavior
        event.preventDefault();
        event.stopPropagation();
        
        // Execute command
        executeCommand(command.id);
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown, true);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [getCommandByShortcut, executeCommand]);
}
