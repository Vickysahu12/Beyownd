import { Tabs } from "expo-router";
import CustomTabBar from "@/components/ui/navigation/CustomTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="notes" />
      <Tabs.Screen name="tasks" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}