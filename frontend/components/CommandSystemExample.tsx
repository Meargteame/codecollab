'use client';

import React from 'react';
import { useCommands } from '@/contexts/CommandContext';
import { useBuiltInCommands } from '@/hooks/useBuiltInCommands';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

/**
 * Example component demonstrating the Command System usage
 * 
 * This component shows:
 * - How to initialize built-in commands
 * - How to enable keyboard shortcuts
 * - How to display all commands
 * - How to execute commands
 * - How to show recent commands
 */
export default function CommandSystemExample() {
  // Initialize built-in commands
  useBuiltInCommands();
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts();
  
  const {
    getAllCommands,
    getCommandsByCategory,
    executeCommand,
    recentCommands,
    getCommand,
  } = useCommands();

  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  
  // Get all commands
  const allCommands = getAllCommands();
  
  // Get unique categories
  const categories = ['All', ...new Set(allCommands.map(cmd => cmd.category))];
  
  // Filter commands by category
  const displayedCommands = selectedCategory === 'All'
    ? allCommands
    : getCommandsByCategory(selectedCategory);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Command System Example</h1>
      
      {/* Recent Commands */}
      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Recent Commands</h2>
        {recentCommands.length === 0 ? (
          <p className="text-gray-500">No recent commands. Execute a command to see it here.</p>
        ) : (
          <div className="space-y-2">
            {recentCommands.slice(0, 5).map(commandId => {
              const command = getCommand(commandId);
              if (!command) return null;
              
              return (
                <div
                  key={commandId}
                  className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded"
                >
                  <div>
                    <span className="font-medium">{command.label}</span>
                    <span className="text-sm text-gray-500 ml-2">({command.category})</span>
                  </div>
                  {command.shortcut && (
                    <span className="text-sm font-mono bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                      {command.shortcut.display}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Filter by Category:</label>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Commands List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">
            {selectedCategory === 'All' ? 'All Commands' : `${selectedCategory} Commands`}
            <span className="text-sm text-gray-500 ml-2">
              ({displayedCommands.length} commands)
            </span>
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {displayedCommands.map(command => (
            <div
              key={command.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium">{command.label}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                      {command.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    ID: <code className="font-mono text-xs">{command.id}</code>
                  </p>
                  
                  {command.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {command.keywords.map(keyword => (
                        <span
                          key={keyword}
                          className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                  {command.shortcut && (
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Shortcut</div>
                      <span className="font-mono text-sm bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded">
                        {command.shortcut.display}
                      </span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => executeCommand(command.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Execute
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">Try It Out!</h3>
        <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
          <li>• Click "Execute" on any command to run it</li>
          <li>• Use keyboard shortcuts (e.g., Cmd+P or Ctrl+P for Quick Open)</li>
          <li>• Recent commands will appear at the top</li>
          <li>• Filter by category to find specific commands</li>
          <li>• Open the browser console to see command execution logs</li>
        </ul>
      </div>
    </div>
  );
}
