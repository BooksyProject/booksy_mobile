import { useTheme } from "@/contexts/ThemeContext";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";

const Profile = () => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  return <></>;
};

export default Profile;
