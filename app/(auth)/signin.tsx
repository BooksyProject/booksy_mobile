import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
// import MyInput from "../../components/shared/ui/MyInput";
// import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import { useRouter } from "expo-router";
import { login, getMyProfile } from "@/lib/service/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/contexts/ThemeContext";

const SignIn = () => {
  // const { setProfile } = useAuth();
  const { colorScheme } = useTheme();
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  // const handleSubmit = async () => {
  //   const userData = { phoneNumber, password };

  //   try {
  //     const user = await login(userData);

  //     if (user) {
  //       await AsyncStorage.setItem("token", user.token);
  //       console.log(user.token);
  //       const decodedToken = JSON.parse(atob(user.token.split(".")[1]));
  //       const userId = decodedToken?.id;
  //       console.log(userId);
  //       await AsyncStorage.setItem("userId", userId);
  //       const profileData = await getMyProfile(userId);
  //       setProfile(profileData.userProfile);
  //       router.push("home" as any);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className="w-full h-full px-7"
        style={{
          backgroundColor:
            colorScheme === "dark" ? colors.dark[100] : colors.light[100],
          flex: 1,
        }}
      >
        {/* Phần giữa màn hình */}
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View className="w-full space-y-8 flex flex-col justify-center items-center">
            <View className="items-center">
              <Text
                className="font-msemibold text-[36px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                Login
              </Text>
            </View>

            <View className="w-full space-y-8">
              <View className="relative">
                <View
                  className="absolute left-3 -top-2 flex flex-row items-center px-1 z-10"
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? colors.dark[200]
                        : colors.light[200],
                  }}
                >
                  <Text
                    className="font-mregular text-[12px]"
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[200]
                          : colors.light[200],
                    }}
                  >
                    Phone Number <Text style={{ color: "red" }}>*</Text>
                  </Text>
                </View>
                {/* <MyInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Phone number"
                  height={56}
                  fontSize={14}
                  fontFamily="Montserrat-Regular"
                /> */}
              </View>

              {/* Password Input */}
              <View className="relative">
                <View
                  className="absolute left-3 -top-2 flex flex-row items-center px-1 z-10"
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? colors.dark[200]
                        : colors.light[200],
                  }}
                >
                  <Text
                    className="font-mregular text-[12px]"
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[200]
                          : colors.light[200],
                    }}
                  >
                    Password <Text style={{ color: "red" }}>*</Text>
                  </Text>
                </View>
                {/* <MyInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  secureTextEntry
                  height={56}
                  fontSize={14}
                  fontFamily="Montserrat-Regular"
                /> */}
              </View>
            </View>
            <View className="w-full space-y-5">
              <View className="">
                {/* <Button
                  title="Sign In"
                  onPress={handleSubmit}
                  fontColor={
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[200]
                  }
                /> */}
              </View>
              <View className="items-end">
                <TouchableOpacity
                  onPress={() => {
                    setIsPressed(true);
                    router.push("forgot-password" as any);
                  }}
                >
                  <Text
                    className="font-mregular text-[14px]"
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[100]
                          : colors.light[100],
                      fontFamily: "Montserrat-Regular",
                    }}
                  >
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text
              className="font-mbold text-[16px]"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
            >
              Or
            </Text>
            <Text
              className="font-mregular text-[16px] mt-4"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
            >
              You don't have an account yet?{" "}
              <Text
                onPress={() => router.push("signup" as any)}
                className="font-mbold text-[16px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                Sign up
              </Text>
            </Text>
          </View>
        </View>

        {/* Footer đăng ký */}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignIn;
