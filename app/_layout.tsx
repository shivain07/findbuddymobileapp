import { UNPROTECTED_ROUTES } from '@/constants/Ui';
import { useUserStore } from '@/globalstore/userStore';
import { Slot, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { TamaguiProvider } from 'tamagui'
import Toast from 'react-native-toast-message';
import OverlayLoader from '@/components/modified/Overlayloader';
import { useLoaderStore } from '@/globalstore/apiLoaderStore';
import VerifyUserPopup from '@/components/popups/VerifyUserPopup';
import LoginRequiredPopup from '@/components/popups/LoginRequiredPopup';
import appConfig from '@/tamagui.config';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedin,accessToken ,clearUser,user} = useUserStore();
  const { isLoading } = useLoaderStore();
  useEffect(() => {
    if(!accessToken){
      clearUser();
      router.replace("/login");
    }
    if (!isLoggedin && !UNPROTECTED_ROUTES.includes(pathname)) {
      router.replace("/login");
    }
    else if (isLoggedin && UNPROTECTED_ROUTES.includes(pathname)) {
      router.replace("/protected/home");
    }
  }, [isLoggedin]);

  // const [loaded] = useFonts({
  //   Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
  //   InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  // })

  // if (!loaded) {
  //   return <TamaguiProvider config={appConfig}>
  //     <SafeAreaView style={{ flex: 1 }}>
  //       <Slot />
  //     </SafeAreaView>
  //   </TamaguiProvider>
  // }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TamaguiProvider config={appConfig}>
        <OverlayLoader isVisible={isLoading} />
        <VerifyUserPopup /> 
        <LoginRequiredPopup/>
        <Slot />
        <Toast />
      </TamaguiProvider >
    </SafeAreaView>

  );
}