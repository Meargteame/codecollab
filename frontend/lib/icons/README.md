# Icon System

A comprehensive icon system for the CodeCollab editor with 50+ file type icons, special folder icons, and utility functions for icon resolution.

## Features

- **50+ File Type Icons**: Comprehensive coverage of common file types including JavaScript, TypeScript, Python, Go, Rust, and more
- **Special Folder Icons**: Custom icons for common folder names (src, test, components, utils, etc.)
- **Color-Coded Icons**: Each icon type has a distinctive color for quick visual identification
- **Utility Functions**: Helper functions for resolving file/folder names to icon types
- **Type-Safe**: Full TypeScript support with type definitions
- **Consistent Sizing**: All icons default to 16x16px for consistency

## Installation

The icon system uses `react-icons` which is already installed in the project.

## Usage

### File Icons

```tsx
import { FileIcon, getFileIconType } from '@/lib/icons';

// Direct usage with icon type
<FileIcon type="javascript" size={16} />

// Resolve icon type from filename
const iconType = getFileIconType('index.tsx');
<FileIcon type={iconType} size={16} />
```

### Folder Icons

```tsx
import { FolderIcon, getFolderIconType } from '@/lib/icons';

// Direct usage with icon type
<FolderIcon type="folder-src" isOpen={false} size={16} />

// Resolve icon type from folder name
const iconType = getFolderIconType('components');
<FolderIcon type={iconType} isOpen={true} size={16} />
```

### Icon Resolution

```tsx
import {
  getFileIconType,
  getFolderIconType,
  getFileIconColor,
  isTestFile,
  isConfigFile,
  getFileTypeDescription,
} from '@/lib/icons';

// Get icon type for a file
const fileIconType = getFileIconType('app.tsx'); // 'react-typescript'

// Get icon type for a folder
const folderIconType = getFolderIconType('src'); // 'folder-src'

// Get color for an icon type
const color = getFileIconColor('javascript'); // '#F7DF1E'

// Check if file is a test file
const isTest = isTestFile('app.test.ts'); // true

// Check if file is a config file
const isConfig = isConfigFile('webpack.config.js'); // true

// Get human-readable description
const description = getFileTypeDescription('typescript'); // 'TypeScript File'
```

## Supported File Types

### JavaScript/TypeScript
- `.js`, `.jsx`, `.mjs`, `.cjs` → JavaScript icon
- `.ts`, `.tsx` → TypeScript/React TypeScript icon

### Web
- `.html`, `.htm` → HTML icon
- `.css` → CSS icon
- `.scss`, `.sass` → Sass icon
- `.less` → Less icon

### Data/Config
- `.json`, `.jsonc`, `.json5` → JSON icon
- `.yaml`, `.yml` → YAML icon
- `.toml` → TOML icon
- `.xml` → XML icon
- `.csv` → CSV icon

### Documentation
- `.md`, `.mdx` → Markdown icon
- `.txt` → Text icon
- `.pdf` → PDF icon
- `README.md` → README icon

### Programming Languages
- `.py` → Python icon
- `.go` → Go icon
- `.rs` → Rust icon
- `.java` → Java icon
- `.c`, `.h` → C icon
- `.cpp`, `.cc`, `.cxx`, `.hpp` → C++ icon
- `.cs` → C# icon
- `.php` → PHP icon
- `.rb` → Ruby icon
- `.swift` → Swift icon
- `.kt`, `.kts` → Kotlin icon
- `.scala` → Scala icon
- `.r` → R icon
- `.lua` → Lua icon
- `.pl` → Perl icon
- `.sh`, `.bash`, `.zsh`, `.fish` → Shell icon

### Build/Config Files
- `dockerfile`, `.dockerignore` → Docker icon
- `makefile` → Makefile icon
- `webpack.config.js` → Webpack icon
- `vite.config.js/ts` → Vite icon
- `rollup.config.js` → Rollup icon
- `tailwind.config.js/ts` → Tailwind icon
- `next.config.js/ts` → Next.js icon

### Package Managers
- `package.json`, `package-lock.json` → NPM icon
- `yarn.lock` → Yarn icon
- `pnpm-lock.yaml` → PNPM icon
- `composer.json` → Composer icon
- `cargo.toml` → Rust icon
- `go.mod` → Go icon
- `requirements.txt` → Python icon

