import { HomeThemeProvider } from '@/context/ThemeContext';
import { Tabs } from "expo-router";
import CustomTabBar from "@/components/ui/navigation/CustomTabBar";

export default function TabsLayout() {
  return (
    <HomeThemeProvider>
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="practice" />
      <Tabs.Screen name="tasks" />
      <Tabs.Screen name="profile" />
    </Tabs>
    </HomeThemeProvider>
  );
}