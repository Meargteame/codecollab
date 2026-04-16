"use client";

import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: "message" | "system";
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
}

export default function ChatPanel({ messages, onSendMessage }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
      inputRef.current?.focus();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getUserColor = (userId: string) => {
    const colors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];
    const index = parseInt(userId, 10) % colors.length;
    return colors[index];
  };

  if (!isExpanded) {
    return (
      <div className="h-10 border-t border-white/10 flex items-center justify-between px-4 bg-white/[0.02]">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider">Chat</span>
          {messages.length > 0 && (
            <span className="px-1.5 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
              {messages.length}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="h-80 border-t border-white/10 flex flex-col bg-white/[0.02]">
      {/* Header */}
      <div className="h-10 border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-xs font-bold text-white uppercase tracking-wider">Team Chat</span>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Minimize"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id}>
            {message.type === "system" ? (
              <div className="flex items-center justify-center">
                <div className="px-3 py-1 bg-white/5 text-gray-500 text-xs">
                  {message.content}
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: getUserColor(message.userId) }}
                >
                  {message.userName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{message.userName}</span>
                    <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                  </div>
                  <div className="text-sm text-gray-300 break-words">{message.content}</div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-wider transition-colors"
          >
            Send
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Tip: Use @username to mention someone
        </div>
      </form>
    </div>
  );
}
