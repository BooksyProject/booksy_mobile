import React from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { colors } from "@/styles/colors";
import { useTheme } from "@/contexts/ThemeContext";

interface OTPModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  otp: string;
  setOtp: (value: string) => void;
}

const OTPModal: React.FC<OTPModalProps> = ({
  visible,
  onClose,
  onSubmit,
  otp,
  setOtp,
}) => {
  const { colorScheme } = useTheme();

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <View
        className="flex-1 mt-16"
        style={{
          backgroundColor:
            colorScheme === "dark" ? colors.dark[200] : colors.light[200],
        }}
      >
        <View className="flex-row">
          <Text
            className="font-msemibold text-lg ml-3"
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[100],
            }}
          >
            Verify OTP
          </Text>
          <TouchableOpacity onPress={onClose} className="ml-auto pr-5">
            <Text
              className="font-msemibold mt-2"
              style={{
                color: colorScheme === "dark" ? colors.dark[100] : "#D9D9D9",
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 px-5">
          <Text
            className="font-mmedium mb-2"
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[100],
            }}
          >
            OTP
          </Text>
          <TextInput
            value={otp}
            onChangeText={setOtp}
            secureTextEntry
            className="border-gray-200 border rounded p-3"
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[100],
            }}
          />
        </View>

        <TouchableOpacity
          onPress={onSubmit}
          className="bg-primary-100 rounded p-3 mt-6 mx-6"
        >
          <Text className="text-white text-center font-mmedium">Submit</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default OTPModal;
