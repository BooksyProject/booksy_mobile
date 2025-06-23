import React from "react";
import { View, StyleSheet, Platform, Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";

interface SelectBoxProps<T> {
  value: T;
  options: { label: string; value: T }[];
  onChange: (val: T) => void;
}

const SelectBox = <T extends string | number>({
  value,
  options,
  onChange,
}: SelectBoxProps<T>) => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const textColor = isDark ? colors.dark[100] : colors.light[100];

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: isDark ? colors.dark[200] : colors.light[200] },
      ]}
    >
      <RNPickerSelect
        value={value}
        onValueChange={onChange}
        items={options}
        style={{
          inputIOS: { ...styles.input, color: textColor },
          inputAndroid: { ...styles.input, color: textColor },
          iconContainer: styles.icon,
        }}
        useNativeAndroidPickerStyle={false}
        Icon={() => (
          <Text
            style={[styles.iconArrow, { color: textColor }]}
            className="font-mmedium"
          >
            ▾
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 0,
    width: 180,
  },
  input: {
    fontSize: 16,
    paddingVertical: 10,
  },
  icon: {
    top: Platform.OS === "ios" ? 14 : 12,
    right: 10,
  },
  iconArrow: {
    fontSize: 16,
  },
});

export default SelectBox;
