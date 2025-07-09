import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { login, getMyProfile } from "@/lib/service/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/contexts/ThemeContext";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const SignIn = () => {
  const { setProfile } = useAuth();
  const { colorScheme } = useTheme();
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const user = await login({ phoneNumber, password });

      if (user) {
        await AsyncStorage.setItem("token", user.token);
        const decodedToken = JSON.parse(atob(user.token.split(".")[1]));
        const userId = decodedToken?.id;
        await AsyncStorage.setItem("userId", userId);
        const profileData = await getMyProfile(userId);
        console.log("profileeee", profileData.userProfile);
        await AsyncStorage.setItem(
          "profile",
          JSON.stringify(profileData.userProfile)
        );
        setProfile(profileData.userProfile);

        router.push("home" as any);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const bgColor = colorScheme === "dark" ? colors.dark[200] : colors.light[200];
  const textColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 px-7 py-8" style={{ backgroundColor: bgColor }}>
        <View className="flex-1 justify-center">
          {/* Title */}
          <Text
            className="text-[36px] mb-5 font-msemibold text-center"
            style={{ color: textColor }}
          >
            Login
          </Text>

          {/* Input fields */}
          <View className="space-y-6" style={{ gap: 20 }}>
            {/* Phone Number */}
            <View className="relative">
              <View
                className="absolute left-3 -top-2 px-1 z-10"
                style={{ backgroundColor: bgColor }}
              >
                <Text
                  className="text-xs font-mregular"
                  style={{ color: textColor }}
                >
                  Phone Number <Text className="text-red-500">*</Text>
                </Text>
              </View>
              <Input
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Phone number"
                height={56}
                fontSize={14}
                fontFamily="Montserrat-Regular"
              />
            </View>

            {/* Password */}
            <View className="relative">
              <View
                className="absolute left-3 -top-2 px-1 z-10"
                style={{ backgroundColor: bgColor }}
              >
                <Text
                  className="text-xs font-mregular"
                  style={{ color: textColor }}
                >
                  Password <Text className="text-red-500">*</Text>
                </Text>
              </View>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                height={56}
                fontSize={14}
                fontFamily="Montserrat-Regular"
              />
            </View>
          </View>

          {/* Button + Forgot */}
          <View className="space-y-4 mt-5">
            <Button
              title="Sign In"
              onPress={handleSubmit}
              fontColor={
                colorScheme === "dark" ? colors.dark[100] : colors.light[200]
              }
            />
            <TouchableOpacity
              onPress={() => router.push("forgot-password" as any)}
              className="items-end mt-3"
            >
              <Text
                className="text-sm font-mregular"
                style={{ color: textColor }}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Separator */}
          <Text
            className="text-center text-base mt-5 font-mbold"
            style={{ color: textColor }}
          >
            Or
          </Text>

          {/* Sign Up */}
          <Text
            className="text-center text-base font-mregular"
            style={{ color: textColor }}
          >
            You don't have an account yet?
            <Text
              onPress={() => router.push("signup" as any)}
              className="font-mbold"
              style={{ color: textColor }}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignIn;
