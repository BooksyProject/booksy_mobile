// app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/(tabs)/home" />; // hoặc route mặc định của bạn
}
