# Theme System Documentation

## Overview

The premium editor UI uses a comprehensive theme system built with React Context and Tailwind CSS design tokens. The theme provides WCAG AA compliant colors, consistent spacing, smooth transitions, and a professional dark theme optimized for extended coding sessions.

## Architecture

### ThemeContext

The `ThemeContext` provides theme colors and utilities throughout the application.

```typescript
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div style={{ backgroundColor: theme.colors.background }}>
      <p style={{ color: theme.colors.foreground }}>Hello World</p>
    </div>
  );
}
```

### Theme Structure

```typescript
interface Theme {
  id: string;
  name: string;
  type: 'dark' | 'light';
  colors: ThemeColors;      // Editor and UI colors
  syntax: SyntaxColors;      // Code syntax highlighting
  ui: UIColors;              // Interactive element states
}
```

## Design Tokens

### Spacing (4px Grid System)

Tailwind classes follow a 4px grid:

```tsx
<div className="p-4">      {/* 16px padding */}
<div className="m-6">      {/* 24px margin */}
<div className="gap-2">    {/* 8px gap */}
```

### Transitions

Standard transition durations:

- `duration-150`: UI interactions (hover, focus)
- `duration-200`: Animations (fold, slide)
- `duration-250`: Sidebar expand/collapse
- `duration-300`: Hover delays
- `duration-500`: Preview delays

```tsx
<button className="transition-colors duration-150 hover:bg-ui-hover">
  Click me
</button>
```

### Shadows

Consistent shadow system for depth:

```tsx
<div className="shadow-sm">    {/* Subtle elevation */}
<div className="shadow-md">    {/* Medium elevation */}
<div className="shadow-overlay"> {/* Modal/overlay */}
```

## Color System

### Editor Colors

```tsx
// Background and foreground
bg-editor-bg          // #0a0a0a
text-editor-fg        // #e4e4e7

// Selection and highlights
bg-editor-selection   // #3b82f620
bg-editor-lineHighlight // #ffffff08
```

### UI Colors

```tsx
// Component backgrounds
bg-ui-activityBar     // #0f0f0f
bg-ui-sideBar         // #121212
bg-ui-statusBar       // #0a0a0a
bg-ui-panel           // #0f0f0f

// Interactive states
border-ui-border      // #27272a
bg-ui-hover           // #18181b
bg-ui-active          // #3b82f6
ring-ui-focus         // #3b82f6
```

### Syntax Colors

```tsx
text-syntax-keyword   // #c084fc (purple)
text-syntax-string    // #34d399 (green)
text-syntax-number    // #fbbf24 (amber)
text-syntax-comment   // #6b7280 (gray)
text-syntax-function  // #60a5fa (blue)
text-syntax-variable  // #e4e4e7 (light gray)
text-syntax-type      // #a78bfa (light purple)
text-syntax-operator  // #f472b6 (pink)
```

### Accent Colors

```tsx
bg-blue-500           // Primary (#3b82f6)
bg-purple-500         // Secondary (#8b5cf6)
bg-green-500          // Success (#10b981)
bg-amber-500          // Warning (#f59e0b)
bg-red-500            // Error (#ef4444)
bg-cyan-500           // Info (#06b6d4)
```

## WCAG AA Compliance

All theme colors meet WCAG AA contrast requirements:

- **Normal text**: 4.5:1 minimum (all syntax colors exceed this)
- **Large text**: 3:1 minimum (all accent colors exceed this)
- **UI components**: 3:1 minimum

See [theme-wcag-validation.md](./theme-wcag-validation.md) for detailed contrast ratios.

## Usage Examples

### Using Theme Colors Directly

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function CodeBlock() {
  const { theme } = useTheme();
  
  return (
    <pre style={{ backgroundColor: theme.colors.panel }}>
      <code style={{ color: theme.syntax.keyword }}>const</code>
      <code style={{ color: theme.syntax.variable }}> x </code>
      <code style={{ color: theme.syntax.operator }}>= </code>
      <code style={{ color: theme.syntax.number }}>42</code>
    </pre>
  );
}
```

### Using Tailwind Classes

```tsx
function StatusBar() {
  return (
    <div className="h-6 bg-ui-statusBar border-t border-ui-border">
      <div className="flex items-center justify-between px-4">
        <span className="text-editor-fg text-sm">main</span>
        <span className="text-syntax-comment text-sm">Ln 42, Col 12</span>
      </div>
    </div>
  );
}
```

### Smooth Transitions

```tsx
function Button() {
  return (
    <button className="
      px-4 py-2
      bg-blue-500 text-editor-fg
      transition-all duration-150
      hover:bg-blue-600
      focus:ring-2 focus:ring-ui-focus
      active:bg-ui-active
    ">
      Click me
    </button>
  );
}
```

### Shadows and Depth

```tsx
function Modal() {
  return (
    <div className="
      fixed inset-0 
      bg-black/50 
      flex items-center justify-center
    ">
      <div className="
        bg-ui-sideBar 
        shadow-overlay 
        p-6 
        w-96
      ">
        <h2 className="text-editor-fg text-xl mb-4">Modal Title</h2>
        <p className="text-syntax-comment">Modal content</p>
      </div>
    </div>
  );
}
```

## Customization

### Changing Theme

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  
  const customTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      primary: '#ff0000', // Custom primary color
    }
  };
  
  return (
    <button onClick={() => setTheme(customTheme)}>
      Apply Custom Theme
    </button>
  );
}
```

### Validating Contrast

```tsx
import { validateContrastRatio } from '@/contexts/ThemeContext';

const ratio = validateContrastRatio('#ffffff', '#000000');
console.log(`Contrast ratio: ${ratio}:1`); // 21:1

const isWCAGAA = ratio >= 4.5; // true for normal text
```

## Best Practices

1. **Use Tailwind classes when possible** for consistency and performance
2. **Use theme context for dynamic colors** that need to change based on theme
3. **Always validate custom colors** against WCAG AA standards
4. **Use consistent transition durations** (150ms for UI, 200ms for animations)
5. **Follow the 4px grid system** for spacing
6. **Use semantic color names** (primary, success, error) instead of specific colors

## Integration with Monaco Editor

The theme system integrates with Monaco Editor for syntax highlighting:

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import Editor from '@monaco-editor/react';

function CodeEditor() {
  const { theme } = useTheme();
  
  const monacoTheme = {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: theme.syntax.keyword.slice(1) },
      { token: 'string', foreground: theme.syntax.string.slice(1) },
      { token: 'number', foreground: theme.syntax.number.slice(1) },
      { token: 'comment', foreground: theme.syntax.comment.slice(1) },
    ],
    colors: {
      'editor.background': theme.colors.background,
      'editor.foreground': theme.colors.foreground,
    }
  };
  
  return <Editor theme={monacoTheme} />;
}
```

## Performance Considerations

- Theme is stored in localStorage and persists across sessions
- Theme changes trigger minimal re-renders (only components using `useTheme`)
- Tailwind classes are optimized and purged in production
- CSS transitions use GPU-accelerated properties (transform, opacity)

## Accessibility

- All colors meet WCAG AA contrast requirements
- Focus indicators are clearly visible (2px ring)
- Reduced motion preferences are respected
- High contrast mode is supported
- Font sizes are customizable (10px-24px)
