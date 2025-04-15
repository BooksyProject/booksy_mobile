import React from "react";
import { View, Text } from "react-native";
import { Tabs } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
// import { SvgProps } from "react-native-svg";
// import { useTheme } from "../../context/ThemeContext";
interface TabIconProps {
  SvgIcon: any;
  color: string;
  name: string;
  focused: boolean;
}
const TabIcon: React.FC<TabIconProps> = ({ SvgIcon, color, name, focused }) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 80,
      }}
    >
      <SvgIcon color={color} focused={focused} />
      <Text
        style={{
          fontWeight: focused ? "600" : "400",
          fontSize: 12, // Đảm bảo kích thước chữ phù hợp
          marginTop: 2, // Khoảng cách giữa icon và text
          color: color,
        }}
      >
        {name}
      </Text>
    </View>
  );
};

const HomeIcon = ({ color = "currentColor", width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 512 512" fill="none">
    <Path
      d="M80 212v236a16 16 0 0 0 16 16h96V328a24 24 0 0 1 24-24h80a24 24 0 0 1 24 24v136h96a16 16 0 0 0 16-16V212"
      stroke={color}
      strokeWidth={32}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M480 256L266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256m368-77V64h-48v69"
      stroke={color}
      strokeWidth={32}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const BellIcon = ({ color = "currentColor", width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
    <Path
      fill={color}
      d="M8 17a.5.5 0 0 1 1 0a1 1 0 1 0 2 0a.5.5 0 0 1 1 0a2 2 0 1 1-4 0"
    />
    <Path
      fill={color}
      fillRule="evenodd"
      d="M17.5 14.5a2.96 2.96 0 0 0-1.5-2.575V9a5.5 5.5 0 0 0-5.5-5.5h-1A5.5 5.5 0 0 0 4 9v2.925A2.96 2.96 0 0 0 2.5 14.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2M15 12.558l.295.133l.055.024A1.96 1.96 0 0 1 16.5 14.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1c0-.769.45-1.467 1.15-1.784l.055-.025l.295-.133V9a4.5 4.5 0 0 1 4.5-4.5h1A4.5 4.5 0 0 1 15 9z"
      clipRule="evenodd"
    />
    <Path fill={color} d="M9.5 1.5a.5.5 0 0 1 1 0V4a.5.5 0 0 1-1 0z" />
  </Svg>
);

const PersonIcon = ({ color = "currentColor", width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 15 15" fill="none">
    <Path
      fill={color}
      d="M4 5.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0M5.5 3a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5m5 3a1 1 0 1 1 2 0a1 1 0 0 1-2 0m1-2a2 2 0 1 0 0 4a2 2 0 0 0 0-4m-10 6.5A1.5 1.5 0 0 1 3 9h5a1.5 1.5 0 0 1 1.5 1.5v.112a1 1 0 0 1-.01.137a2.85 2.85 0 0 1-.524 1.342C8.419 12.846 7.379 13.5 5.5 13.5s-2.918-.654-3.467-1.409a2.85 2.85 0 0 1-.523-1.342a2 2 0 0 1-.01-.137zm1 .09v.007l.004.049a1.85 1.85 0 0 0 .338.857c.326.448 1.036.997 2.658.997s2.332-.549 2.658-.997a1.85 1.85 0 0 0 .338-.857l.004-.05V10.5A.5.5 0 0 0 8 10H3a.5.5 0 0 0-.5.5zm9 1.91c-.588 0-1.07-.09-1.46-.238a4 4 0 0 0 .361-.932c.268.101.624.17 1.099.17c1.119 0 1.578-.382 1.78-.666a1.2 1.2 0 0 0 .218-.56l.002-.028a.25.25 0 0 0-.25-.246h-2.8A2.5 2.5 0 0 0 10 9h3.25c.69 0 1.25.56 1.25 1.25v.017a1 1 0 0 1-.008.109a2.2 2.2 0 0 1-.398 1.04c-.422.591-1.213 1.084-2.594 1.084"
    />
  </Svg>
);

const ProfileIcon = ({ color = "currentColor", width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

const TabsLayout = () => {
  const { colorScheme } = useTheme();
  return (
    <Tabs
      // options={{ headerShown: false }}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FFAABB",
        tabBarInactiveTintColor: "#92898A",
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#252525" : "#FFFFFF", // Chỉnh màu nền ở đây
          borderTopWidth: 5,
          borderTopColor: "transparent",
        },
        tabBarItemStyle: {
          flex: 1,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              SvgIcon={HomeIcon}
              color={color}
              focused={focused}
              name="Home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="friend"
        options={{
          title: "Friend",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              SvgIcon={PersonIcon}
              color={color}
              focused={focused}
              name="Friends"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notifications",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              SvgIcon={BellIcon}
              color={color}
              focused={focused}
              name="Notifications"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              SvgIcon={ProfileIcon}
              color={color}
              focused={focused}
              name="Profile"
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
