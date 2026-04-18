"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="h-screen w-screen flex flex-col bg-black text-white overflow-hidden fixed inset-0">
        {children}
      </div>
    </ThemeProvider>
  );
}
