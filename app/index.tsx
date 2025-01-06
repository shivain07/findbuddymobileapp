import { useRouter } from 'expo-router'
import { Button, Image, Text, View, XStack, YStack } from 'tamagui'
import hero from "../assets/images/hero.png"

export default function RootLayout() {
  const router = useRouter();
  return (
    <View flex={1} alignItems="center" justifyContent="space-between" padding={16}>
      {/* Header */}
      <YStack alignItems="center" marginTop={24}>
        <Text fontSize={28} fontWeight="bold" color="purple" textAlign="center">
          Welcome to FindBuddy
        </Text>
        <Text fontSize={14} color="gray" textAlign="center" marginTop={4}>
          Discover, connect, and explore like never before!
        </Text>
      </YStack>

      {/* Hero Image */}
      <Image
        source={hero}
        style={{
          width: 250,
          height: 200,
        }}
        resizeMethod="auto"
      />

      {/* CTA Buttons */}
      <YStack gap={12} width="100%">
        <Button
          theme="purple"
          size="$4"
          onPress={() => router.push('/login')}
      
        >
          {"Login "}
        </Button>
        <Button
          size="$4"
          variant="outlined"
          onPress={() => router.push('/signup')}
         
        >
          {"Signup "}
        </Button>
        <Button
          size="$4"
          theme="green"
          onPress={() => router.push('/search')}
       
        >
          {"Explore as Guest "}
        </Button>
      </YStack>

      {/* Footer */}
      <XStack justifyContent="center" paddingVertical={16}>
        <Text fontSize={14} color="gray">
          © 2024 FindBuddy. All rights reserved.
        </Text>
      </XStack>
    </View>
  )
}
