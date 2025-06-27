import { View, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { SearchIcon } from "../icon/Icons";
import { colors } from "@/styles/colors";
import { useTheme } from "@/contexts/ThemeContext";

export default function SearchBar({
  onSearch,
  onFocus,
}: {
  onSearch: (q: string) => void;
  onFocus: () => void;
}) {
  const [query, setQuery] = useState("");
  const { colorScheme } = useTheme();
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];
  const handleSearch = () => {
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <View
      className="flex-row items-center border-b px-2"
      style={{ borderColor: iconColor }}
    >
      <TextInput
        onFocus={onFocus}
        placeholder="Search"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        className="flex-1 py-2 text-base font-mmedium"
        style={{ color: iconColor }}
      />
      <Pressable onPress={handleSearch}>
        <SearchIcon size={20} color={iconColor} />
      </Pressable>
    </View>
  );
}
