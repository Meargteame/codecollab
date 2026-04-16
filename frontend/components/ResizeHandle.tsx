"use client";

import { useEffect, useRef } from "react";

interface ResizeHandleProps {
  direction: "horizontal" | "vertical";
  onResize: (delta: number) => void;
}

export default function ResizeHandle({ direction, onResize }: ResizeHandleProps) {
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    let startPos = 0;

    const handleMouseDown = (e: MouseEvent) => {
      startPos = direction === "horizontal" ? e.clientX : e.clientY;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = direction === "horizontal" ? "ew-resize" : "ns-resize";
      document.body.style.userSelect = "none";
    };

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = direction === "horizontal" ? e.clientX : e.clientY;
      const delta = currentPos - startPos;
      onResize(delta);
      startPos = currentPos;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    handle.addEventListener("mousedown", handleMouseDown);
    return () => handle.removeEventListener("mousedown", handleMouseDown);
  }, [direction, onResize]);

  return (
    <div
      ref={handleRef}
      className={`${
        direction === "horizontal"
          ? "w-1 cursor-ew-resize hover:bg-blue-500"
          : "h-1 cursor-ns-resize hover:bg-blue-500"
      } bg-white/10 transition-colors`}
    />
  );
}
