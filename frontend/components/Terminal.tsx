"use client";

import { useState, useRef, useEffect } from "react";

interface TerminalProps {
  height: number;
  onResize: (height: number) => void;
  onClose: () => void;
}

export default function Terminal({ height, onResize, onClose }: TerminalProps) {
  const [output, setOutput] = useState<string[]>([
    "CodeCollab Terminal v1.0.0",
    "Type 'help' for available commands",
    "",
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setHistory([...history, trimmedCmd]);
    setHistoryIndex(-1);

    const newOutput = [...output, `$ ${trimmedCmd}`];

    // Simple command simulation
    switch (trimmedCmd.toLowerCase()) {
      case "help":
        newOutput.push("Available commands:");
        newOutput.push("  help    - Show this help message");
        newOutput.push("  clear   - Clear terminal");
        newOutput.push("  ls      - List files");
        newOutput.push("  pwd     - Print working directory");
        newOutput.push("  echo    - Echo text");
        break;
      case "clear":
        setOutput([]);
        setInput("");
        return;
      case "ls":
        newOutput.push("src/");
        newOutput.push("public/");
        newOutput.push("package.json");
        newOutput.push("README.md");
        break;
      case "pwd":
        newOutput.push("/workspace/project");
        break;
      default:
        if (trimmedCmd.startsWith("echo ")) {
          newOutput.push(trimmedCmd.substring(5));
        } else {
          newOutput.push(`Command not found: ${trimmedCmd}`);
        }
    }

    newOutput.push("");
    setOutput(newOutput);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  // Resize functionality
  useEffect(() => {
    const resizeHandle = resizeRef.current;
    if (!resizeHandle) return;

    let startY = 0;
    let startHeight = 0;

    const handleMouseDown = (e: MouseEvent) => {
      startY = e.clientY;
      startHeight = height;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const delta = startY - e.clientY;
      const newHeight = Math.max(100, Math.min(600, startHeight + delta));
      onResize(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    resizeHandle.addEventListener("mousedown", handleMouseDown);
    return () => resizeHandle.removeEventListener("mousedown", handleMouseDown);
  }, [height, onResize]);

  return (
    <div className="flex flex-col bg-black border-t border-white/10" style={{ height }}>
      {/* Resize Handle */}
      <div
        ref={resizeRef}
        className="h-1 bg-white/10 hover:bg-blue-500 cursor-ns-resize transition-colors"
      />

      {/* Terminal Header */}
      <div className="h-8 border-b border-white/10 flex items-center justify-between px-4 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-bold text-white uppercase tracking-wider">Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOutput([])}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Clear"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm text-gray-300"
        style={{ fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace' }}
      >
        {output.map((line, index) => (
          <div key={index} className="leading-relaxed">
            {line}
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-blue-500">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white focus:outline-none"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
