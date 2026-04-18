# ActivityBar Component

The ActivityBar is a vertical navigation bar positioned on the far left edge of the editor. It allows users to quickly switch between major views (Explorer, Search, Git, Extensions, Collaboration).

## Features

- **48px Fixed Width**: Consistent sizing with centered icons
- **5 View Types**: Explorer, Search, Git, Extensions, Collaboration
- **Active Indicator**: 2px blue bar on the left edge of the active view
- **Keyboard Navigation**: Full support for Tab and Arrow keys
- **Accessibility**: ARIA labels, proper focus management, and screen reader support
- **Theme Integration**: Uses colors from ThemeContext

## Usage

```tsx
import { ActivityBar } from '@/components/ActivityBar';
import { UIProvider } from '@/contexts/UIContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

function EditorLayout() {
  return (
    <ThemeProvider>
      <UIProvider>
        <div className="flex h-screen">
          <ActivityBar />
          {/* Rest of your editor layout */}
        </div>
      </UIProvider>
    </ThemeProvider>
  );
}
```

## Keyboard Navigation

The ActivityBar supports comprehensive keyboard navigation:

- **Tab**: Focus the ActivityBar
- **Arrow Up/Down**: Navigate between views
- **Home**: Jump to first view (Explorer)
- **End**: Jump to last view (Collaboration)
- **Enter/Space**: Activate the focused view

## Integration with UIContext

The ActivityBar automatically integrates with UIContext to:

1. Display the currently active view
2. Update the active view when a button is clicked
3. Show the sidebar when switching views
4. Persist the active view to localStorage

```tsx
// Access UI state in your components
import { useUI } from '@/contexts/UIContext';

function MyComponent() {
  const { uiState, setActiveView } = useUI();
  
  // Get current active view
  console.log(uiState.activityBar.activeView); // 'explorer' | 'search' | 'git' | 'extensions' | 'collaboration'
  
  // Programmatically change view
  setActiveView('search');
}
```

## View Types

The ActivityBar supports the following view types:

1. **Explorer** (`explorer`): File tree and project structure
2. **Search** (`search`): Global search and replace
3. **Git** (`git`): Source control and version history
4. **Extensions** (`extensions`): Extension marketplace and management
5. **Collaboration** (`collaboration`): Real-time collaboration features

## Styling

The ActivityBar uses theme colors from ThemeContext:

- **Background**: `theme.colors.activityBar`
- **Active Icon**: `theme.colors.primary`
- **Inactive Icon**: `theme.colors.foreground` with 60% opacity
- **Hover**: White overlay with 5% opacity
- **Active Indicator**: `theme.colors.primary` (2px bar)

## Accessibility

The ActivityBar follows WCAG AA accessibility guidelines:

- **ARIA Roles**: Uses `tablist` and `tab` roles
- **ARIA Labels**: Each button has a descriptive label
- **ARIA Selected**: Indicates the active view
- **Focus Management**: Proper tabIndex management for keyboard navigation
- **Keyboard Support**: Full keyboard navigation without mouse

## Testing

The ActivityBar includes comprehensive unit tests covering:

- Rendering all view buttons
- Active indicator display
- View switching on click
- Keyboard navigation (Arrow keys, Home, End)
- Enter/Space key activation
- Wrapping behavior at list boundaries
- ARIA attributes
- TabIndex management

Run tests with:

```bash
npm test -- ActivityBar.test.tsx
```

## Requirements Satisfied

This component satisfies the following requirements from the Premium Editor UI spec:

- **1.1**: Activity Bar displays vertically on the far left edge
- **1.2**: Contains icons for Explorer, Search, Git, Extensions, Collaboration
- **1.3**: Switches views on click with smooth transition
- **1.4**: Highlights active view with colored indicator bar
- **1.6**: Supports keyboard navigation with Tab and Arrow keys
- **1.7**: Maintains 48px width with centered icons

## Future Enhancements

Potential future improvements:

- Badge support for notifications (e.g., unread messages, pending changes)
- Custom action buttons
- Drag-and-drop reordering
- Tooltip delay customization
- Animation preferences
