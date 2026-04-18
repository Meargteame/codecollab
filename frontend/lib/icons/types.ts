// Icon system type definitions

import { ReactNode } from 'react';

export interface IconDefinition {
  component: ReactNode;
  color: string;
  size?: number;
  variants?: {
    light?: ReactNode;
    dark?: ReactNode;
  };
}

export interface IconConfig {
  fileIcons: Map<string, IconDefinition>;
  folderIcons: Map<string, IconDefinition>;
  uiIcons: Map<string, IconDefinition>;
}

export type FileExtension = string;
export type FolderName = string;
export type IconName = string;
