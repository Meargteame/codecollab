import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { CommandProvider, useCommands, Command } from './CommandContext';

// Test component that uses the command context
function TestComponent() {
  const {
    registerCommand,
    executeCommand,
    getCommand,
    getAllCommands,
    getCommandsByCategory,
    getCommandByShortcut,
    recentCommands,
  } = useCommands();

  const [executedCommands, setExecutedCommands] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Register test commands
    const testCommand: Command = {
      id: 'test.command1',
      label: 'Test Command 1',
      category: 'Test',
      keywords: ['test', 'command'],
      shortcut: {
        key: 't',
        modifiers: ['cmd'],
        display: '⌘T',
      },
      action: () => {
        setExecutedCommands(prev => [...prev, 'test.command1']);
      },
    };

    const testCommand2: Command = {
      id: 'test.command2',
      label: 'Test Command 2',
      category: 'Test',
      keywords: ['test', 'second'],
      action: () => {
        setExecutedCommands(prev => [...prev, 'test.command2']);
      },
    };

    const otherCommand: Command = {
      id: 'other.command',
      label: 'Other Command',
      category: 'Other',
      keywords: ['other'],
      action: () => {
        setExecutedCommands(prev => [...prev, 'other.command']);
      },
    };

    registerCommand(testCommand);
    registerCommand(testCommand2);
    registerCommand(otherCommand);
  }, [registerCommand]);

  return (
    <div>
      <button onClick={() => executeCommand('test.command1')}>
        Execute Command 1
      </button>
      <button onClick={() => executeCommand('test.command2')}>
        Execute Command 2
      </button>
      <button onClick={() => executeCommand('other.command')}>
        Execute Other
      </button>
      <div data-testid="executed-commands">
        {executedCommands.join(', ')}
      </div>
      <div data-testid="all-commands-count">
        {getAllCommands().length}
      </div>
      <div data-testid="test-category-count">
        {getCommandsByCategory('Test').length}
      </div>
      <div data-testid="command-by-shortcut">
        {getCommandByShortcut('cmd+t')?.id || 'none'}
      </div>
      <div data-testid="recent-commands">
        {recentCommands.join(', ')}
      </div>
      <div data-testid="command-label">
        {getCommand('test.command1')?.label || 'not found'}
      </div>
    </div>
  );
}

describe('CommandContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should register and retrieve commands', () => {
    render(
      <CommandProvider>
        <TestComponent />
      </CommandProvider>
    );

    expect(screen.getByTestId('all-commands-count')).toHaveTextContent('3');
    expect(screen.getByTestId('test-category-count')).toHaveTextContent('2');
    expect(screen.getByTestId('command-label')).toHaveTextContent('Test Command 1');
  });

  it('should execute commands', async () => {
    render(
      <CommandProvider>
        <TestComponent />
      </CommandProvider>
    );

    const button1 = screen.getByText('Execute Command 1');
    const button2 = screen.getByText('Execute Command 2');

    await act(async () => {
      button1.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('executed-commands')).toHaveTextContent('test.command1');
    });

    await act(async () => {
      button2.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('executed-commands')).toHaveTextContent(
        'test.command1, test.command2'
      );
    });
  });

  it('should track recent commands', async () => {
    render(
      <CommandProvider>
        <TestComponent />
      </CommandProvider>
    );

    const button1 = screen.getByText('Execute Command 1');
    const button2 = screen.getByText('Execute Command 2');
    const buttonOther = screen.getByText('Execute Other');

    await act(async () => {
      button1.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('recent-commands')).toHaveTextContent('test.command1');
    });

    await act(async () => {
      button2.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('recent-commands')).toHaveTextContent(
        'test.command2, test.command1'
      );
    });

    await act(async () => {
      buttonOther.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('recent-commands')).toHaveTextContent(
        'other.command, test.command2, test.command1'
      );
    });
  });

  it('should find commands by shortcut', () => {
    render(
      <CommandProvider>
        <TestComponent />
      </CommandProvider>
    );

    expect(screen.getByTestId('command-by-shortcut')).toHaveTextContent('test.command1');
  });

  it('should filter commands by category', () => {
    render(
      <CommandProvider>
        <TestComponent />
      </CommandProvider>
    );

    expect(screen.getByTestId('test-category-count')).toHaveTextContent('2');
  });

  it('should handle non-existent commands gracefully', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    function TestNonExistent() {
      const { executeCommand } = useCommands();
      return (
        <button onClick={() => executeCommand('non.existent')}>
          Execute Non-Existent
        </button>
      );
    }

    render(
      <CommandProvider>
        <TestNonExistent />
      </CommandProvider>
    );

    const button = screen.getByText('Execute Non-Existent');

    await act(async () => {
      button.click();
    });

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith('Command not found: non.existent');
    });

    consoleWarnSpy.mockRestore();
  });
});
