import React from "react";
import { View, Text } from "react-native";
import { Tabs } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/styles/colors";

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
      }}
    >
      <SvgIcon color={color} focused={focused} />
    </View>
  );
};

const HomeIcon = ({ color = "currentColor", width = 30, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      d="M13.45 2.533a2.25 2.25 0 0 0-2.9 0L3.8 8.228a2.25 2.25 0 0 0-.8 1.72v9.305c0 .966.784 1.75 1.75 1.75h3a1.75 1.75 0 0 0 1.75-1.75V15.25c0-.68.542-1.232 1.217-1.25h2.566a1.25 1.25 0 0 1 1.217 1.25v4.003c0 .966.784 1.75 1.75 1.75h3a1.75 1.75 0 0 0 1.75-1.75V9.947a2.25 2.25 0 0 0-.8-1.72z"
    />
  </Svg>
);

const SearchIcon = ({ color = "currentColor", width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      d="M11 2c4.968 0 9 4.032 9 9s-4.032 9-9 9s-9-4.032-9-9s4.032-9 9-9m0 16c3.867 0 7-3.133 7-7s-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7m8.485.071l2.829 2.828l-1.415 1.415l-2.828-2.829z"
    />
  </Svg>
);

const LibraryIcon = ({ color = "currentColor", width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path fill={color} d="M9 5.25a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5z" />
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.943 1.25c-2.073 0-3.706 0-4.982.173c-1.31.178-2.355.552-3.176 1.382c-.82.829-1.188 1.882-1.364 3.202c-.171 1.289-.171 2.938-.171 5.034v5.098c0 1.508 0 2.701.096 3.6c.095.888.298 1.689.88 2.225c.466.43 1.056.7 1.686.773c.787.09 1.522-.286 2.247-.8c.733-.518 1.622-1.305 2.744-2.297l.036-.032c.52-.46.872-.77 1.166-.986c.284-.207.457-.282.603-.312a1.5 1.5 0 0 1 .584 0c.146.03.32.105.603.312c.294.215.646.526 1.166.986l.037.032c1.121.992 2.01 1.779 2.743 2.298c.725.513 1.46.889 2.247.799a3 3 0 0 0 1.686-.773c.581-.536.785-1.337.88-2.225c.096-.899.096-2.092.096-3.6v-5.098c0-2.096 0-3.746-.171-5.034c-.176-1.32-.544-2.373-1.364-3.202c-.821-.83-1.866-1.204-3.176-1.382c-1.276-.173-2.909-.173-4.982-.173zM4.85 3.86c.497-.502 1.172-.795 2.312-.95c1.163-.158 2.694-.16 4.837-.16s3.674.002 4.837.16c1.14.155 1.815.448 2.312.95c.498.503.789 1.188.943 2.345c.156 1.178.158 2.727.158 4.893v4.993c0 1.566-.001 2.68-.087 3.488c-.09.83-.253 1.141-.405 1.282c-.234.215-.528.35-.84.385c-.2.023-.534-.054-1.21-.532c-.658-.467-1.487-1.198-2.653-2.23l-.026-.023c-.488-.431-.892-.788-1.249-1.05c-.373-.272-.749-.482-1.192-.571a3 3 0 0 0-1.176 0c-.443.09-.82.299-1.192.572c-.357.26-.761.618-1.249 1.049l-.026.023c-1.166 1.032-1.995 1.763-2.653 2.23c-.676.478-1.01.555-1.21.532a1.5 1.5 0 0 1-.84-.385c-.152-.141-.316-.452-.404-1.282c-.087-.809-.088-1.922-.088-3.488v-4.994c0-2.165.002-3.714.158-4.892c.154-1.157.445-1.842.943-2.345"
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

const MyBookIcon = ({ color = "currentColor", width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      d="M6 2a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12V2H6Zm2 4h6v2H8V6Zm0 4h6v2H8v-2Z"
    />
  </Svg>
);

const TabsLayout = () => {
  const { colorScheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#B34136",
        tabBarInactiveTintColor:
          colorScheme === "dark" ? colors.dark[200] : colors.light[200],
        tabBarStyle: {
          backgroundColor:
            colorScheme === "dark" ? colors.dark[100] : colors.light[100],
          height: 90,
          paddingBottom: 50,
          paddingTop: 10,
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: "absolute",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
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
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              SvgIcon={SearchIcon}
              color={color}
              focused={focused}
              name="Search"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              SvgIcon={LibraryIcon}
              color={color}
              focused={focused}
              name="Library"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my-book"
        options={{
          title: "My Book",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              SvgIcon={MyBookIcon}
              color={color}
              focused={focused}
              name="MyBook"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
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
