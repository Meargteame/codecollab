import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatusBar from './StatusBar';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Wrapper component to provide theme context
const StatusBarWithTheme = (props: any) => (
  <ThemeProvider>
    <StatusBar {...props} />
  </ThemeProvider>
);

describe('StatusBar', () => {
  const defaultProps = {
    cursorPosition: { line: 10, column: 25 },
    indentation: { type: 'spaces' as const, size: 2 },
  };

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<StatusBarWithTheme {...defaultProps} />);
      
      // Check cursor position
      expect(screen.getByText(/Ln 10, Col 25/)).toBeInTheDocument();
      
      // Check indentation
      expect(screen.getByText(/Spaces: 2/)).toBeInTheDocument();
      
      // Check default values
      expect(screen.getByText('main')).toBeInTheDocument();
      expect(screen.getByText('UTF-8')).toBeInTheDocument();
      expect(screen.getByText('LF')).toBeInTheDocument();
      expect(screen.getByText('Plain Text')).toBeInTheDocument();
    });

    it('renders git branch', () => {
      render(<StatusBarWithTheme {...defaultProps} branch="feature/new-ui" />);
      expect(screen.getByText('feature/new-ui')).toBeInTheDocument();
    });

    it('renders cursor position', () => {
      render(<StatusBarWithTheme {...defaultProps} cursorPosition={{ line: 42, column: 15 }} />);
      expect(screen.getByText(/Ln 42, Col 15/)).toBeInTheDocument();
    });

    it('renders file encoding', () => {
      render(<StatusBarWithTheme {...defaultProps} encoding="UTF-16" />);
      expect(screen.getByText('UTF-16')).toBeInTheDocument();
    });

    it('renders line ending type', () => {
      render(<StatusBarWithTheme {...defaultProps} lineEnding="CRLF" />);
      expect(screen.getByText('CRLF')).toBeInTheDocument();
    });

    it('renders language mode', () => {
      render(<StatusBarWithTheme {...defaultProps} language="TypeScript" />);
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('renders indentation with spaces', () => {
      render(<StatusBarWithTheme {...defaultProps} indentation={{ type: 'spaces', size: 4 }} />);
      expect(screen.getByText(/Spaces: 4/)).toBeInTheDocument();
    });

    it('renders indentation with tabs', () => {
      render(<StatusBarWithTheme {...defaultProps} indentation={{ type: 'tabs', size: 1 }} />);
      expect(screen.getByText(/Tabs: 1/)).toBeInTheDocument();
    });
  });

  describe('Diagnostics', () => {
    it('renders error count when errors exist', () => {
      render(<StatusBarWithTheme {...defaultProps} errors={5} />);
      expect(screen.getByText('5')).toBeInTheDocument();
      
      // Check for error icon (red color)
      const errorButton = screen.getByText('5').closest('button');
      expect(errorButton).toHaveClass('text-red-400');
    });

    it('renders warning count when warnings exist', () => {
      render(<StatusBarWithTheme {...defaultProps} warnings={3} />);
      expect(screen.getByText('3')).toBeInTheDocument();
      
      // Check for warning icon (yellow color)
      const warningButton = screen.getByText('3').closest('button');
      expect(warningButton).toHaveClass('text-yellow-400');
    });

    it('renders both errors and warnings', () => {
      render(<StatusBarWithTheme {...defaultProps} errors={2} warnings={4} />);
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('does not render diagnostics when counts are zero', () => {
      render(<StatusBarWithTheme {...defaultProps} errors={0} warnings={0} />);
      
      // Should not find error/warning indicators
      const buttons = screen.getAllByRole('button');
      const diagnosticButtons = buttons.filter(btn => 
        btn.classList.contains('text-red-400') || btn.classList.contains('text-yellow-400')
      );
      expect(diagnosticButtons).toHaveLength(0);
    });
  });

  describe('Collaboration', () => {
    it('renders collaborator count when collaborators exist', () => {
      render(<StatusBarWithTheme {...defaultProps} collaboratorCount={3} />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('does not render collaborator count when zero', () => {
      render(<StatusBarWithTheme {...defaultProps} collaboratorCount={0} />);
      
      // Should not find collaborator count
      const allText = screen.queryByText('0');
      expect(allText).not.toBeInTheDocument();
    });
  });

  describe('Click Interactions', () => {
    it('calls onBranchClick when branch is clicked', () => {
      const onBranchClick = jest.fn();
      render(<StatusBarWithTheme {...defaultProps} onBranchClick={onBranchClick} />);
      
      fireEvent.click(screen.getByText('main'));
      expect(onBranchClick).toHaveBeenCalledTimes(1);
    });

    it('calls onCursorClick when cursor position is clicked', () => {
      const onCursorClick = jest.fn();
      render(<StatusBarWithTheme {...defaultProps} onCursorClick={onCursorClick} />);
      
      fireEvent.click(screen.getByText(/Ln 10, Col 25/));
      expect(onCursorClick).toHaveBeenCalledTimes(1);
    });

    it('calls onEncodingClick when encoding is clicked', () => {
      const onEncodingClick = jest.fn();
      render(<StatusBarWithTheme {...defaultProps} onEncodingClick={onEncodingClick} />);
      
      fireEvent.click(screen.getByText('UTF-8'));
      expect(onEncodingClick).toHaveBeenCalledTimes(1);
    });

    it('calls onLineEndingClick when line ending is clicked', () => {
      const onLineEndingClick = jest.fn();
      render(<StatusBarWithTheme {...defaultProps} onLineEndingClick={onLineEndingClick} />);
      
      fireEvent.click(screen.getByText('LF'));
      expect(onLineEndingClick).toHaveBeenCalledTimes(1);
    });

    it('calls onLanguageClick when language is clicked', () => {
      const onLanguageClick = jest.fn();
      render(<StatusBarWithTheme {...defaultProps} onLanguageClick={onLanguageClick} />);
      
      fireEvent.click(screen.getByText('Plain Text'));
      expect(onLanguageClick).toHaveBeenCalledTimes(1);
    });

    it('calls onIndentationClick when indentation is clicked', () => {
      const onIndentationClick = jest.fn();
      render(<StatusBarWithTheme {...defaultProps} onIndentationClick={onIndentationClick} />);
      
      fireEvent.click(screen.getByText(/Spaces: 2/));
      expect(onIndentationClick).toHaveBeenCalledTimes(1);
    });

    it('calls onDiagnosticsClick when errors are clicked', () => {
      const onDiagnosticsClick = jest.fn();
      render(<StatusBarWithTheme {...defaultProps} errors={5} onDiagnosticsClick={onDiagnosticsClick} />);
      
      fireEvent.click(screen.getByText('5'));
      expect(onDiagnosticsClick).toHaveBeenCalledTimes(1);
    });

    it('calls onDiagnosticsClick when warnings are clicked', () => {
      const onDiagnosticsClick = jest.fn();
      render(<StatusBarWithTheme {...defaultProps} warnings={3} onDiagnosticsClick={onDiagnosticsClick} />);
      
      fireEvent.click(screen.getByText('3'));
      expect(onDiagnosticsClick).toHaveBeenCalledTimes(1);
    });

    it('calls onCollaboratorsClick when collaborator count is clicked', () => {
      const onCollaboratorsClick = jest.fn();
      render(<StatusBarWithTheme {...defaultProps} collaboratorCount={3} onCollaboratorsClick={onCollaboratorsClick} />);
      
      fireEvent.click(screen.getByText('3'));
      expect(onCollaboratorsClick).toHaveBeenCalledTimes(1);
    });

    it('does not call handlers when not provided', () => {
      // Should not throw error when clicking without handlers
      render(<StatusBarWithTheme {...defaultProps} />);
      
      expect(() => {
        fireEvent.click(screen.getByText('main'));
        fireEvent.click(screen.getByText(/Ln 10, Col 25/));
        fireEvent.click(screen.getByText('UTF-8'));
      }).not.toThrow();
    });
  });

  describe('Hover Effects', () => {
    it('applies hover class to clickable items', () => {
      const onBranchClick = jest.fn();
      render(<StatusBarWithTheme {...defaultProps} onBranchClick={onBranchClick} />);
      
      const branchButton = screen.getByText('main').closest('button');
      expect(branchButton).toHaveClass('hover:bg-white/5');
      expect(branchButton).toHaveClass('cursor-pointer');
    });

    it('does not apply hover class to non-clickable items', () => {
      render(<StatusBarWithTheme {...defaultProps} />);
      
      const branchButton = screen.getByText('main').closest('button');
      expect(branchButton).toHaveClass('cursor-default');
      expect(branchButton).toBeDisabled();
    });
  });

  describe('Real-time Updates', () => {
    it('updates cursor position when prop changes', () => {
      const { rerender } = render(<StatusBarWithTheme {...defaultProps} cursorPosition={{ line: 1, column: 1 }} />);
      expect(screen.getByText(/Ln 1, Col 1/)).toBeInTheDocument();
      
      rerender(<StatusBarWithTheme {...defaultProps} cursorPosition={{ line: 50, column: 100 }} />);
      expect(screen.getByText(/Ln 50, Col 100/)).toBeInTheDocument();
    });

    it('updates error count when prop changes', () => {
      const { rerender } = render(<StatusBarWithTheme {...defaultProps} errors={0} />);
      expect(screen.queryByText('0')).not.toBeInTheDocument();
      
      rerender(<StatusBarWithTheme {...defaultProps} errors={5} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('updates warning count when prop changes', () => {
      const { rerender } = render(<StatusBarWithTheme {...defaultProps} warnings={0} />);
      expect(screen.queryByText('0')).not.toBeInTheDocument();
      
      rerender(<StatusBarWithTheme {...defaultProps} warnings={3} />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });
});
