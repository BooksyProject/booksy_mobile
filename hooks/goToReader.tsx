import { useRouter } from "expo-router";

export default function useGoToReader() {
  const router = useRouter();

  return (bookId: string, chapterNumber: number = 1) => {
    router.push({
      pathname: "/reader/[bookId]" as any,
      params: {
        bookId,
        chapter: String(chapterNumber),
      },
    });
  };
}
