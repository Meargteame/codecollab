import React from 'react';
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiHtml5,
  SiCss3,
  SiSass,
  SiLess,
  SiJson,
  SiYaml,
  SiMarkdown,
  SiPython,
  SiGo,
  SiRust,
  SiJava,
  SiC,
  SiCplusplus,
  SiCsharp,
  SiPhp,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiScala,
  SiR,
  SiLua,
  SiPerl,
  SiGnubash,
  SiDocker,
  SiWebpack,
  SiVite,
  SiRollup,
  SiNpm,
  SiYarn,
  SiPnpm,
  SiComposer,
  SiGit,
  SiSvg,
  SiSqlite,
  SiEslint,
  SiPrettier,
  SiJest,
  SiVitest,
  SiTailwindcss,
  SiNextdotjs,
} from 'react-icons/si';
import {
  VscFile,
  VscFileMedia,
  VscFilePdf,
  VscFileZip,
  VscDatabase,
  VscBeaker,
  VscKey,
  VscBook,
  VscLaw,
} from 'react-icons/vsc';
import { AiFillFileImage, AiFillAudio, AiFillVideoCamera } from 'react-icons/ai';

interface FileIconProps {
  type: string;
  size?: number;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ type, size = 16, className = '' }) => {
  const iconProps = { size, className };

  switch (type) {
    // JavaScript/TypeScript
    case 'javascript':
      return <SiJavascript {...iconProps} color="#F7DF1E" />;
    case 'typescript':
      return <SiTypescript {...iconProps} color="#3178C6" />;
    case 'react':
      return <SiReact {...iconProps} color="#61DAFB" />;
    case 'react-typescript':
      return <SiReact {...iconProps} color="#61DAFB" />;

    // Web
    case 'html':
      return <SiHtml5 {...iconProps} color="#E34F26" />;
    case 'css':
      return <SiCss3 {...iconProps} color="#1572B6" />;
    case 'sass':
      return <SiSass {...iconProps} color="#CC6699" />;
    case 'less':
      return <SiLess {...iconProps} color="#1D365D" />;

    // Data/Config
    case 'json':
      return <SiJson {...iconProps} color="#5E5C5C" />;
    case 'yaml':
      return <SiYaml {...iconProps} color="#CB171E" />;
    case 'toml':
      return <VscFile {...iconProps} color="#9C4221" />;
    case 'xml':
      return <VscFile {...iconProps} color="#E37933" />;
    case 'csv':
      return <VscFile {...iconProps} color="#0F9D58" />;

    // Documentation
    case 'markdown':
      return <SiMarkdown {...iconProps} color="#000000" />;
    case 'text':
      return <VscFile {...iconProps} color="#6B7280" />;
    case 'pdf':
      return <VscFilePdf {...iconProps} color="#F40F02" />;
    case 'readme':
      return <VscBook {...iconProps} color="#3B82F6" />;

    // Programming Languages
    case 'python':
      return <SiPython {...iconProps} color="#3776AB" />;
    case 'go':
      return <SiGo {...iconProps} color="#00ADD8" />;
    case 'rust':
      return <SiRust {...iconProps} color="#CE422B" />;
    case 'java':
      return <SiJava {...iconProps} color="#007396" />;
    case 'c':
      return <SiC {...iconProps} color="#A8B9CC" />;
    case 'cpp':
      return <SiCplusplus {...iconProps} color="#00599C" />;
    case 'csharp':
      return <SiCsharp {...iconProps} color="#239120" />;
    case 'php':
      return <SiPhp {...iconProps} color="#777BB4" />;
    case 'ruby':
      return <SiRuby {...iconProps} color="#CC342D" />;
    case 'swift':
      return <SiSwift {...iconProps} color="#FA7343" />;
    case 'kotlin':
      return <SiKotlin {...iconProps} color="#7F52FF" />;
    case 'scala':
      return <SiScala {...iconProps} color="#DC322F" />;
    case 'r':
      return <SiR {...iconProps} color="#276DC3" />;
    case 'lua':
      return <SiLua {...iconProps} color="#2C2D72" />;
    case 'perl':
      return <SiPerl {...iconProps} color="#39457E" />;
    case 'shell':
      return <SiGnubash {...iconProps} color="#4EAA25" />;

    // Build/Config
    case 'docker':
      return <SiDocker {...iconProps} color="#2496ED" />;
    case 'makefile':
      return <VscFile {...iconProps} color="#6D8086" />;
    case 'cmake':
      return <VscFile {...iconProps} color="#064F8C" />;
    case 'gradle':
      return <VscFile {...iconProps} color="#02303A" />;
    case 'webpack':
      return <SiWebpack {...iconProps} color="#8DD6F9" />;
    case 'vite':
      return <SiVite {...iconProps} color="#646CFF" />;
    case 'rollup':
      return <SiRollup {...iconProps} color="#EC4A3F" />;

    // Package Managers
    case 'npm':
      return <SiNpm {...iconProps} color="#CB3837" />;
    case 'yarn':
      return <SiYarn {...iconProps} color="#2C8EBB" />;
    case 'pnpm':
      return <SiPnpm {...iconProps} color="#F69220" />;
    case 'composer':
      return <SiComposer {...iconProps} color="#885630" />;

    // Version Control
    case 'git':
      return <SiGit {...iconProps} color="#F05032" />;

    // Images
    case 'image':
      return <AiFillFileImage {...iconProps} color="#10B981" />;
    case 'svg':
      return <SiSvg {...iconProps} color="#FFB13B" />;

    // Media
    case 'audio':
      return <AiFillAudio {...iconProps} color="#8B5CF6" />;
    case 'video':
      return <AiFillVideoCamera {...iconProps} color="#EC4899" />;

    // Archives
    case 'archive':
      return <VscFileZip {...iconProps} color="#F59E0B" />;

    // Database
    case 'database':
      return <VscDatabase {...iconProps} color="#0EA5E9" />;

    // Testing
    case 'test':
      return <VscBeaker {...iconProps} color="#10B981" />;

    // Environment
    case 'env':
      return <VscKey {...iconProps} color="#EAB308" />;

    // License
    case 'license':
      return <VscLaw {...iconProps} color="#6B7280" />;

    // Linters/Formatters
    case 'eslint':
      return <SiEslint {...iconProps} color="#4B32C3" />;
    case 'prettier':
      return <SiPrettier {...iconProps} color="#F7B93E" />;

    // Testing Frameworks
    case 'jest':
      return <SiJest {...iconProps} color="#C21325" />;
    case 'vitest':
      return <SiVitest {...iconProps} color="#6E9F18" />;

    // Frameworks
    case 'tailwind':
      return <SiTailwindcss {...iconProps} color="#06B6D4" />;
    case 'next':
      return <SiNextdotjs {...iconProps} color="#000000" />;

    // Default
    default:
      return <VscFile {...iconProps} color="#6B7280" />;
  }
};
