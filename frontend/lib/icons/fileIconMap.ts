// File extension to icon type mappings
// Maps file extensions to icon identifiers for 50+ file types

export const FILE_ICON_MAP: Record<string, string> = {
  // JavaScript/TypeScript
  'js': 'javascript',
  'jsx': 'react',
  'ts': 'typescript',
  'tsx': 'react-typescript',
  'mjs': 'javascript',
  'cjs': 'javascript',
  
  // Web
  'html': 'html',
  'htm': 'html',
  'css': 'css',
  'scss': 'sass',
  'sass': 'sass',
  'less': 'less',
  
  // Data/Config
  'json': 'json',
  'jsonc': 'json',
  'json5': 'json',
  'yaml': 'yaml',
  'yml': 'yaml',
  'toml': 'toml',
  'xml': 'xml',
  'csv': 'csv',
  
  // Documentation
  'md': 'markdown',
  'mdx': 'markdown',
  'txt': 'text',
  'pdf': 'pdf',
  
  // Programming Languages
  'py': 'python',
  'pyc': 'python',
  'pyd': 'python',
  'pyw': 'python',
  'pyx': 'python',
  'go': 'go',
  'rs': 'rust',
  'java': 'java',
  'class': 'java',
  'jar': 'java',
  'c': 'c',
  'h': 'c',
  'cpp': 'cpp',
  'cc': 'cpp',
  'cxx': 'cpp',
  'hpp': 'cpp',
  'cs': 'csharp',
  'php': 'php',
  'rb': 'ruby',
  'swift': 'swift',
  'kt': 'kotlin',
  'kts': 'kotlin',
  'scala': 'scala',
  'r': 'r',
  'lua': 'lua',
  'pl': 'perl',
  'sh': 'shell',
  'bash': 'shell',
  'zsh': 'shell',
  'fish': 'shell',
  
  // Build/Config Files
  'dockerfile': 'docker',
  'dockerignore': 'docker',
  'makefile': 'makefile',
  'cmake': 'cmake',
  'gradle': 'gradle',
  'webpack': 'webpack',
  'vite': 'vite',
  'rollup': 'rollup',
  
  // Package Managers
  'package.json': 'npm',
  'package-lock.json': 'npm',
  'yarn.lock': 'yarn',
  'pnpm-lock.yaml': 'pnpm',
  'composer.json': 'composer',
  'gemfile': 'ruby',
  'cargo.toml': 'rust',
  'go.mod': 'go',
  'requirements.txt': 'python',
  
  // Version Control
  'gitignore': 'git',
  'gitattributes': 'git',
  'gitmodules': 'git',
  
  // Images
  'png': 'image',
  'jpg': 'image',
  'jpeg': 'image',
  'gif': 'image',
  'svg': 'svg',
  'ico': 'image',
  'webp': 'image',
  'bmp': 'image',
  
  // Media
  'mp3': 'audio',
  'wav': 'audio',
  'ogg': 'audio',
  'mp4': 'video',
  'avi': 'video',
  'mov': 'video',
  'webm': 'video',
  
  // Archives
  'zip': 'archive',
  'tar': 'archive',
  'gz': 'archive',
  'rar': 'archive',
  '7z': 'archive',
  
  // Databases
  'sql': 'database',
  'db': 'database',
  'sqlite': 'database',
  
  // Testing
  'test.js': 'test',
  'test.ts': 'test',
  'test.jsx': 'test',
  'test.tsx': 'test',
  'spec.js': 'test',
  'spec.ts': 'test',
  'spec.jsx': 'test',
  'spec.tsx': 'test',
  
  // Environment
  'env': 'env',
  'env.local': 'env',
  'env.development': 'env',
  'env.production': 'env',
  'env.test': 'env',
  
  // License
  'license': 'license',
  'license.md': 'license',
  'license.txt': 'license',
  
  // README
  'readme': 'readme',
  'readme.md': 'readme',
  'readme.txt': 'readme',
};

// Special filename mappings (exact matches)
export const SPECIAL_FILE_MAP: Record<string, string> = {
  'package.json': 'npm',
  'package-lock.json': 'npm',
  'tsconfig.json': 'typescript',
  'jsconfig.json': 'javascript',
  'webpack.config.js': 'webpack',
  'vite.config.js': 'vite',
  'vite.config.ts': 'vite',
  'rollup.config.js': 'rollup',
  'tailwind.config.js': 'tailwind',
  'tailwind.config.ts': 'tailwind',
  'next.config.js': 'next',
  'next.config.ts': 'next',
  'dockerfile': 'docker',
  '.dockerignore': 'docker',
  'makefile': 'makefile',
  '.gitignore': 'git',
  '.gitattributes': 'git',
  '.gitmodules': 'git',
  '.eslintrc': 'eslint',
  '.eslintrc.js': 'eslint',
  '.eslintrc.json': 'eslint',
  '.prettierrc': 'prettier',
  '.prettierrc.js': 'prettier',
  '.prettierrc.json': 'prettier',
  'jest.config.js': 'jest',
  'jest.config.ts': 'jest',
  'vitest.config.js': 'vitest',
  'vitest.config.ts': 'vitest',
  '.env': 'env',
  '.env.local': 'env',
  '.env.development': 'env',
  '.env.production': 'env',
  'readme.md': 'readme',
  'license': 'license',
  'license.md': 'license',
};
