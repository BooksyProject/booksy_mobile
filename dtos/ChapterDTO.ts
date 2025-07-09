export interface ChapterInf {
  _id: string;
  chapterNumber: number;
  chapterTitle: string;
  content?: string;
}

export interface CreateChapterDTO {
  bookId: string;
  chapterTitle: string;
  content: string;
  chapterNumber?: number;
}
