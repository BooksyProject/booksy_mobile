// src/reducers/offlineReadingReducer.ts
import {
  PREPARE_OFFLINE_READING_REQUEST,
  PREPARE_OFFLINE_READING_SUCCESS,
  PREPARE_OFFLINE_READING_FAILURE,
  DOWNLOAD_BOOK_PROGRESS,
  DOWNLOAD_BOOK_COMPLETE,
  DOWNLOAD_BOOK_FAILURE,
  FETCH_DOWNLOADED_BOOKS_REQUEST,
  FETCH_DOWNLOADED_BOOKS_SUCCESS,
  FETCH_DOWNLOADED_BOOKS_FAILURE,
} from "../../lib/service/book.service";

interface DownloadState {
  [bookId: string]: {
    progress: number;
    status: "IDLE" | "PREPARING" | "DOWNLOADING" | "COMPLETED" | "FAILED";
    downloadId?: string;
    filePath?: string;
    error?: string;
  };
}

interface DownloadedBooksState {
  loading: boolean;
  books: any[];
  error?: string;
}

interface OfflineReadingState {
  downloads: DownloadState;
  downloadedBooks: DownloadedBooksState;
}

const initialState: OfflineReadingState = {
  downloads: {},
  downloadedBooks: {
    loading: false,
    books: [],
  },
};

export const offlineReadingReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case PREPARE_OFFLINE_READING_REQUEST:
      return {
        ...state,
        downloads: {
          ...state.downloads,
          [action.payload.bookId]: {
            status: "PREPARING",
            progress: 0,
          },
        },
      };

    case PREPARE_OFFLINE_READING_SUCCESS:
      return {
        ...state,
        downloads: {
          ...state.downloads,
          [action.payload.bookId]: {
            ...state.downloads[action.payload.bookId],
            status:
              action.payload.status === "ALREADY_DOWNLOADED"
                ? "COMPLETED"
                : "DOWNLOADING",
            downloadId: action.payload.downloadRecord?._id,
          },
        },
      };

    case PREPARE_OFFLINE_READING_FAILURE:
      return {
        ...state,
        downloads: {
          ...state.downloads,
          [action.payload.bookId]: {
            status: "FAILED",
            progress: 0,
            error: action.payload.error,
          },
        },
      };

    case DOWNLOAD_BOOK_PROGRESS:
      return {
        ...state,
        downloads: {
          ...state.downloads,
          [action.payload.bookId]: {
            ...state.downloads[action.payload.bookId],
            status: "DOWNLOADING",
            progress: action.payload.progress,
          },
        },
      };

    case DOWNLOAD_BOOK_COMPLETE:
      return {
        ...state,
        downloads: {
          ...state.downloads,
          [action.payload.bookId]: {
            ...state.downloads[action.payload.bookId],
            status: "COMPLETED",
            progress: 100,
            filePath: action.payload.filePath,
          },
        },
      };

    case DOWNLOAD_BOOK_FAILURE:
      return {
        ...state,
        downloads: {
          ...state.downloads,
          [action.payload.bookId]: {
            ...state.downloads[action.payload.bookId],
            status: "FAILED",
            error: action.payload.error,
          },
        },
      };

    case FETCH_DOWNLOADED_BOOKS_REQUEST:
      return {
        ...state,
        downloadedBooks: {
          ...state.downloadedBooks,
          loading: true,
          error: undefined,
        },
      };

    case FETCH_DOWNLOADED_BOOKS_SUCCESS:
      return {
        ...state,
        downloadedBooks: {
          loading: false,
          books: action.payload,
          error: undefined,
        },
      };

    case FETCH_DOWNLOADED_BOOKS_FAILURE:
      return {
        ...state,
        downloadedBooks: {
          ...state.downloadedBooks,
          loading: false,
          error: action.payload,
        },
      };

    default:
      return state;
  }
};
