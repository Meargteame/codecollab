'use client';

import { useTheme } from '@/contexts/ThemeContext';

/**
 * Example component demonstrating ThemeContext usage
 * This shows how to access theme colors in components
 */
export default function ThemeExample() {
  const { theme } = useTheme();

  return (
    <div 
      className="p-6 space-y-4"
      style={{ backgroundColor: theme.colors.background }}
    >
      <h2 
        className="text-2xl font-bold"
        style={{ color: theme.colors.foreground }}
      >
        Theme System Example
      </h2>

      <div className="space-y-2">
        <p style={{ color: theme.colors.foreground }}>
          This is normal text with WCAG AA compliant contrast.
        </p>

        <div className="flex gap-4">
          <button
            className="px-4 py-2 transition-colors duration-150"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.foreground,
            }}
          >
            Primary Button
          </button>

          <button
            className="px-4 py-2 transition-colors duration-150"
            style={{
              backgroundColor: theme.colors.success,
              color: theme.colors.foreground,
            }}
          >
            Success Button
          </button>

          <button
            className="px-4 py-2 transition-colors duration-150"
            style={{
              backgroundColor: theme.colors.error,
              color: theme.colors.foreground,
            }}
          >
            Error Button
          </button>
        </div>

        <div className="space-y-1 font-mono text-sm">
          <p style={{ color: theme.syntax.keyword }}>const</p>
          <p style={{ color: theme.syntax.function }}>function</p>
          <p style={{ color: theme.syntax.string }}>"string"</p>
          <p style={{ color: theme.syntax.number }}>42</p>
          <p style={{ color: theme.syntax.comment }}>// comment</p>
        </div>
      </div>
    </div>
  );
}
