import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";

interface RadioGroupProps<T> {
  value: T;
  options: { label: string; value: T }[];
  onChange: (val: T) => void;
}

const RadioGroup = <T extends string | number>({
  value,
  options,
  onChange,
}: RadioGroupProps<T>) => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const textColor = isDark ? colors.dark[100] : colors.light[100];

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value.toString()}
          style={styles.option}
          onPress={() => onChange(option.value)}
        >
          <View style={styles.radio}>
            {value === option.value && <View style={styles.radioInner} />}
          </View>
          <Text
            style={[styles.label, { color: textColor }]}
            className="font-mmedium"
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CCC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#B04336",
  },
  label: {
    fontSize: 16,
  },
});

export default RadioGroup;