### Version Control
- `.gitignore`, `.gitattributes`, `.gitmodules` → Git icon

### Images
- `.png`, `.jpg`, `.jpeg`, `.gif`, `.ico`, `.webp`, `.bmp` → Image icon
- `.svg` → SVG icon

### Media
- `.mp3`, `.wav`, `.ogg` → Audio icon
- `.mp4`, `.avi`, `.mov`, `.webm` → Video icon

### Archives
- `.zip`, `.tar`, `.gz`, `.rar`, `.7z` → Archive icon

### Databases
- `.sql`, `.db`, `.sqlite` → Database icon

### Testing
- `.test.js/ts/jsx/tsx`, `.spec.js/ts/jsx/tsx` → Test icon

### Environment
- `.env`, `.env.local`, `.env.development`, `.env.production` → Environment icon

### License
- `LICENSE`, `LICENSE.md`, `LICENSE.txt` → License icon

### Linters/Formatters
- `.eslintrc*` → ESLint icon
- `.prettierrc*` → Prettier icon

### Testing Frameworks
- `jest.config.js/ts` → Jest icon
- `vitest.config.js/ts` → Vitest icon

## Supported Folder Types

### Source Code
- `src`, `source`, `sources` → Source folder icon

### Testing
- `test`, `tests`, `__tests__`, `spec`, `specs` → Test folder icon

### Public/Static
- `public`, `static`, `assets` → Public folder icon

### Components
- `components`, `component`, `widgets` → Components folder icon

### Utilities
- `utils`, `util`, `helpers` → Utils folder icon
- `lib`, `libs`, `library` → Library folder icon

### Configuration
- `config`, `configs`, `configuration` → Config folder icon

### Build/Distribution
- `dist`, `build`, `out`, `output` → Distribution folder icon

### Node Modules
- `node_modules` → Node.js folder icon

### Documentation
- `docs`, `doc`, `documentation` → Documentation folder icon

### API
- `api`, `apis`, `routes`, `endpoints` → API folder icon

### Database
- `db`, `database`, `migrations` → Database folder icon

### Styles
- `styles`, `style`, `css`, `scss` → Styles folder icon

### Images
- `images`, `img`, `imgs`, `icons` → Images folder icon

### Scripts
- `scripts`, `script` → Scripts folder icon

### Types
- `types`, `type`, `@types` → Types folder icon

### Hooks
- `hooks`, `hook` → Hooks folder icon

### Context
- `contexts`, `context`, `providers` → Context folder icon

### Services
- `services`, `service` → Services folder icon

### Models
- `models`, `model` → Models folder icon

### Controllers
- `controllers`, `controller` → Controllers folder icon

### Views
- `views`, `view`, `pages`, `page` → Views folder icon

### Git
- `.git` → Git folder icon

### IDE
- `.vscode` → VS Code folder icon
- `.idea` → IntelliJ IDEA folder icon

### Packages
- `packages`, `package` → Packages folder icon

### Temp
- `tmp`, `temp`, `cache`, `.cache` → Temp folder icon

## Color Scheme

Each icon type has a distinctive color for quick visual identification:

- **JavaScript**: `#F7DF1E` (yellow)
- **TypeScript**: `#3178C6` (blue)
- **React**: `#61DAFB` (cyan)
- **Python**: `#3776AB` (blue)
- **Go**: `#00ADD8` (cyan)
- **Rust**: `#CE422B` (red)
- **HTML**: `#E34F26` (orange)
- **CSS**: `#1572B6` (blue)
- **JSON**: `#5E5C5C` (gray)
- **Markdown**: `#000000` (black)
- **Git**: `#F05032` (orange)
- **Docker**: `#2496ED` (blue)
- **Test**: `#10B981` (green)
- **Database**: `#0EA5E9` (blue)

## API Reference

### Components

#### `FileIcon`

Renders an icon for a file type.

**Props:**
- `type: string` - The icon type identifier (required)
- `size?: number` - Icon size in pixels (default: 16)
- `className?: string` - Additional CSS classes

**Example:**
```tsx
<FileIcon type="javascript" size={20} className="mr-2" />
```

#### `FolderIcon`

Renders an icon for a folder type.

**Props:**
- `type: string` - The icon type identifier (required)
- `isOpen?: boolean` - Whether the folder is open (default: false)
- `size?: number` - Icon size in pixels (default: 16)
- `className?: string` - Additional CSS classes

