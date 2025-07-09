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
