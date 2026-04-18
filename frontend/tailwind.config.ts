import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
      // Design tokens for premium editor UI
      spacing: {
        // 4px grid system
        '0.5': '2px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '12': '48px',
      },
      transitionDuration: {
        '150': '150ms', // Standard UI transitions
        '200': '200ms', // Animations (fold, slide)
        '250': '250ms', // Sidebar expand/collapse
        '300': '300ms', // Hover delays
        '500': '500ms', // Preview delays
        '600': '600ms', // Tab preview
        '800': '800ms', // Tooltip delays
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        'DEFAULT': '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        'overlay': '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      },
      colors: {
        // Premium dark theme colors
        editor: {
          bg: '#0a0a0a',
          fg: '#e4e4e7',
          selection: '#3b82f620',
          lineHighlight: '#ffffff08',
          cursor: '#3b82f6',
        },
        ui: {
          activityBar: '#0f0f0f',
          sideBar: '#121212',
          statusBar: '#0a0a0a',
          panel: '#0f0f0f',
          border: '#27272a',
          hover: '#18181b',
          active: '#3b82f6',
          focus: '#3b82f6',
          disabled: '#3f3f46',
        },
        syntax: {
          keyword: '#c084fc',
          string: '#34d399',
          number: '#fbbf24',
          comment: '#6b7280',
          function: '#60a5fa',
          variable: '#e4e4e7',
          type: '#a78bfa',
          operator: '#f472b6',
        },
      },
      borderRadius: {
        'none': '0', // Sharp corners for CodeCollab design system
      },
      opacity: {
        '8': '0.08',
        '12': '0.12',
      },
    },
  },
  plugins: [],
} satisfies Config;
