/**
 * Theme Contrast Validation Script
 * 
 * This script validates that all theme colors meet WCAG AA contrast requirements:
 * - Normal text: 4.5:1 minimum contrast ratio
 * - Large text (18pt+): 3:1 minimum contrast ratio
 * - UI components: 3:1 minimum contrast ratio
 */

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calculate relative luminance
function getLuminance(rgb) {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    const v = val / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Calculate contrast ratio
function getContrastRatio(foreground, background) {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) return 0;

  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Premium dark theme colors
const theme = {
  background: '#0a0a0a',
  foreground: '#e4e4e7',
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
  accents: {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  }
};

// Validation results
const results = [];

// Validate normal text (4.5:1 minimum)
const normalTextColors = [
  { name: 'Foreground', color: theme.foreground },
  { name: 'Syntax Keyword', color: theme.syntax.keyword },
  { name: 'Syntax String', color: theme.syntax.string },
  { name: 'Syntax Number', color: theme.syntax.number },
  { name: 'Syntax Comment', color: theme.syntax.comment },
  { name: 'Syntax Function', color: theme.syntax.function },
  { name: 'Syntax Variable', color: theme.syntax.variable },
  { name: 'Syntax Type', color: theme.syntax.type },
  { name: 'Syntax Operator', color: theme.syntax.operator },
];

normalTextColors.forEach(({ name, color }) => {
  const ratio = getContrastRatio(color, theme.background);
  results.push({
    name,
    ratio: Math.round(ratio * 10) / 10,
    required: 4.5,
    passes: ratio >= 4.5
  });
});

// Validate large text / UI components (3:1 minimum)
const largeTextColors = [
  { name: 'Primary Accent', color: theme.accents.primary },
  { name: 'Success Color', color: theme.accents.success },
  { name: 'Warning Color', color: theme.accents.warning },
  { name: 'Error Color', color: theme.accents.error },
];

largeTextColors.forEach(({ name, color }) => {
  const ratio = getContrastRatio(color, theme.background);
  results.push({
    name,
    ratio: Math.round(ratio * 10) / 10,
    required: 3.0,
    passes: ratio >= 3.0
  });
});

// Print results
console.log('\n=== WCAG AA Contrast Validation Results ===\n');

let allPassed = true;
results.forEach(result => {
  const status = result.passes ? '✓ PASS' : '✗ FAIL';
  const statusColor = result.passes ? '\x1b[32m' : '\x1b[31m';
  const resetColor = '\x1b[0m';
  
  console.log(`${statusColor}${status}${resetColor} ${result.name}: ${result.ratio}:1 (required: ${result.required}:1)`);
  
  if (!result.passes) {
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(45) + '\n');

if (allPassed) {
  console.log('\x1b[32m✓ All colors meet WCAG AA contrast requirements!\x1b[0m\n');
  process.exit(0);
} else {
  console.log('\x1b[31m✗ Some colors do not meet WCAG AA requirements.\x1b[0m\n');
  process.exit(1);
}
