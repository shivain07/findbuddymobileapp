import React from "react";
import { ActivityIndicator } from "react-native";
import { YStack, Text } from "tamagui";

type OverlayLoaderProps = {
  isVisible: boolean;
  message?: string; // Optional message to display below the loader
};

const OverlayLoader: React.FC<OverlayLoaderProps> = ({ isVisible, message }) => {
  if (!isVisible) return null;

  return (
    <YStack
      position="absolute"
      zIndex={100}
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
      backgroundColor="rgba(0, 0, 0, 0.6)" // Semi-transparent black background
    >
      <YStack alignItems="center" gap="$4">
        {/* Replace with any custom loader if needed */}
        <ActivityIndicator size="large" color="white" />
        {message && (
          <Text color="white" fontSize="$6" textAlign="center">
            {message}
          </Text>
        )}
      </YStack>
    </YStack>
  );
};

export default OverlayLoader;
