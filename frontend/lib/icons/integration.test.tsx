import React from 'react';
import { render, screen } from '@testing-library/react';
import { FileIcon } from './FileIcon';
import { FolderIcon } from './FolderIcon';
import { getFileIconType, getFolderIconType } from './iconResolver';

describe('Icon System Integration', () => {
  describe('File Icon Integration', () => {
    it('should resolve and render JavaScript file icon', () => {
      const iconType = getFileIconType('app.js');
      const { container } = render(<FileIcon type={iconType} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(iconType).toBe('javascript');
    });

    it('should resolve and render TypeScript file icon', () => {
      const iconType = getFileIconType('index.tsx');
      const { container } = render(<FileIcon type={iconType} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(iconType).toBe('react-typescript');
    });

    it('should resolve and render package.json icon', () => {
      const iconType = getFileIconType('package.json');
      const { container } = render(<FileIcon type={iconType} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(iconType).toBe('npm');
    });

    it('should resolve and render test file icon', () => {
      const iconType = getFileIconType('app.test.ts');
      const { container } = render(<FileIcon type={iconType} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(iconType).toBe('test');
    });

    it('should handle unknown file types gracefully', () => {
      const iconType = getFileIconType('unknown.xyz');
      const { container } = render(<FileIcon type={iconType} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(iconType).toBe('file');
    });
  });

  describe('Folder Icon Integration', () => {
    it('should resolve and render src folder icon', () => {
      const iconType = getFolderIconType('src');
      const { container } = render(<FolderIcon type={iconType} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(iconType).toBe('folder-src');
    });

    it('should resolve and render components folder icon', () => {
      const iconType = getFolderIconType('components');
      const { container } = render(<FolderIcon type={iconType} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(iconType).toBe('folder-components');
    });

    it('should resolve and render test folder icon', () => {
      const iconType = getFolderIconType('__tests__');
      const { container } = render(<FolderIcon type={iconType} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(iconType).toBe('folder-test');
    });

    it('should handle unknown folder types gracefully', () => {
      const iconType = getFolderIconType('unknown');
      const { container } = render(<FolderIcon type={iconType} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(iconType).toBe('folder');
    });

    it('should render open and closed folder states', () => {
      const iconType = getFolderIconType('custom');
      const { container: closedContainer } = render(
        <FolderIcon type={iconType} isOpen={false} />
      );
      const { container: openContainer } = render(
        <FolderIcon type={iconType} isOpen={true} />
      );
      
      expect(closedContainer.firstChild).toBeInTheDocument();
      expect(openContainer.firstChild).toBeInTheDocument();
    });
  });

  describe('Real-world File Tree Scenario', () => {
    it('should handle a typical project structure', () => {
      const projectStructure = [
        { name: 'src', type: 'folder' },
        { name: 'components', type: 'folder' },
        { name: 'App.tsx', type: 'file' },
        { name: 'index.tsx', type: 'file' },
        { name: 'styles.css', type: 'file' },
        { name: 'package.json', type: 'file' },
        { name: 'tsconfig.json', type: 'file' },
        { name: 'README.md', type: 'file' },
        { name: '.gitignore', type: 'file' },
        { name: 'node_modules', type: 'folder' },
      ];

      projectStructure.forEach((item) => {
        if (item.type === 'folder') {
          const iconType = getFolderIconType(item.name);
          const { container } = render(<FolderIcon type={iconType} />);
          expect(container.firstChild).toBeInTheDocument();
        } else {
          const iconType = getFileIconType(item.name);
          const { container } = render(<FileIcon type={iconType} />);
          expect(container.firstChild).toBeInTheDocument();
        }
      });
    });
  });

  describe('Icon Sizing', () => {
    it('should render icons at different sizes', () => {
      const sizes = [12, 16, 20, 24, 32];
      
      sizes.forEach((size) => {
        const { container } = render(<FileIcon type="javascript" size={size} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('height', size.toString());
      });
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className to file icons', () => {
      const { container } = render(
        <FileIcon type="javascript" className="custom-class" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom-class');
    });

    it('should apply custom className to folder icons', () => {
      const { container } = render(
        <FolderIcon type="folder" className="custom-class" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom-class');
    });
  });
});
