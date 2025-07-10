import React, { createContext, useContext, useState, useCallback } from "react";

interface ReadingProgress {
  bookId: string;
  chapterId: string;
  chapterNumber: number;
  percentage: number;
  lastReadAt?: Date;
}

interface ReadingProgressContextType {
  readingProgress: ReadingProgress | null;
  updateReadingProgress: (progress: ReadingProgress) => void;
}

const ReadingProgressContext = createContext<
  ReadingProgressContextType | undefined
>(undefined);

export const ReadingProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [readingProgress, setReadingProgress] =
    useState<ReadingProgress | null>(null);

  const updateReadingProgress = useCallback((progress: ReadingProgress) => {
    setReadingProgress(progress);
  }, []);

  return (
    <ReadingProgressContext.Provider
      value={{ readingProgress, updateReadingProgress }}
    >
      {children}
    </ReadingProgressContext.Provider>
  );
};

export const useReadingProgress = () => {
  const context = useContext(ReadingProgressContext);
  if (!context) {
    throw new Error(
      "useReadingProgress must be used within ReadingProgressProvider"
    );
  }
  return context;
};
