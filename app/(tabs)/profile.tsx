import {
  View,
  Text,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { colors } from "@/styles/colors";
import { useAuth } from "@/contexts/AuthContext";

import CircleIconButton from "@/components/ui/circle-icon-button";
import Button from "@/components/ui/button";
import RadioGroup from "@/components/ui/radio-group";
import SelectBox from "@/components/ui/select-box";

import {
  ThemeIcon,
  FontIcon,
  FontLineIcon,
  LineSpacingIcon,
  LikeIcon,
} from "@/components/icon/Icons";

import {
  getSettingByUserId,
  updateSetting,
} from "@/lib/service/setting.service";
import { SettingResponseDTO } from "@/dtos/SettingDTO";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserResponseDTO } from "@/dtos/UserDTO";
import { getMyProfile } from "@/lib/service/user.service";

const Profile = () => {
  // const { profile } = useAuth();
  const [profile, setProfile] = useState<UserResponseDTO>();
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const bgColor = isDark ? colors.dark[200] : colors.light[200];
  const textColor = isDark ? colors.dark[100] : colors.light[100];

  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [font, setFont] = useState("Montserrat");
  const [fontSize, setFontSize] = useState<"Large" | "Small">("Large");
  const [lineHeight, setLineHeight] = useState<number>(1.5);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) return;

        const user = await getMyProfile(userId);
        setProfile(user.userProfile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!profile?._id || userId !== profile._id) return;

        const setting: SettingResponseDTO | null = await getSettingByUserId(
          profile._id
        );

        if (setting) {
          setMode(setting.Theme ? "dark" : "light");
          setFont(setting.fontFamily);
          setFontSize(setting.fontSize ? "Large" : "Small");
          setLineHeight(setting.lineSpacing);
        }
      } catch (error) {
        console.error("Error fetching setting:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
  }, [profile?._id]);

  const handleSettingChange = async (
    field: "Theme" | "fontFamily" | "fontSize" | "lineSpacing",
    value: string | number
  ) => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;

    const payload: Partial<{
      Theme: boolean;
      fontFamily: string;
      fontSize: boolean;
      lineSpacing: number;
    }> = {};

    try {
      switch (field) {
        case "Theme":
          const isDarkMode = value === "dark";
          if (
            (isDarkMode && mode !== "dark") ||
            (!isDarkMode && mode !== "light")
          ) {
            toggleColorScheme();
          }
          setMode(isDarkMode ? "dark" : "light");
          payload.Theme = isDarkMode;
          break;

        case "fontFamily":
          setFont(value as string);
          payload.fontFamily = value as string;
          break;

        case "fontSize":
          const isLarge = value === "Large";
          setFontSize(isLarge ? "Large" : "Small");
          payload.fontSize = isLarge;
          break;

        case "lineSpacing":
          const spacing = Number(value); // KHÔNG dùng toFixed nữa
          setLineHeight(spacing);
          payload.lineSpacing = spacing;
          break;
      }
      console.log("👉 Payload gửi lên:", {
        userId,
        ...payload,
      });

      await updateSetting(userId, payload);
      console.log(`✅ Updated ${field} to ${value}`);
    } catch (err: any) {
      console.error(`❌ Failed to update ${field}:`, err.message);
    }
  };

  const handleLogout = () => {
    router.push("/signin");
  };

  if (loading) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: bgColor }}
      >
        <ActivityIndicator size="large" color={textColor} />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      style={{
        backgroundColor: bgColor,
        paddingTop: Platform.OS === "android" ? 0 : 52,
      }}
    >
      {/* Header */}
      <View className="bg-primary-100 p-5 rounded-b-[20px] h-[310px] items-center">
        <View className="flex-row justify-between items-center w-full mb-4">
          <Text
            className="text-[20px] font-msemibold"
            style={{ color: textColor }}
          >
            {profile?.firstName} {profile?.lastName}
          </Text>
        </View>

        <Image
          source={{
            uri:
              profile?.avatar ||
              "https://i.pinimg.com/736x/06/5f/0d/065f0d6e7f2daf5e4d55538aef6928c2.jpg",
          }}
          className="w-[140px] h-[140px] rounded-full border-4 border-white"
        />
        <Text
          className="text-[16px] font-mmedium mt-2"
          style={{ color: textColor }}
        >
          @{profile?.username}
        </Text>
      </View>

      {/* Settings */}
      <View className="px-5 py-6 space-y-6" style={{ gap: 20 }}>
        <Text
          className="text-[24px] font-msemibold"
          style={{ color: textColor }}
        >
          Custom
        </Text>

        {/* Theme */}
        <View className="flex-row items-center space-x-10" style={{ gap: 20 }}>
          <ThemeIcon size={30} color={textColor} />
          <RadioGroup
            value={mode}
            onChange={(val) => {
              setMode(val);
              handleSettingChange("Theme", val);
            }}
            options={[
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
            ]}
          />
        </View>

        {/* Font */}
        {/* <View className="flex-row items-center space-x-10" style={{ gap: 20 }}>
          <FontIcon size={30} color={textColor} />
          <SelectBox
            value={font}
            onChange={(val) => {
              setFont(val);
              handleSettingChange("fontFamily", val);
            }}
            options={[
              { label: "Montserrat", value: "Montserrat" },
              { label: "Roboto", value: "Roboto" },
              { label: "Open Sans", value: "OpenSans" },
            ]}
          />
        </View> */}

        {/* Font Size */}
        {/* <View className="flex-row items-center space-x-10" style={{ gap: 20 }}>
          <FontLineIcon size={30} color={textColor} />
          <RadioGroup
            value={fontSize}
            onChange={(val) => {
              setFontSize(val);
              handleSettingChange("fontSize", val);
            }}
            options={[
              { label: "Large", value: "Large" },
              { label: "Small", value: "Small" },
            ]}
          />
        </View> */}

        {/* Line Spacing */}
        {/* <View className="flex-row items-center space-x-10" style={{ gap: 20 }}>
          <LineSpacingIcon size={30} color={textColor} />
          <SelectBox
            value={lineHeight}
            onChange={(val) => {
              const parsed = Number(val);
              setLineHeight(parsed);
              handleSettingChange("lineSpacing", parsed);
            }}
            options={[
              { label: "1.5", value: 1.5 },
              { label: "2.0", value: 2.0 },
            ]}
          />
        </View> */}

        {/* Logout */}
        <View className="mt-6">
          <Button title="Log out" onPress={handleLogout} outline={false} />
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
