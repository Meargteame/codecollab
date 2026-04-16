"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CollaboratorPresence {
  id: string;
  name: string;
  avatar: string;
  color: string;
  status: "active" | "idle" | "offline";
  currentFile: string | null;
  lastSeen: Date;
  cursorPosition?: { line: number; column: number };
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: "message" | "system";
}

interface CollaborationContextType {
  collaborators: CollaboratorPresence[];
  messages: ChatMessage[];
  isConnected: boolean;
  sendMessage: (content: string) => void;
  updateCursorPosition: (position: { line: number; column: number }) => void;
  updateCurrentFile: (fileId: string) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

// Simulated collaborators
const mockCollaborators: CollaboratorPresence[] = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar: "A",
    color: "#3b82f6",
    status: "active",
    currentFile: "/src/App.tsx",
    lastSeen: new Date(),
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar: "S",
    color: "#8b5cf6",
    status: "active",
    currentFile: "/src/components/Button.tsx",
    lastSeen: new Date(),
    cursorPosition: { line: 10, column: 5 },
  },
  {
    id: "3",
    name: "Mike Davis",
    avatar: "M",
    color: "#10b981",
    status: "idle",
    currentFile: null,
    lastSeen: new Date(Date.now() - 5 * 60 * 1000),
  },
];

export function CollaborationProvider({ children, projectId }: { children: ReactNode; projectId: string }) {
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>(mockCollaborators);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      userId: "system",
      userName: "System",
      content: "Welcome to the project! Start collaborating with your team.",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: "system",
    },
    {
      id: "2",
      userId: "2",
      userName: "Sarah Chen",
      content: "Hey team! I'm working on the Button component. Let me know if you have any feedback.",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: "message",
    },
  ]);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate WebSocket connection
  useEffect(() => {
    console.log("Connecting to collaboration server for project:", projectId);
    
    // Simulate connection delay
    const connectTimeout = setTimeout(() => {
      setIsConnected(true);
      
      // Add system message about connection
      const joinMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        userId: "system",
        userName: "System",
        content: "You joined the project",
        timestamp: new Date(),
        type: "system",
      };
      setMessages(prev => [...prev, joinMessage]);
    }, 1000);

    // Simulate periodic status updates
    const statusInterval = setInterval(() => {
      setCollaborators(prev => prev.map(collab => {
        const timeSinceLastSeen = Date.now() - collab.lastSeen.getTime();
        if (timeSinceLastSeen > 5 * 60 * 1000) {
          return { ...collab, status: "idle" };
        }
        return collab;
      }));
    }, 30000);

    return () => {
      clearTimeout(connectTimeout);
      clearInterval(statusInterval);
      setIsConnected(false);
    };
  }, [projectId]);

  const sendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId: "1",
      userName: "Alex Johnson",
      content,
      timestamp: new Date(),
      type: "message",
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate response from another user
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const responseMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          userId: "2",
          userName: "Sarah Chen",
          content: "Got it! 👍",
          timestamp: new Date(),
          type: "message",
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 2000);
    }
  };

  const updateCursorPosition = (position: { line: number; column: number }) => {
    // In a real implementation, this would broadcast via WebSocket
    console.log("Cursor position updated:", position);
  };

  const updateCurrentFile = (fileId: string) => {
    // In a real implementation, this would broadcast via WebSocket
    console.log("Current file updated:", fileId);
  };

  return (
    <CollaborationContext.Provider
      value={{
        collaborators,
        messages,
        isConnected,
        sendMessage,
        updateCursorPosition,
        updateCurrentFile,
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
}

export function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error("useCollaboration must be used within a CollaborationProvider");
  }
  return context;
}
