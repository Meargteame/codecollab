import React from 'react';
import { render } from '@testing-library/react';
import { FolderIcon } from './FolderIcon';

describe('FolderIcon', () => {
  it('should render without crashing', () => {
    const { container } = render(<FolderIcon type="folder" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with custom size', () => {
    const { container } = render(<FolderIcon type="folder" size={24} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('should render with custom className', () => {
    const { container } = render(<FolderIcon type="folder" className="custom-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('should render closed folder by default', () => {
    const { container } = render(<FolderIcon type="folder" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render open folder when isOpen is true', () => {
    const { container } = render(<FolderIcon type="folder" isOpen={true} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render src folder icon', () => {
    const { container } = render(<FolderIcon type="folder-src" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render test folder icon', () => {
    const { container } = render(<FolderIcon type="folder-test" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render public folder icon', () => {
    const { container } = render(<FolderIcon type="folder-public" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render components folder icon', () => {
    const { container } = render(<FolderIcon type="folder-components" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render utils folder icon', () => {
    const { container } = render(<FolderIcon type="folder-utils" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render config folder icon', () => {
    const { container } = render(<FolderIcon type="folder-config" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render node_modules folder icon', () => {
    const { container } = render(<FolderIcon type="folder-node" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render docs folder icon', () => {
    const { container } = render(<FolderIcon type="folder-docs" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render api folder icon', () => {
    const { container } = render(<FolderIcon type="folder-api" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render database folder icon', () => {
    const { container } = render(<FolderIcon type="folder-database" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render styles folder icon', () => {
    const { container } = render(<FolderIcon type="folder-styles" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render images folder icon', () => {
    const { container } = render(<FolderIcon type="folder-images" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render hooks folder icon', () => {
    const { container } = render(<FolderIcon type="folder-hooks" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render context folder icon', () => {
    const { container } = render(<FolderIcon type="folder-context" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render git folder icon', () => {
    const { container } = render(<FolderIcon type="folder-git" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render default folder icon for unknown type', () => {
    const { container } = render(<FolderIcon type="unknown" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