**Example:**
```tsx
<FolderIcon type="folder-src" isOpen={true} size={20} className="mr-2" />
```

### Utility Functions

#### `getFileIconType(fileName: string): string`

Resolves a file name to an icon type identifier.

**Parameters:**
- `fileName: string` - The file name (e.g., "index.tsx")

**Returns:** Icon type identifier (e.g., "react-typescript")

#### `getFolderIconType(folderName: string): string`

Resolves a folder name to an icon type identifier.

**Parameters:**
- `folderName: string` - The folder name (e.g., "components")

**Returns:** Icon type identifier (e.g., "folder-components")

#### `getFileIconColor(iconType: string): string`

Gets the color for a file icon type.

**Parameters:**
- `iconType: string` - The icon type identifier

**Returns:** Hex color code (e.g., "#F7DF1E")

#### `getFolderIconColor(iconType: string): string`

Gets the color for a folder icon type.

**Parameters:**
- `iconType: string` - The icon type identifier

**Returns:** Hex color code (e.g., "#3B82F6")

#### `isTestFile(fileName: string): boolean`

Checks if a file is a test file.

**Parameters:**
- `fileName: string` - The file name

**Returns:** `true` if the file is a test file

#### `isConfigFile(fileName: string): boolean`

Checks if a file is a configuration file.

**Parameters:**
- `fileName: string` - The file name

**Returns:** `true` if the file is a configuration file

#### `getFileTypeDescription(iconType: string): string`

Gets a human-readable description of a file type.

**Parameters:**
- `iconType: string` - The icon type identifier

**Returns:** Human-readable description (e.g., "JavaScript File")

## Integration Examples

### File Tree Component

```tsx
import { FileIcon, FolderIcon, getFileIconType, getFolderIconType } from '@/lib/icons';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  isOpen?: boolean;
}

function FileTreeItem({ node }: { node: FileNode }) {
  if (node.type === 'folder') {
    const iconType = getFolderIconType(node.name);
    return (
      <div>
        <FolderIcon type={iconType} isOpen={node.isOpen} />
        <span>{node.name}</span>
      </div>
    );
  }

  const iconType = getFileIconType(node.name);
  return (
    <div>
      <FileIcon type={iconType} />
      <span>{node.name}</span>
    </div>
  );
}
```

### Tab Bar Component

```tsx
import { FileIcon, getFileIconType } from '@/lib/icons';

interface Tab {
  id: string;
  fileName: string;
  isDirty: boolean;
}

function TabItem({ tab }: { tab: Tab }) {
  const iconType = getFileIconType(tab.fileName);
  
  return (
    <div className="flex items-center gap-2">
      <FileIcon type={iconType} size={16} />
      <span>{tab.fileName}</span>
      {tab.isDirty && <span className="w-2 h-2 rounded-full bg-blue-500" />}
    </div>
  );
}
```

### Breadcrumbs Component

```tsx
import { FileIcon, getFileIconType } from '@/lib/icons';

function Breadcrumbs({ filePath }: { filePath: string }) {
  const fileName = filePath.split('/').pop() || '';
  const iconType = getFileIconType(fileName);
  
  return (
    <div className="flex items-center gap-2">
      <FileIcon type={iconType} size={16} />
      <span>{filePath}</span>
    </div>
  );
}
```

## Testing

The icon system includes comprehensive unit tests:

```bash
npm test -- lib/icons
```

Tests cover:
- Icon resolution for all file types
- Icon resolution for all folder types
- Color mapping
- Utility functions (isTestFile, isConfigFile, etc.)
- React component rendering
- Edge cases and default behavior

## Performance

- Icons are rendered using SVG for crisp display at any size
- Icon resolution is O(1) using hash maps
- No external API calls or network requests
- Minimal bundle size impact (icons are tree-shakeable)

## Accessibility

- All icons have appropriate ARIA labels
- Icons use semantic colors with sufficient contrast
- Icons are keyboard-navigable when interactive
- Screen reader support through proper labeling

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- All modern browsers with SVG support

## Contributing

To add new file types or folder types:

1. Add the mapping to `fileIconMap.ts` or `folderIconMap.ts`
2. Add the icon component to `FileIcon.tsx` or `FolderIcon.tsx`
3. Add the color to `iconResolver.ts`
4. Add tests to the test files
5. Update this README with the new icon type

## License

Part of the CodeCollab project.
