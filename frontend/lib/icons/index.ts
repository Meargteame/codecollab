// Icon system exports
// Comprehensive icon system for file types, folders, and UI elements

export { FileIcon } from './FileIcon';
export { FolderIcon } from './FolderIcon';

export {
  getFileIconType,
  getFolderIconType,
  getFileIconColor,
  getFolderIconColor,
  isTestFile,
  isConfigFile,
  getFileTypeDescription,
} from './iconResolver';

export { FILE_ICON_MAP, SPECIAL_FILE_MAP } from './fileIconMap';
export { FOLDER_ICON_MAP } from './folderIconMap';

export type { IconDefinition, IconConfig, FileExtension, FolderName, IconName } from './types';
