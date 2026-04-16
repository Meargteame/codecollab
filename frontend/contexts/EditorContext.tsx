"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileNode[];
}

interface EditorTab {
  id: string;
  fileId: string;
  fileName: string;
  filePath: string;
  isDirty: boolean;
  content: string;
}

interface EditorContextType {
  fileTree: FileNode[];
  openTabs: EditorTab[];
  activeTabId: string | null;
  terminalOpen: boolean;
  terminalHeight: number;
  sidebarWidth: number;
  
  setFileTree: (tree: FileNode[]) => void;
  openFile: (file: FileNode, content: string) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabContent: (tabId: string, content: string) => void;
  markTabClean: (tabId: string) => void;
  setTerminalOpen: (open: boolean) => void;
  setTerminalHeight: (height: number) => void;
  setSidebarWidth: (width: number) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [fileTree, setFileTree] = useState<FileNode[]>([
    {
      id: "1",
      name: "src",
      type: "folder",
      path: "/src",
      children: [
        { id: "2", name: "index.tsx", type: "file", path: "/src/index.tsx" },
        { id: "3", name: "App.tsx", type: "file", path: "/src/App.tsx" },
        {
          id: "4",
          name: "components",
          type: "folder",
          path: "/src/components",
          children: [
            { id: "5", name: "Button.tsx", type: "file", path: "/src/components/Button.tsx" },
            { id: "6", name: "Header.tsx", type: "file", path: "/src/components/Header.tsx" },
          ],
        },
      ],
    },
    {
      id: "7",
      name: "public",
      type: "folder",
      path: "/public",
      children: [
        { id: "8", name: "index.html", type: "file", path: "/public/index.html" },
      ],
    },
    { id: "9", name: "package.json", type: "file", path: "/package.json" },
    { id: "10", name: "README.md", type: "file", path: "/README.md" },
  ]);

  const [openTabs, setOpenTabs] = useState<EditorTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [sidebarWidth, setSidebarWidth] = useState(250);

  const openFile = (file: FileNode, content: string) => {
    // Check if file is already open
    const existingTab = openTabs.find(tab => tab.fileId === file.id);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }

    // Create new tab
    const newTab: EditorTab = {
      id: `tab-${Date.now()}`,
      fileId: file.id,
      fileName: file.name,
      filePath: file.path,
      isDirty: false,
      content,
    };

    setOpenTabs([...openTabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    const newTabs = openTabs.filter(tab => tab.id !== tabId);
    setOpenTabs(newTabs);

    if (activeTabId === tabId) {
      setActiveTabId(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null);
    }
  };

  const setActiveTab = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const updateTabContent = (tabId: string, content: string) => {
    setOpenTabs(openTabs.map(tab =>
      tab.id === tabId ? { ...tab, content, isDirty: true } : tab
    ));
  };

  const markTabClean = (tabId: string) => {
    setOpenTabs(openTabs.map(tab =>
      tab.id === tabId ? { ...tab, isDirty: false } : tab
    ));
  };

  return (
    <EditorContext.Provider
      value={{
        fileTree,
        openTabs,
        activeTabId,
        terminalOpen,
        terminalHeight,
        sidebarWidth,
        setFileTree,
        openFile,
        closeTab,
        setActiveTab,
        updateTabContent,
        markTabClean,
        setTerminalOpen,
        setTerminalHeight,
        setSidebarWidth,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
}
