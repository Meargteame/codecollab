"use client";

interface EditorTab {
  id: string;
  fileId: string;
  fileName: string;
  filePath: string;
  isDirty: boolean;
  content: string;
}

interface EditorTabsProps {
  tabs: EditorTab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

export default function EditorTabs({ tabs, activeTabId, onTabSelect, onTabClose }: EditorTabsProps) {
  const handleClose = (e: React.MouseEvent, tabId: string, isDirty: boolean) => {
    e.stopPropagation();
    
    if (isDirty) {
      const confirmed = window.confirm("You have unsaved changes. Are you sure you want to close this file?");
      if (!confirmed) return;
    }
    
    onTabClose(tabId);
  };

  if (tabs.length === 0) {
    return (
      <div className="h-10 border-b border-white/10 flex items-center px-4 bg-white/[0.02]">
        <span className="text-xs text-gray-500">No files open</span>
      </div>
    );
  }

  return (
    <div className="h-10 border-b border-white/10 flex items-center bg-white/[0.02] overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabSelect(tab.id)}
          className={`flex items-center gap-2 px-4 h-full border-r border-white/10 hover:bg-white/5 transition-colors group ${
            activeTabId === tab.id
              ? 'bg-black text-white border-t-2 border-t-blue-500'
              : 'text-gray-400'
          }`}
        >
          <span className="text-xs">{tab.fileName}</span>
          {tab.isDirty && (
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          )}
          <button
            onClick={(e) => handleClose(e, tab.id, tab.isDirty)}
            className="w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-opacity"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </button>
      ))}
    </div>
  );
}
