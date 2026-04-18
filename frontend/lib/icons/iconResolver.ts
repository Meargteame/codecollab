// Icon resolution utilities
// Resolves file and folder names to appropriate icon types

import { FILE_ICON_MAP, SPECIAL_FILE_MAP } from './fileIconMap';
import { FOLDER_ICON_MAP } from './folderIconMap';

/**
 * Get the icon type for a file based on its name and extension
 * @param fileName - The full file name (e.g., "index.tsx", "package.json")
 * @returns The icon type identifier
 */
export function getFileIconType(fileName: string): string {
  const lowerFileName = fileName.toLowerCase();

  // Check for exact filename matches first (e.g., package.json, dockerfile)
  if (SPECIAL_FILE_MAP[lowerFileName]) {
    return SPECIAL_FILE_MAP[lowerFileName];
  }

  // Check for special patterns (e.g., .test.ts, .spec.js)
  if (lowerFileName.includes('.test.') || lowerFileName.includes('.spec.')) {
    return 'test';
  }

  // Extract extension
  const parts = fileName.split('.');
  if (parts.length > 1) {
    const extension = parts[parts.length - 1].toLowerCase();
    
    // Check extension mapping
    if (FILE_ICON_MAP[extension]) {
      return FILE_ICON_MAP[extension];
    }
  }

  // Default to generic file icon
  return 'file';
}

/**
 * Get the icon type for a folder based on its name
 * @param folderName - The folder name (e.g., "src", "components")
 * @returns The icon type identifier
 */
export function getFolderIconType(folderName: string): string {
  const lowerFolderName = folderName.toLowerCase();

  // Check for special folder names
  if (FOLDER_ICON_MAP[lowerFolderName]) {
    return FOLDER_ICON_MAP[lowerFolderName];
  }

  // Default to generic folder icon
  return 'folder';
}

/**
 * Get the color for a file icon based on its type
 * @param iconType - The icon type identifier
 * @returns Hex color code
 */
export function getFileIconColor(iconType: string): string {
  const colorMap: Record<string, string> = {
    javascript: '#F7DF1E',
    typescript: '#3178C6',
    react: '#61DAFB',
    'react-typescript': '#61DAFB',
    html: '#E34F26',
    css: '#1572B6',
    sass: '#CC6699',
    less: '#1D365D',
    json: '#5E5C5C',
    yaml: '#CB171E',
    markdown: '#000000',
    python: '#3776AB',
    go: '#00ADD8',
    rust: '#CE422B',
    java: '#007396',
    c: '#A8B9CC',
    cpp: '#00599C',
    csharp: '#239120',
    php: '#777BB4',
    ruby: '#CC342D',
    swift: '#FA7343',
    kotlin: '#7F52FF',
    scala: '#DC322F',
    r: '#276DC3',
    lua: '#2C2D72',
    perl: '#39457E',
    shell: '#4EAA25',
    docker: '#2496ED',
    webpack: '#8DD6F9',
    vite: '#646CFF',
    rollup: '#EC4A3F',
    npm: '#CB3837',
    yarn: '#2C8EBB',
    pnpm: '#F69220',
    composer: '#885630',
    git: '#F05032',
    image: '#10B981',
    svg: '#FFB13B',
    audio: '#8B5CF6',
    video: '#EC4899',
    archive: '#F59E0B',
    database: '#0EA5E9',
    test: '#10B981',
    env: '#EAB308',
    license: '#6B7280',
    eslint: '#4B32C3',
    prettier: '#F7B93E',
    jest: '#C21325',
    vitest: '#6E9F18',
    tailwind: '#06B6D4',
    next: '#000000',
    readme: '#3B82F6',
    pdf: '#F40F02',
  };

  return colorMap[iconType] || '#6B7280';
}

/**
 * Get the color for a folder icon based on its type
 * @param iconType - The icon type identifier
 * @returns Hex color code
 */
