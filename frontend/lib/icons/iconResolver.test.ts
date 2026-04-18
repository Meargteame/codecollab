import {
  getFileIconType,
  getFolderIconType,
  getFileIconColor,
  getFolderIconColor,
  isTestFile,
  isConfigFile,
  getFileTypeDescription,
} from './iconResolver';

describe('Icon Resolver', () => {
  describe('getFileIconType', () => {
    it('should resolve JavaScript files', () => {
      expect(getFileIconType('index.js')).toBe('javascript');
      expect(getFileIconType('app.jsx')).toBe('react');
      expect(getFileIconType('module.mjs')).toBe('javascript');
      expect(getFileIconType('common.cjs')).toBe('javascript');
    });

    it('should resolve TypeScript files', () => {
      expect(getFileIconType('index.ts')).toBe('typescript');
      expect(getFileIconType('Component.tsx')).toBe('react-typescript');
    });

    it('should resolve web files', () => {
      expect(getFileIconType('index.html')).toBe('html');
      expect(getFileIconType('styles.css')).toBe('css');
      expect(getFileIconType('main.scss')).toBe('sass');
      expect(getFileIconType('theme.less')).toBe('less');
    });

    it('should resolve data/config files', () => {
      expect(getFileIconType('data.json')).toBe('json');
      expect(getFileIconType('config.yaml')).toBe('yaml');
      expect(getFileIconType('settings.yml')).toBe('yaml');
      expect(getFileIconType('data.xml')).toBe('xml');
    });

    it('should resolve documentation files', () => {
      expect(getFileIconType('README.md')).toBe('readme');
      expect(getFileIconType('docs.mdx')).toBe('markdown');
      expect(getFileIconType('notes.txt')).toBe('text');
      expect(getFileIconType('manual.pdf')).toBe('pdf');
    });

    it('should resolve programming language files', () => {
      expect(getFileIconType('script.py')).toBe('python');
      expect(getFileIconType('main.go')).toBe('go');
      expect(getFileIconType('lib.rs')).toBe('rust');
      expect(getFileIconType('App.java')).toBe('java');
      expect(getFileIconType('main.c')).toBe('c');
      expect(getFileIconType('app.cpp')).toBe('cpp');
      expect(getFileIconType('Program.cs')).toBe('csharp');
      expect(getFileIconType('index.php')).toBe('php');
      expect(getFileIconType('app.rb')).toBe('ruby');
      expect(getFileIconType('App.swift')).toBe('swift');
      expect(getFileIconType('Main.kt')).toBe('kotlin');
    });

    it('should resolve special filenames', () => {
      expect(getFileIconType('package.json')).toBe('npm');
      expect(getFileIconType('package-lock.json')).toBe('npm');
      expect(getFileIconType('tsconfig.json')).toBe('typescript');
      expect(getFileIconType('webpack.config.js')).toBe('webpack');
      expect(getFileIconType('vite.config.ts')).toBe('vite');
      expect(getFileIconType('dockerfile')).toBe('docker');
      expect(getFileIconType('.gitignore')).toBe('git');
      expect(getFileIconType('.eslintrc.json')).toBe('eslint');
      expect(getFileIconType('jest.config.js')).toBe('jest');
    });

    it('should resolve test files', () => {
      expect(getFileIconType('app.test.js')).toBe('test');
      expect(getFileIconType('component.test.tsx')).toBe('test');
      expect(getFileIconType('utils.spec.ts')).toBe('test');
    });

    it('should resolve image files', () => {
      expect(getFileIconType('logo.png')).toBe('image');
      expect(getFileIconType('photo.jpg')).toBe('image');
      expect(getFileIconType('icon.svg')).toBe('svg');
      expect(getFileIconType('banner.webp')).toBe('image');
    });

    it('should resolve media files', () => {
      expect(getFileIconType('song.mp3')).toBe('audio');
      expect(getFileIconType('sound.wav')).toBe('audio');
      expect(getFileIconType('video.mp4')).toBe('video');
      expect(getFileIconType('clip.webm')).toBe('video');
    });

    it('should resolve archive files', () => {
      expect(getFileIconType('archive.zip')).toBe('archive');
      expect(getFileIconType('backup.tar')).toBe('archive');
      expect(getFileIconType('compressed.gz')).toBe('archive');
    });

    it('should resolve database files', () => {
      expect(getFileIconType('query.sql')).toBe('database');
      expect(getFileIconType('data.db')).toBe('database');
      expect(getFileIconType('app.sqlite')).toBe('database');
    });

    it('should resolve environment files', () => {
      expect(getFileIconType('.env')).toBe('env');
      expect(getFileIconType('.env.local')).toBe('env');
      expect(getFileIconType('.env.production')).toBe('env');
    });

    it('should return default for unknown files', () => {
      expect(getFileIconType('unknown.xyz')).toBe('file');
      expect(getFileIconType('noextension')).toBe('file');
    });

    it('should be case-insensitive', () => {
      expect(getFileIconType('INDEX.JS')).toBe('javascript');
      expect(getFileIconType('README.MD')).toBe('readme');
      expect(getFileIconType('PACKAGE.JSON')).toBe('npm');
    });
  });

  describe('getFolderIconType', () => {
    it('should resolve source folders', () => {
      expect(getFolderIconType('src')).toBe('folder-src');
      expect(getFolderIconType('source')).toBe('folder-src');
      expect(getFolderIconType('sources')).toBe('folder-src');
    });

    it('should resolve test folders', () => {
      expect(getFolderIconType('test')).toBe('folder-test');
      expect(getFolderIconType('tests')).toBe('folder-test');
      expect(getFolderIconType('__tests__')).toBe('folder-test');
      expect(getFolderIconType('spec')).toBe('folder-test');
    });

    it('should resolve public folders', () => {
      expect(getFolderIconType('public')).toBe('folder-public');
      expect(getFolderIconType('static')).toBe('folder-public');
      expect(getFolderIconType('assets')).toBe('folder-public');
    });

    it('should resolve component folders', () => {
      expect(getFolderIconType('components')).toBe('folder-components');
      expect(getFolderIconType('component')).toBe('folder-components');
      expect(getFolderIconType('widgets')).toBe('folder-components');
    });

    it('should resolve utility folders', () => {
      expect(getFolderIconType('utils')).toBe('folder-utils');
      expect(getFolderIconType('helpers')).toBe('folder-utils');
      expect(getFolderIconType('lib')).toBe('folder-lib');
    });

    it('should resolve config folders', () => {
      expect(getFolderIconType('config')).toBe('folder-config');
      expect(getFolderIconType('configs')).toBe('folder-config');
    });

    it('should resolve build folders', () => {
      expect(getFolderIconType('dist')).toBe('folder-dist');
      expect(getFolderIconType('build')).toBe('folder-dist');
      expect(getFolderIconType('out')).toBe('folder-dist');
    });

    it('should resolve node_modules', () => {
      expect(getFolderIconType('node_modules')).toBe('folder-node');
    });

    it('should resolve documentation folders', () => {
      expect(getFolderIconType('docs')).toBe('folder-docs');
      expect(getFolderIconType('doc')).toBe('folder-docs');
    });

    it('should resolve API folders', () => {
      expect(getFolderIconType('api')).toBe('folder-api');
      expect(getFolderIconType('routes')).toBe('folder-api');
    });

    it('should resolve database folders', () => {
      expect(getFolderIconType('db')).toBe('folder-database');
      expect(getFolderIconType('database')).toBe('folder-database');
    });

    it('should resolve style folders', () => {
      expect(getFolderIconType('styles')).toBe('folder-styles');
      expect(getFolderIconType('css')).toBe('folder-styles');
      expect(getFolderIconType('scss')).toBe('folder-styles');
    });

    it('should resolve image folders', () => {
      expect(getFolderIconType('images')).toBe('folder-images');
      expect(getFolderIconType('img')).toBe('folder-images');
      expect(getFolderIconType('icons')).toBe('folder-images');
    });

    it('should resolve script folders', () => {
      expect(getFolderIconType('scripts')).toBe('folder-scripts');
    });

    it('should resolve type folders', () => {
      expect(getFolderIconType('types')).toBe('folder-types');
      expect(getFolderIconType('@types')).toBe('folder-types');
    });

    it('should resolve hook folders', () => {
      expect(getFolderIconType('hooks')).toBe('folder-hooks');
    });

    it('should resolve context folders', () => {
      expect(getFolderIconType('contexts')).toBe('folder-context');
      expect(getFolderIconType('providers')).toBe('folder-context');
    });

    it('should resolve service folders', () => {
      expect(getFolderIconType('services')).toBe('folder-services');
    });

    it('should resolve model folders', () => {
      expect(getFolderIconType('models')).toBe('folder-models');
    });

    it('should resolve view folders', () => {
      expect(getFolderIconType('views')).toBe('folder-views');
      expect(getFolderIconType('pages')).toBe('folder-views');
    });

    it('should resolve git folder', () => {
      expect(getFolderIconType('.git')).toBe('folder-git');
    });

    it('should resolve IDE folders', () => {
      expect(getFolderIconType('.vscode')).toBe('folder-vscode');
      expect(getFolderIconType('.idea')).toBe('folder-idea');
    });

    it('should return default for unknown folders', () => {
      expect(getFolderIconType('unknown')).toBe('folder');
      expect(getFolderIconType('custom')).toBe('folder');
    });

    it('should be case-insensitive', () => {
      expect(getFolderIconType('SRC')).toBe('folder-src');
      expect(getFolderIconType('COMPONENTS')).toBe('folder-components');
    });
  });

  describe('getFileIconColor', () => {
    it('should return correct colors for file types', () => {
      expect(getFileIconColor('javascript')).toBe('#F7DF1E');
      expect(getFileIconColor('typescript')).toBe('#3178C6');
      expect(getFileIconColor('react')).toBe('#61DAFB');
      expect(getFileIconColor('python')).toBe('#3776AB');
      expect(getFileIconColor('rust')).toBe('#CE422B');
    });

    it('should return default color for unknown types', () => {
      expect(getFileIconColor('unknown')).toBe('#6B7280');
    });
  });

  describe('getFolderIconColor', () => {
    it('should return correct colors for folder types', () => {
      expect(getFolderIconColor('folder-src')).toBe('#3B82F6');
      expect(getFolderIconColor('folder-test')).toBe('#10B981');
      expect(getFolderIconColor('folder-components')).toBe('#EC4899');
    });

    it('should return default color for unknown types', () => {
      expect(getFolderIconColor('unknown')).toBe('#F59E0B');
    });
  });

  describe('isTestFile', () => {
    it('should identify test files', () => {
      expect(isTestFile('app.test.js')).toBe(true);
      expect(isTestFile('component.test.tsx')).toBe(true);
      expect(isTestFile('utils.spec.ts')).toBe(true);
      expect(isTestFile('helper.spec.js')).toBe(true);
    });

    it('should not identify non-test files', () => {
      expect(isTestFile('app.js')).toBe(false);
      expect(isTestFile('component.tsx')).toBe(false);
      expect(isTestFile('utils.ts')).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(isTestFile('APP.TEST.JS')).toBe(true);
      expect(isTestFile('COMPONENT.SPEC.TS')).toBe(true);
    });
  });

  describe('isConfigFile', () => {
    it('should identify config files', () => {
      expect(isConfigFile('webpack.config.js')).toBe(true);
      expect(isConfigFile('vite.config.ts')).toBe(true);
      expect(isConfigFile('tsconfig.json')).toBe(true);
      expect(isConfigFile('.eslintrc')).toBe(true);
      expect(isConfigFile('jest.config.js')).toBe(true);
    });

    it('should not identify non-config files', () => {
      expect(isConfigFile('app.js')).toBe(false);
      expect(isConfigFile('component.tsx')).toBe(false);
      expect(isConfigFile('data.json')).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(isConfigFile('WEBPACK.CONFIG.JS')).toBe(true);
      expect(isConfigFile('TSCONFIG.JSON')).toBe(true);
    });
  });

  describe('getFileTypeDescription', () => {
    it('should return descriptions for file types', () => {
      expect(getFileTypeDescription('javascript')).toBe('JavaScript File');
      expect(getFileTypeDescription('typescript')).toBe('TypeScript File');
      expect(getFileTypeDescription('react')).toBe('React Component');
      expect(getFileTypeDescription('python')).toBe('Python File');
    });

    it('should return default description for unknown types', () => {
      expect(getFileTypeDescription('unknown')).toBe('File');
    });
  });
});
