'use client';

import React, { useRef, useEffect } from 'react';
import { useUI, ViewType } from '@/contexts/UIContext';
import { useTheme } from '@/contexts/ThemeContext';

// Icon components for each view
const ExplorerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3h7l2 2h9v14H3V3z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const GitIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const ExtensionsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.5 2h3v6.5h6.5v3h-6.5V18h-3v-6.5H4v-3h6.5V2z" />
    <rect x="14" y="14" width="6" height="6" rx="1" />
  </svg>
);

const CollaborationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

interface ActivityBarButtonProps {
  view: ViewType;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const ActivityBarButton: React.FC<ActivityBarButtonProps> = ({
  view,
  icon,
  label,
  isActive,
  onClick,
  onKeyDown,
}) => {
  const { theme } = useTheme();

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-label={label}
      title={label}
      tabIndex={isActive ? 0 : -1}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className="relative w-full h-12 flex items-center justify-center transition-colors duration-150 hover:bg-white/5 focus:outline-none focus:bg-white/5"
      style={{
        color: isActive ? theme.colors.primary : theme.colors.foreground + '99',
      }}
    >
      {/* Active indicator - 2px blue bar on left edge */}
      {isActive && (
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: theme.colors.primary }}
        />
      )}
      {icon}
    </button>
  );
};

export const ActivityBar: React.FC = () => {
  const { uiState, setActiveView } = useUI();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const views: Array<{ type: ViewType; icon: React.ReactNode; label: string }> = [
    { type: 'explorer', icon: <ExplorerIcon />, label: 'Explorer' },
    { type: 'search', icon: <SearchIcon />, label: 'Search' },
    { type: 'git', icon: <GitIcon />, label: 'Source Control' },
    { type: 'extensions', icon: <ExtensionsIcon />, label: 'Extensions' },
    { type: 'collaboration', icon: <CollaborationIcon />, label: 'Collaboration' },
  ];

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const buttons = containerRef.current?.querySelectorAll('button');
    if (!buttons) return;

    let nextIndex = index;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (index + 1) % views.length;
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (index - 1 + views.length) % views.length;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = views.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleViewChange(views[index].type);
        return;
      default:
        return;
    }

    (buttons[nextIndex] as HTMLButtonElement).focus();
    handleViewChange(views[nextIndex].type);
  };

  // Set initial focus on active view when component mounts
  useEffect(() => {
    const activeIndex = views.findIndex(v => v.type === uiState.activityBar.activeView);
    const buttons = containerRef.current?.querySelectorAll('button');
    if (buttons && activeIndex >= 0) {
      (buttons[activeIndex] as HTMLButtonElement).tabIndex = 0;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Activity Bar"
      className="w-12 h-full flex flex-col"
      style={{ backgroundColor: theme.colors.activityBar }}
    >
      {views.map((view, index) => (
        <ActivityBarButton
          key={view.type}
          view={view.type}
          icon={view.icon}
          label={view.label}
          isActive={uiState.activityBar.activeView === view.type}
          onClick={() => handleViewChange(view.type)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  );
};
