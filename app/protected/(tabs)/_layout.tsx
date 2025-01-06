import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/tabs';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarHideOnKeyboard:true,
      headerShown: false,
      tabBarStyle: {
        shadowColor: "purple",
        shadowOffset: {
          width: 5,
          height: 5
        }
      }
    }}>
      <Tabs.Screen name="home" options={{
        tabBarIcon: ({ focused }) => <Ionicons name='home-outline' color={focused ? "purple" : ""} size={23} />,
        tabBarShowLabel: false
      }} />
      <Tabs.Screen name="search" options={{
        tabBarIcon: ({ focused }) => <Ionicons name="search-outline" color={focused ? "purple" : ""} size={23} />,
        tabBarShowLabel: false
      }} />
      <Tabs.Screen name="profile" options={{
        tabBarIcon: ({ focused }) => <Ionicons name='person-outline' color={focused ? "purple" : ""} size={23} />,
        tabBarShowLabel: false
      }} />
    </Tabs>
  );
}
