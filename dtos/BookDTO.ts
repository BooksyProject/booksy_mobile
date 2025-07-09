import { CategoryResponseDTO } from "./CategoryDTO";

export interface BookDTO {
  _id: string;
  title: string;
  author: string;
  categories: CategoryResponseDTO[];
  description: string;
  coverImage: string;
  fileURL: string;
  fileType: "EPUB" | "PDF";
  views: number;
  likes: number;
  uploadedAt: Date;
  chapters: number;
}

export interface CreateBookDTO {
  title: string;
  author: string;
  categories: string[];
  description: string;
  coverImage: string;
  fileURL: string;
  fileType: "EPUB" | "PDF";
  createdBy: string;
}

export interface BookResponseDTO {
  _id: string;
  title: string;
  author: string;
  categories: string[];
  description: string;
  coverImage: string;
  fileURL: string;
  fileType: "EPUB" | "PDF";
  views: number;
  likes: number;
  uploadedAt: Date;
  createdBy: string;
}

export interface OfflineBook {
  _id: string;
  title: string;
  coverImage: string;
  author: string;
  likes: number;
  chapters: number;
  views: number;
  categories: string[];
  fileUrl: string;
  description: string;
  filePath: string;
  downloadedAt: number;
  content?: string; // Nội dung đã parse từ file
}

export interface OfflineChapter {
  _id: string;
  chapterNumber: number;
  chapterTitle: string;
  content: string;
  bookId: string;
}
