import React from "react";
import { View, ScrollView } from "react-native";
import { CategoryResponseDTO } from "@/dtos/CategoryDTO";
import CategoryTab from "./category-tab";

interface CategorySelectProps {
  categories: CategoryResponseDTO[];
  selectedIds: string[];
  onToggleCategory: (id: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  selectedIds,
  onToggleCategory,
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: "row", paddingVertical: 10 }}>
        {categories.map((category) => (
          <CategoryTab
            key={category._id}
            title={category.name}
            isActive={selectedIds.includes(category._id)}
            onPress={() => onToggleCategory(category._id)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default CategorySelect;
