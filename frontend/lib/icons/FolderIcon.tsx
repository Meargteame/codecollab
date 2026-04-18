import React from 'react';
import {
  VscFolder,
  VscFolderOpened,
  VscFolderLibrary,
  VscBeaker,
  VscGlobe,
  VscSymbolClass,
  VscTools,
  VscSettingsGear,
  VscPackage,
  VscBook,
  VscServer,
  VscDatabase,
  VscSymbolColor,
  VscFileMedia,
  VscTerminal,
  VscSymbolInterface,
  VscExtensions,
  VscSymbolMethod,
  VscSymbolNamespace,
  VscSymbolVariable,
  VscBrowser,
  VscGitCommit,
  VscCode,
  VscFile,
} from 'react-icons/vsc';
import { SiNodedotjs, SiGit, SiVisualstudiocode } from 'react-icons/si';

interface FolderIconProps {
  type: string;
  isOpen?: boolean;
  size?: number;
  className?: string;
}

export const FolderIcon: React.FC<FolderIconProps> = ({
  type,
  isOpen = false,
  size = 16,
  className = '',
}) => {
  const iconProps = { size, className };

  // Special folder types with custom icons
  switch (type) {
    case 'folder-src':
      return <VscFolderLibrary {...iconProps} color="#3B82F6" />;

    case 'folder-test':
      return <VscBeaker {...iconProps} color="#10B981" />;

    case 'folder-public':
      return <VscGlobe {...iconProps} color="#8B5CF6" />;

    case 'folder-components':
      return <VscSymbolClass {...iconProps} color="#EC4899" />;

    case 'folder-utils':
    case 'folder-lib':
      return <VscTools {...iconProps} color="#F59E0B" />;

    case 'folder-config':
      return <VscSettingsGear {...iconProps} color="#6B7280" />;

    case 'folder-dist':
      return <VscPackage {...iconProps} color="#8B5CF6" />;

    case 'folder-node':
      return <SiNodedotjs {...iconProps} color="#339933" />;

    case 'folder-docs':
      return <VscBook {...iconProps} color="#3B82F6" />;

    case 'folder-api':
      return <VscServer {...iconProps} color="#0EA5E9" />;

    case 'folder-database':
      return <VscDatabase {...iconProps} color="#0EA5E9" />;

    case 'folder-styles':
      return <VscSymbolColor {...iconProps} color="#EC4899" />;

    case 'folder-images':
      return <VscFileMedia {...iconProps} color="#10B981" />;

    case 'folder-scripts':
      return <VscTerminal {...iconProps} color="#F59E0B" />;

    case 'folder-types':
      return <VscSymbolInterface {...iconProps} color="#3B82F6" />;

    case 'folder-hooks':
      return <VscExtensions {...iconProps} color="#8B5CF6" />;

    case 'folder-context':
      return <VscSymbolNamespace {...iconProps} color="#EC4899" />;

    case 'folder-services':
      return <VscSymbolMethod {...iconProps} color="#0EA5E9" />;

    case 'folder-models':
      return <VscSymbolVariable {...iconProps} color="#F59E0B" />;

    case 'folder-controllers':
      return <VscSymbolMethod {...iconProps} color="#8B5CF6" />;

    case 'folder-views':
      return <VscBrowser {...iconProps} color="#3B82F6" />;

    case 'folder-git':
      return <SiGit {...iconProps} color="#F05032" />;

    case 'folder-vscode':
      return <SiVisualstudiocode {...iconProps} color="#007ACC" />;

    case 'folder-idea':
      return <VscCode {...iconProps} color="#000000" />;

    case 'folder-packages':
      return <VscPackage {...iconProps} color="#F59E0B" />;

    case 'folder-temp':
      return <VscFile {...iconProps} color="#6B7280" />;

    // Default folder icon
    default:
      return isOpen ? (
        <VscFolderOpened {...iconProps} color="#F59E0B" />
      ) : (
        <VscFolder {...iconProps} color="#F59E0B" />
      );
  }
};