export function getFolderIconColor(iconType: string): string {
  const colorMap: Record<string, string> = {
    'folder-src': '#3B82F6',
    'folder-test': '#10B981',
    'folder-public': '#8B5CF6',
    'folder-components': '#EC4899',
    'folder-utils': '#F59E0B',
    'folder-lib': '#F59E0B',
    'folder-config': '#6B7280',
    'folder-dist': '#8B5CF6',
    'folder-node': '#339933',
    'folder-docs': '#3B82F6',
    'folder-api': '#0EA5E9',
    'folder-database': '#0EA5E9',
    'folder-styles': '#EC4899',
    'folder-images': '#10B981',
    'folder-scripts': '#F59E0B',
    'folder-types': '#3B82F6',
    'folder-hooks': '#8B5CF6',
    'folder-context': '#EC4899',
    'folder-services': '#0EA5E9',
    'folder-models': '#F59E0B',
    'folder-controllers': '#8B5CF6',
    'folder-views': '#3B82F6',
    'folder-git': '#F05032',
    'folder-vscode': '#007ACC',
    'folder-idea': '#000000',
    'folder-packages': '#F59E0B',
    'folder-temp': '#6B7280',
  };

  return colorMap[iconType] || '#F59E0B';
}

/**
 * Check if a file is a test file
 * @param fileName - The file name
 * @returns True if the file is a test file
 */
export function isTestFile(fileName: string): boolean {
  const lowerFileName = fileName.toLowerCase();
  return (
    lowerFileName.includes('.test.') ||
    lowerFileName.includes('.spec.') ||
    lowerFileName.endsWith('.test') ||
    lowerFileName.endsWith('.spec')
  );
}

/**
 * Check if a file is a configuration file
 * @param fileName - The file name
 * @returns True if the file is a configuration file
 */
export function isConfigFile(fileName: string): boolean {
  const lowerFileName = fileName.toLowerCase();
  const configPatterns = [
    'config',
    '.rc',
    '.config.',
    'tsconfig',
    'jsconfig',
    'webpack',
    'vite',
    'rollup',
    'tailwind',
    'next',
    'jest',
    'vitest',
    'eslint',
    'prettier',
  ];

  return configPatterns.some((pattern) => lowerFileName.includes(pattern));
}

/**
 * Get a human-readable description of a file type
 * @param iconType - The icon type identifier
 * @returns Human-readable description
 */
export function getFileTypeDescription(iconType: string): string {
  const descriptions: Record<string, string> = {
    javascript: 'JavaScript File',
    typescript: 'TypeScript File',
    react: 'React Component',
    'react-typescript': 'React TypeScript Component',
    html: 'HTML File',
    css: 'CSS File',
    sass: 'Sass File',
    less: 'Less File',
    json: 'JSON File',
    yaml: 'YAML File',
    markdown: 'Markdown File',
    python: 'Python File',
    go: 'Go File',
    rust: 'Rust File',
    java: 'Java File',
    c: 'C File',
    cpp: 'C++ File',
    csharp: 'C# File',
    php: 'PHP File',
    ruby: 'Ruby File',
    swift: 'Swift File',
    kotlin: 'Kotlin File',
    scala: 'Scala File',
    r: 'R File',
    lua: 'Lua File',
    perl: 'Perl File',
    shell: 'Shell Script',
    docker: 'Docker File',
    webpack: 'Webpack Config',
    vite: 'Vite Config',
    rollup: 'Rollup Config',
    npm: 'NPM Package',
    yarn: 'Yarn Package',
    pnpm: 'PNPM Package',
    git: 'Git File',
    image: 'Image File',
    svg: 'SVG Image',
    audio: 'Audio File',
    video: 'Video File',
    archive: 'Archive File',
    database: 'Database File',
    test: 'Test File',
    env: 'Environment File',
    license: 'License File',
    readme: 'README File',
    pdf: 'PDF Document',
  };

  return descriptions[iconType] || 'File';
}
