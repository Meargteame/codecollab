import React from 'react';
import { render } from '@testing-library/react';
import { FileIcon } from './FileIcon';

describe('FileIcon', () => {
  it('should render without crashing', () => {
    const { container } = render(<FileIcon type="javascript" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with custom size', () => {
    const { container } = render(<FileIcon type="javascript" size={24} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('should render with custom className', () => {
    const { container } = render(<FileIcon type="javascript" className="custom-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('should render JavaScript icon', () => {
    const { container } = render(<FileIcon type="javascript" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render TypeScript icon', () => {
    const { container } = render(<FileIcon type="typescript" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render React icon', () => {
    const { container } = render(<FileIcon type="react" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render Python icon', () => {
    const { container } = render(<FileIcon type="python" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render default icon for unknown type', () => {
    const { container } = render(<FileIcon type="unknown" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render HTML icon', () => {
    const { container } = render(<FileIcon type="html" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render CSS icon', () => {
    const { container } = render(<FileIcon type="css" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render JSON icon', () => {
    const { container } = render(<FileIcon type="json" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render Markdown icon', () => {
    const { container } = render(<FileIcon type="markdown" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render test file icon', () => {
    const { container } = render(<FileIcon type="test" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render Docker icon', () => {
    const { container } = render(<FileIcon type="docker" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render Git icon', () => {
    const { container } = render(<FileIcon type="git" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render image icon', () => {
    const { container } = render(<FileIcon type="image" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render database icon', () => {
    const { container } = render(<FileIcon type="database" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
