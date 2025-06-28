import { View, Text, ScrollView, Image, Platform } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import CircleIconButton from "@/components/ui/circle-icon-button";
import {
  BellIcon,
  FontIcon,
  FontLineIcon,
  LineSpacingIcon,
  ThemeIcon,
} from "@/components/icon/Icons";
import Button from "@/components/ui/button";
import RadioGroup from "@/components/ui/radio-group";
import SelectBox from "@/components/ui/select-box";
import { updateSetting } from "@/lib/service/setting.service";
import { useRouter } from "expo-router";

// TODO: Replace this with dynamic userId from context/auth
const userId = "your-user-id";

const Profile = () => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [mode, setMode] = useState("light");
  const [font, setFont] = useState("Montserrat");
  const [fontSize, setFontSize] = useState("Large");
  const [lineHeight, setLineHeight] = useState("1.5");

  const backgroundColor = isDark ? colors.dark[200] : colors.light[200];
  const textColor = isDark ? colors.dark[100] : colors.light[100];

  const handleSettingChange = async (field: string, value: string) => {
    try {
      await updateSetting(userId, { [field]: value });
      console.log(`✅ Updated ${field} to ${value}`);
    } catch (error: any) {
      console.error(`❌ Failed to update ${field}:`, error.message);
    }
  };

  const handleLogout = () => {
    try {
      // setSetting(false);
      router.push("/signin");
      // logout();
    } catch (error) {
      console.error("Error logout:", error);
    }
  };

  return (
    <ScrollView
      className="flex-1"
      style={{
        backgroundColor,
        paddingTop: Platform.OS === "android" ? 0 : 52,
      }}
    >
      <View className="bg-primary-100 p-5 rounded-b-[20px] h-[310px] items-center">
        <View className="flex flex-row justify-between items-center mb-4 w-full">
          <Text
            className="text-[20px] font-msemibold"
            style={{ color: isDark ? colors.dark[200] : colors.light[200] }}
          >
            Park Dohyeon
          </Text>
          <CircleIconButton
            icon={BellIcon}
            onPress={() => console.log("Pressed")}
          />
        </View>

        <Image
          source={{ uri: "https://i.imgur.com/yr1E6Wz.png" }}
          className="w-[140px] h-[140px] rounded-full border-4 border-white"
        />
        <Text
          className="text-[16px] font-mmedium mt-2"
          style={{ color: isDark ? colors.dark[200] : colors.light[200] }}
        >
          @Viper03
        </Text>
      </View>

      <View className="px-5 py-6 space-y-6" style={{ gap: 20 }}>
        <Text
          className="text-[24px] font-msemibold"
          style={{ color: textColor }}
        >
          Custom
        </Text>

        {/* Theme */}
        <View
          className="flex-row items-center justify-start"
          style={{ gap: 40 }}
        >
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
        <View
          className="flex-row items-center justify-start w-full"
          style={{ gap: 40 }}
        >
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
        </View>

        {/* Font Size */}
        <View
          className="flex-row items-center justify-start"
          style={{ gap: 40 }}
        >
          <FontLineIcon size={30} color={textColor} />
          <RadioGroup
            value={fontSize}
            onChange={(val) => {
              setFontSize(val);
              handleSettingChange("fontSize", val.toLowerCase());
            }}
            options={[
              { label: "Large", value: "Large" },
              { label: "Small", value: "Small" },
            ]}
          />
        </View>

        {/* Line Height */}
        <View
          className="flex-row items-center justify-start"
          style={{ gap: 40 }}
        >
          <LineSpacingIcon size={30} color={textColor} />
          <SelectBox
            value={lineHeight}
            onChange={(val) => {
              setLineHeight(val);
              handleSettingChange("lineSpacing", val);
            }}
            options={[
              { label: "1.5", value: "1.5" },
              { label: "2.0", value: "2.0" },
            ]}
          />
        </View>

        {/* Logout */}
        <View>
          <Button title="LOG OUT" outline={false} />
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
