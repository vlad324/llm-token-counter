"use client";
import { useCallback, useEffect, useRef } from "react";

// Custom hook for auto-resize textarea
export const useAutoResize = (value: string) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get accurate scrollHeight
      textarea.style.height = 'auto';
      // Set height based on content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  // Resize when value changes (handles both updates and initial mount)
  useEffect(() => {
    resize();
  }, [value, resize]);

  return { textareaRef, resize };
};