import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerToggleButton } from '@react-navigation/drawer';
import { router, usePathname } from 'expo-router';
import { ROUTES } from '@/constants/Ui';
import { Separator } from 'tamagui';
import Profile from '@/components/profile/Profile';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useUserStore } from '@/globalstore/userStore';


const CustomDrawerComponent = (props: DrawerContentComponentProps) => {
  const { clearUser} = useUserStore();
  const pathname = usePathname();

  const logout = () => {
    clearUser();
    router.push("/");
  }

  return <DrawerContentScrollView {...props}>
    <Profile />
    <Separator marginVertical={10} />
    <DrawerItem
      icon={({ color, size }) => {
        return <Ionicons name='home-outline' color={pathname === ROUTES.protected.home ? "purple" : "black"} size={size} />
      }}
      labelStyle={
        [
          {
            color: pathname === ROUTES.protected.home ? "purple" : "black"
          }
        ]
      }
      style={{
        backgroundColor: pathname === ROUTES.protected.home ? "#E5E4E2" : "",
        borderRadius: 10
      }}
      label={"Home"}
      onPress={() => {
        router.push("/protected/home")
      }}
    />
    <DrawerItem
      icon={({ color, size }) => {
        return <Ionicons name="settings-outline" color={pathname === ROUTES.protected.setting ? "purple" : "black"} size={size} />
      }}
      labelStyle={
        [
          {
            color: pathname === ROUTES.protected.setting ? "purple" : "black"
          }
        ]
      }
      style={{
        backgroundColor: pathname === ROUTES.protected.setting ? "#E5E4E2" : "",
        borderRadius: 10
      }}
      label={"Settings"}
      onPress={() => {
        router.push("/protected/setting")
      }}
    />
    <DrawerItem
      icon={({ color, size }) => {
        return <AntDesign name="logout" color={"black"} size={size} />
      }}
      labelStyle={
        [
          {
            color: "black"
          }
        ]
      }
      // style={{
      //   backgroundColor: pathname === ROUTES.protected.setting ? "#E5E4E2" : "",
      //   borderRadius: 10
      // }}
      label={"Logout"}
      onPress={logout}
    />
  </DrawerContentScrollView>
}

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props: DrawerContentComponentProps) => <CustomDrawerComponent {...props} />}
        screenOptions={{
          // headerLeft:()=><DrawerToggleButton/>,
          headerTitleAlign: 'center',
          // Set header title to purple
          headerTitle: "Findbuddy", // Title text
          headerTintColor: 'purple', // Color of the title,
          headerStatusBarHeight: 0,
          
        }}
      >
        {/* <Drawer.Screen name='settings' options={{ headerShown: true }} />
        <Drawer.Screen name='(tabs)' options={{ headerShown: true ,title:"Home"}} /> */}
      </Drawer>
    </GestureHandlerRootView>
  );
}
