import { Category } from "./CategoryDTO";

export interface BookDTO {
  _id: string;
  title: string;
  author: string;
  categories: Category[];
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
}
