import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Switch,
} from "react-native";
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

const Profile = () => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const [font, setFont] = useState("Montserrat");
  const [fontSize, setFontSize] = useState("Large");
  const [lineHeight, setLineHeight] = useState("1.5");

  const backgroundColor = isDark ? colors.dark[200] : colors.light[200];
  const textColor = isDark ? colors.dark[100] : colors.light[100];

  return (
    <ScrollView
      className="flex-1"
      style={{
        backgroundColor,
        paddingTop: Platform.OS === "android" ? 0 : 52,
      }}
    >
      {/* Profile Header */}

      <View className="bg-primary-100 p-5 rounded-b-[20px] h-[310px] items-center">
        <View className="flex flex-row justify-between items-center mb-4 w-full">
          <Text
            className=" text-[20px] font-msemibold"
            style={{
              color:
                colorScheme === "dark" ? colors.dark[200] : colors.light[200],
            }}
          >
            Park Dohyeon
          </Text>
          <CircleIconButton
            icon={BellIcon}
            onPress={() => console.log("Pressed")}
          />
        </View>

        <Image
          source={{
            uri: "https://i.imgur.com/yr1E6Wz.png", // ảnh của bạn
          }}
          className="w-[140px] h-[140px] rounded-full border-4 border-white"
        />
        <Text
          className=" text-[16px] font-mmedium mt-2"
          style={{
            color:
              colorScheme === "dark" ? colors.dark[200] : colors.light[200],
          }}
        >
          @Viper03
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

        {/* Light / Dark Mode */}
        <View className="flex-row items-center justify-between">
          <ThemeIcon size={30} color={textColor} />
          <Text style={{ color: textColor }}>Light</Text>
          {/* <Switch
            value={isDark}
            onValueChange={toggleTheme}
            thumbColor={isDark ? "#f4f3f4" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
          /> */}
          <Text style={{ color: textColor }}>Dark</Text>
        </View>

        {/* Font */}
        <View className="flex-row items-center justify-between">
          <FontIcon size={30} color={textColor} />
          <Picker
            selectedValue={font}
            // onValueChange={(itemValue) => setFont(itemValue)}
            style={{ color: textColor }}
          >
            <Picker.Item label="Montserrat" value="Montserrat" />
            <Picker.Item label="Roboto" value="Roboto" />
          </Picker>
        </View>

        {/* Font Size */}
        <View className="flex-row items-center justify-between">
          <FontLineIcon size={30} color={textColor} />
          <Picker
            selectedValue={fontSize}
            // onValueChange={(itemValue) => setFontSize(itemValue)}
            style={{ color: textColor }}
          >
            <Picker.Item label="Large" value="Large" />
            <Picker.Item label="Small" value="Small" />
          </Picker>
        </View>

        {/* Line Height */}
        <View className="flex-row items-center justify-between">
          <LineSpacingIcon size={30} color={textColor} />
          <Picker
            selectedValue={lineHeight}
            // onValueChange={(itemValue) => setLineHeight(itemValue)}
            style={{ color: textColor }}
          >
            <Picker.Item label="1.5" value="1.5" />
            <Picker.Item label="2.0" value="2.0" />
          </Picker>
        </View>

        {/* Logout */}
        <TouchableOpacity className="bg-dark-100 py-3 rounded-lg items-center">
          <Text className="text-white font-semibold">Log out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;
