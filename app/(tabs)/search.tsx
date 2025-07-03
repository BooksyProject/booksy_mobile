import SearchBookCard from "@/components/card/book/SearchBookCard";
import HistorySearchCard from "@/components/card/other/HistorySearchCard";
import SearchBar from "@/components/ui/search-bar";
import { useTheme } from "@/contexts/ThemeContext";
import { BookResponseDTO } from "@/dtos/BookDTO";
import { getAllBooks } from "@/lib/service/book.service";
import { colors } from "@/styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";

const STORAGE_KEY = "searchHistory";

const Search = () => {
  const { colorScheme } = useTheme();
  const textColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [booksData, setBooksData] = useState<BookResponseDTO[]>([]);
  const [searchResults, setSearchResults] = useState<BookResponseDTO[]>([]);
  const [searching, setSearching] = useState(false);

  const loadHistory = async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) setSearchHistory(JSON.parse(raw));
  };

  const handleSearch = async (term: string) => {
    const updated = [term, ...searchHistory.filter((t) => t !== term)].slice(
      0,
      10
    );
    setSearchHistory(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const lower = term.toLowerCase();
    const filtered = booksData.filter(
      (book) =>
        book.title.toLowerCase().includes(lower) ||
        book.author.toLowerCase().includes(lower)
    );
    setSearchResults(filtered);
    setSearching(true);
  };

  const handleSearchFocus = () => {
    setSearching(false);
  };

  const clearHistory = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setSearchHistory([]);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadInitialBooks = async () => {
      try {
        const data = await getAllBooks();
        if (isMounted) {
          setBooksData(data.books);
        }
      } catch (e) {
        console.error("Failed to load books", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadInitialBooks();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScrollView
      className="flex-1 px-5 pt-16 bg-[#f6f2e9]"
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[200] : colors.light[200],
        gap: 5,
      }}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <SearchBar onSearch={handleSearch} onFocus={handleSearchFocus} />

      {!searching && (
        <>
          <View className="flex-row justify-between items-center mt-4">
            <Text
              className="text-lg font-msemibold"
              style={{ color: textColor }}
            >
              Recent
            </Text>
            <Pressable onPress={clearHistory}>
              <Text className="text-primary-100 font-mmedium text-[14px]">
                Clear
              </Text>
            </Pressable>
          </View>

          <View className="flex-row flex-wrap gap-2 mt-3">
            {searchHistory.map((term) => (
              <HistorySearchCard
                key={term}
                title={term}
                onPress={() => handleSearch(term)}
                style={{ marginBottom: 10 }}
              />
            ))}
          </View>

          <View className="flex-row justify-between mt-6 items-center">
            <Text
              className="text-lg font-msemibold"
              style={{ color: textColor }}
            >
              Recommended
            </Text>
            <Text className="text-primary-100 font-mmedium text-[14px]">
              See all
            </Text>
          </View>

          <View className="mt-4 space-y-4" style={{ gap: 10 }}>
            {booksData.map((item) => (
              <SearchBookCard key={item._id || item.title} book={item} />
            ))}
          </View>
        </>
      )}

      {searching && (
        <>
          <Text
            className="text-lg font-msemibold mt-4"
            style={{ color: textColor }}
          >
            Search Results
          </Text>
          <View className="mt-4 space-y-4">
            {searchResults.map((item) => (
              <SearchBookCard key={item._id || item.title} book={item} />
            ))}
            {searchResults.length === 0 && (
              <Text className="text-sm mt-4 text-gray-500">
                No results found.
              </Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default Search;
