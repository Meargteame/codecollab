import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ActivityBar } from './ActivityBar';
import { UIProvider } from '@/contexts/UIContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Wrapper component with required providers
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <UIProvider>{children}</UIProvider>
  </ThemeProvider>
);

describe('ActivityBar', () => {
  it('renders all view buttons', () => {
    render(<ActivityBar />, { wrapper: Wrapper });

    expect(screen.getByLabelText('Explorer')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Source Control')).toBeInTheDocument();
    expect(screen.getByLabelText('Extensions')).toBeInTheDocument();
    expect(screen.getByLabelText('Collaboration')).toBeInTheDocument();
  });

  it('shows active indicator on the default active view', () => {
    render(<ActivityBar />, { wrapper: Wrapper });

    const explorerButton = screen.getByLabelText('Explorer');
    expect(explorerButton).toHaveAttribute('aria-selected', 'true');
  });

  it('switches active view when button is clicked', () => {
    render(<ActivityBar />, { wrapper: Wrapper });

    const searchButton = screen.getByLabelText('Search');
    fireEvent.click(searchButton);

    expect(searchButton).toHaveAttribute('aria-selected', 'true');
  });

  it('supports keyboard navigation with Arrow keys', () => {
    render(<ActivityBar />, { wrapper: Wrapper });

    const explorerButton = screen.getByLabelText('Explorer');
    explorerButton.focus();

    // Press ArrowDown to move to Search
    fireEvent.keyDown(explorerButton, { key: 'ArrowDown' });
    const searchButton = screen.getByLabelText('Search');
    expect(searchButton).toHaveAttribute('aria-selected', 'true');

    // Press ArrowUp to move back to Explorer
    fireEvent.keyDown(searchButton, { key: 'ArrowUp' });
    expect(explorerButton).toHaveAttribute('aria-selected', 'true');
  });

  it('supports Home and End keys for navigation', () => {
    render(<ActivityBar />, { wrapper: Wrapper });

    const explorerButton = screen.getByLabelText('Explorer');
    explorerButton.focus();

    // Press End to jump to last item
    fireEvent.keyDown(explorerButton, { key: 'End' });
    const collaborationButton = screen.getByLabelText('Collaboration');
    expect(collaborationButton).toHaveAttribute('aria-selected', 'true');

    // Press Home to jump to first item
    fireEvent.keyDown(collaborationButton, { key: 'Home' });
    expect(explorerButton).toHaveAttribute('aria-selected', 'true');
  });

  it('activates view on Enter key press', () => {
    render(<ActivityBar />, { wrapper: Wrapper });

    const searchButton = screen.getByLabelText('Search');
    searchButton.focus();

    fireEvent.keyDown(searchButton, { key: 'Enter' });
    expect(searchButton).toHaveAttribute('aria-selected', 'true');
  });

  it('activates view on Space key press', () => {
    render(<ActivityBar />, { wrapper: Wrapper });

    const gitButton = screen.getByLabelText('Source Control');
    gitButton.focus();

    fireEvent.keyDown(gitButton, { key: ' ' });
    expect(gitButton).toHaveAttribute('aria-selected', 'true');
  });

  it('wraps around when navigating past the last item', () => {
    render(<ActivityBar />, { wrapper: Wrapper });

    const collaborationButton = screen.getByLabelText('Collaboration');
    collaborationButton.focus();

    // Press ArrowDown to wrap to first item
    fireEvent.keyDown(collaborationButton, { key: 'ArrowDown' });
    const explorerButton = screen.getByLabelText('Explorer');
    expect(explorerButton).toHaveAttribute('aria-selected', 'true');
  });

  it('wraps around when navigating before the first item', () => {
    render(<ActivityBar />, { wrapper: Wrapper });

    const explorerButton = screen.getByLabelText('Explorer');
    explorerButton.focus();

    // Press ArrowUp to wrap to last item
    fireEvent.keyDown(explorerButton, { key: 'ArrowUp' });
    const collaborationButton = screen.getByLabelText('Collaboration');
    expect(collaborationButton).toHaveAttribute('aria-selected', 'true');
  });

  it('has proper ARIA attributes for accessibility', () => {
    render(<ActivityBar />, { wrapper: Wrapper });

    const activityBar = screen.getByRole('tablist');
    expect(activityBar).toHaveAttribute('aria-label', 'Activity Bar');

    const buttons = screen.getAllByRole('tab');
    expect(buttons).toHaveLength(5);

    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-selected');
      expect(button).toHaveAttribute('aria-label');
    });
  });

  it('applies correct tabIndex for keyboard navigation', () => {
    render(<ActivityBar />, { wrapper: Wrapper });

    const explorerButton = screen.getByLabelText('Explorer');
    const searchButton = screen.getByLabelText('Search');

    // Active button should have tabIndex 0
    expect(explorerButton).toHaveAttribute('tabindex', '0');
    
    // Inactive buttons should have tabIndex -1
    expect(searchButton).toHaveAttribute('tabindex', '-1');
  });

  describe('View Switching Behavior', () => {
    it('switches to each view correctly', () => {
      render(<ActivityBar />, { wrapper: Wrapper });

      const views = [
        { label: 'Search', type: 'search' },
        { label: 'Source Control', type: 'git' },
        { label: 'Extensions', type: 'extensions' },
        { label: 'Collaboration', type: 'collaboration' },
      ];

      views.forEach(view => {
        const button = screen.getByLabelText(view.label);
        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('deactivates previous view when switching', () => {
      render(<ActivityBar />, { wrapper: Wrapper });

      const explorerButton = screen.getByLabelText('Explorer');
      const searchButton = screen.getByLabelText('Search');

      expect(explorerButton).toHaveAttribute('aria-selected', 'true');
      
      fireEvent.click(searchButton);
      
      expect(searchButton).toHaveAttribute('aria-selected', 'true');
      expect(explorerButton).toHaveAttribute('aria-selected', 'false');
    });

    it('maintains only one active view at a time', () => {
      render(<ActivityBar />, { wrapper: Wrapper });

      const searchButton = screen.getByLabelText('Search');
      fireEvent.click(searchButton);

      const allButtons = screen.getAllByRole('tab');
      const activeButtons = allButtons.filter(
        button => button.getAttribute('aria-selected') === 'true'
      );

      expect(activeButtons).toHaveLength(1);
      expect(activeButtons[0]).toBe(searchButton);
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates through all views with ArrowDown', () => {
      render(<ActivityBar />, { wrapper: Wrapper });

      const views = ['Explorer', 'Search', 'Source Control', 'Extensions', 'Collaboration'];
      
      let currentButton = screen.getByLabelText(views[0]);
      currentButton.focus();

      for (let i = 1; i < views.length; i++) {
        fireEvent.keyDown(currentButton, { key: 'ArrowDown' });
        currentButton = screen.getByLabelText(views[i]);
        expect(currentButton).toHaveAttribute('aria-selected', 'true');
      }
    });

    it('navigates through all views with ArrowUp', () => {
      render(<ActivityBar />, { wrapper: Wrapper });

      const views = ['Collaboration', 'Extensions', 'Source Control', 'Search', 'Explorer'];
      
      let currentButton = screen.getByLabelText(views[0]);
      currentButton.focus();

      for (let i = 1; i < views.length; i++) {
        fireEvent.keyDown(currentButton, { key: 'ArrowUp' });
        currentButton = screen.getByLabelText(views[i]);
        expect(currentButton).toHaveAttribute('aria-selected', 'true');
      }
    });

    it('does not navigate on unrelated keys', () => {
      render(<ActivityBar />, { wrapper: Wrapper });

      const explorerButton = screen.getByLabelText('Explorer');
      explorerButton.focus();

      fireEvent.keyDown(explorerButton, { key: 'a' });
      expect(explorerButton).toHaveAttribute('aria-selected', 'true');

      fireEvent.keyDown(explorerButton, { key: 'Tab' });
      expect(explorerButton).toHaveAttribute('aria-selected', 'true');
    });

    it('prevents default behavior for navigation keys', () => {
      render(<ActivityBar />, { wrapper: Wrapper });

      const explorerButton = screen.getByLabelText('Explorer');
      explorerButton.focus();

      const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      const preventDefaultSpy = jest.spyOn(arrowDownEvent, 'preventDefault');
      
      explorerButton.dispatchEvent(arrowDownEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Active Indicator Rendering', () => {
    it('renders active indicator for the active view', () => {
      const { container } = render(<ActivityBar />, { wrapper: Wrapper });

      const explorerButton = screen.getByLabelText('Explorer');
      const indicator = explorerButton.querySelector('.absolute.left-0');

      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass('w-0.5');
    });

    it('does not render active indicator for inactive views', () => {
      const { container } = render(<ActivityBar />, { wrapper: Wrapper });

      const searchButton = screen.getByLabelText('Search');
      const indicator = searchButton.querySelector('.absolute.left-0');

      expect(indicator).not.toBeInTheDocument();
    });

    it('moves active indicator when view changes', () => {
      render(<ActivityBar />, { wrapper: Wrapper });

      const explorerButton = screen.getByLabelText('Explorer');
      const searchButton = screen.getByLabelText('Search');

      let explorerIndicator = explorerButton.querySelector('.absolute.left-0');
      expect(explorerIndicator).toBeInTheDocument();

      fireEvent.click(searchButton);

      explorerIndicator = explorerButton.querySelector('.absolute.left-0');
      const searchIndicator = searchButton.querySelector('.absolute.left-0');

      expect(explorerIndicator).not.toBeInTheDocument();
      expect(searchIndicator).toBeInTheDocument();
    });

    it('renders indicator with correct styling', () => {
      render(<ActivityBar />, { wrapper: Wrapper });

      const explorerButton = screen.getByLabelText('Explorer');
      const indicator = explorerButton.querySelector('.absolute.left-0');

      expect(indicator).toHaveClass('absolute', 'left-0', 'top-0', 'bottom-0', 'w-0.5');
    });
  });

  describe('Layout and Styling', () => {
    it('renders with correct container structure', () => {
      const { container } = render(<ActivityBar />, { wrapper: Wrapper });

      const activityBar = screen.getByRole('tablist');
      expect(activityBar).toHaveClass('w-12', 'h-full', 'flex', 'flex-col');
    });

    it('renders buttons with correct dimensions', () => {
      render(<ActivityBar />, { wrapper: Wrapper });

      const buttons = screen.getAllByRole('tab');
      buttons.forEach(button => {
        expect(button).toHaveClass('w-full', 'h-12');
      });
    });

    it('applies hover and focus styles', () => {
      render(<ActivityBar />, { wrapper: Wrapper });

      const searchButton = screen.getByLabelText('Search');
      expect(searchButton).toHaveClass('hover:bg-white/5', 'focus:outline-none', 'focus:bg-white/5');
    });
  });

  describe('Accessibility', () => {
    it('provides title attribute for tooltips', () => {
      render(<ActivityBar />, { wrapper: Wrapper });

      const explorerButton = screen.getByLabelText('Explorer');
      expect(explorerButton).toHaveAttribute('title', 'Explorer');
    });

    it('uses semantic button elements', () => {
      render(<ActivityBar />, { wrapper: Wrapper });

      const buttons = screen.getAllByRole('tab');
      buttons.forEach(button => {
        expect(button.tagName).toBe('BUTTON');
      });
    });

    it('maintains focus management during keyboard navigation', () => {
      render(<ActivityBar />, { wrapper: Wrapper });

      const explorerButton = screen.getByLabelText('Explorer');
      const searchButton = screen.getByLabelText('Search');

      explorerButton.focus();
      expect(document.activeElement).toBe(explorerButton);

      fireEvent.keyDown(explorerButton, { key: 'ArrowDown' });
      expect(document.activeElement).toBe(searchButton);
    });
  });
});
