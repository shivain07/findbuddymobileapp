import React from 'react';
import { H2, YStack } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import { Image } from 'tamagui';

export default function SettingsPage() {
  return (
    <YStack alignSelf='center' padding="$4" gap="$2 ">
      <H2>
        Setting pages pending...
      </H2>
      <H2>
        ENjoy this random image for now .
      </H2>
      <Image
        source={{
          uri: 'https://picsum.photos/300/300',
          width: 300,
          height: 300,
        }}
      />
    </YStack>
  );
}
