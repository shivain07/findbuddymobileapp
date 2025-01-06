import React from 'react';
import { useState } from 'react';
import { Button, Input, YStack, Text, View } from 'tamagui';
import { useRouter, Link } from 'expo-router';
import PhotonAutoSuggestion from '@/components/modified/PhotonAutoSuggestion';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApiCall } from '@/helpers/axiosWrapper';
import { API_PATH } from '@/constants/Ui';
import Toast from 'react-native-toast-message';
import Entypo from '@expo/vector-icons/Entypo';
import PasswordComponent from '@/components/modified/PasswordComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useUserStore } from '@/globalstore/userStore';

type Inputs = {
  email: string;
  password: string;
  username: string;
  tags: string;
};

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const { setUser, setIsLoggedin, setAccessToken, setRefreshToken } = useUserStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    location: string;
    coordinates: (number | null)[];
  } | null>({
    location: "",
    coordinates: [],
  });

  const { apiCall } = useApiCall();

  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      let userData = {
        username: data.username,
        email: data.email,
        password: data.password,
        tags: data.tags ? data.tags.trim()?.split(" ") : [],
        location: selectedCoordinates?.location,
        geoLocation: {
          type: "Point",
          coordinates: selectedCoordinates?.coordinates,
        },
      };

      const response = await apiCall({
        url: API_PATH.user.signup,
        method: "POST",
        data: userData,
      });

      if (response.success) {
        setIsLoggedin(true);
        setUser(response?.user);
        setAccessToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        // router.push("/login");
        Toast.show({
          type: "success",
          text1: "Sign up successfull.",
          text2: "Login to continue."
        })
      } else {
        Toast.show({
          type: "error",
          text1: "Sign up failed.",
          text2: "Please try again."
        })
      }
      // Redirect or show success message
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `${error}`,
      })
    }
  };

  const isButtonDisabled =
    !selectedCoordinates ||
    selectedCoordinates.location.trim() === "" ||
    selectedCoordinates.coordinates.length === 0 ||
    selectedCoordinates.coordinates.every((coord) => coord === null);

  return (
    <KeyboardAwareScrollView>
      <View flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Button
          onPress={() => router.push("/")}
          alignSelf="flex-start"
          icon={<Ionicons name="arrow-back" size={20} />}
          marginBottom="$4"
        >
        </Button>
        <Text fontSize={24} fontWeight="bold" color="#333" marginBottom="$6" textAlign="center">
          Sign Up
        </Text>

        <YStack width="100%" maxWidth={400} padding="$5" backgroundColor="white" borderRadius="$4" shadowRadius={8} shadowOpacity={0.1} gap="$4">

          <YStack gap="$1">
            <Controller
              name="email"
              control={control}
              rules={{
                required: { value: true, message: "Email is required." },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email.",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  size="$4"
                  placeholder="Enter email"
                  borderColor={errors.email ? "$red8" : "#ccc"}
                  borderWidth={1}
                  borderRadius="$3"
                  onBlur={() => {
                    onChange(value?.trim());
                    onBlur();  // Ensure the onBlur event still gets triggered
                  }}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.email && <Text color="$red9">{errors.email.message}</Text>}
          </YStack>

          <YStack gap="$1">
            <Controller
              name="username"
              control={control}
              rules={{
                required: { value: true, message: "Username is required." },
                minLength: { value: 2, message: "Username must be at least 2 characters." }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  size="$4"
                  placeholder="Enter username"
                  borderColor={errors.email ? "$red8" : "#ccc"}
                  borderWidth={1}
                  borderRadius="$3"
                  onBlur={() => {
                    onChange(value?.trim());
                    onBlur();  // Ensure the onBlur event still gets triggered
                  }}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.username && <Text color="$red9">{errors.username.message}</Text>}
          </YStack>

          <YStack gap="$1">
            <Controller
              name="password"
              control={control}
              rules={{
                required: { value: true, message: "Password is required." },
                minLength: { value: 6, message: "Password must be at least 6 characters." },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordComponent
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  isError={errors.password ? true : false}
                />
              )}
            />
            {errors.password && <Text color="$red9">{errors.password.message}</Text>}
          </YStack>

          {/* Step 2 Fields */}
          {currentStep === 2 && (
            <>
              <YStack gap="$1">
                <Controller
                  name="tags"
                  control={control}
                  rules={{
                    required: { value: true, message: "Please include some tags." }
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      size="$4"
                      placeholder="Tags ex: sports,music"
                      borderColor={errors.tags ? "$red8" : "#ccc"}
                      borderWidth={1}
                      borderRadius="$3"
                      onBlur={() => {
                        onChange(value?.trim());
                        onBlur();  // Ensure the onBlur event still gets triggered
                      }}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.tags && <Text color="$red9">{errors.tags.message}</Text>}
              </YStack>

              <PhotonAutoSuggestion
                selectedCoordinates={selectedCoordinates}
                setSelectedCoordinates={setSelectedCoordinates}
                placeholder="Your location"
                showLabel={false}
              />
              {!selectedCoordinates?.location && (
                <Text fontSize={"$2"} color={"$red8"}>
                  *Please fill in some location*
                </Text>
              )}
            </>
          )}

          {/* Step 1 Next Button */}
          {currentStep === 1 && (
            <Button
              theme="purple"
              onPress={() => setCurrentStep(2)}
              marginTop="$4"
              fontWeight="600"
              borderRadius="$3"
              width="100%"
              disabled={false}
            >
              {"Next "}
            </Button>
          )}

          {/* Step 2 Sign Up Button */}
          {currentStep === 2 && (
            <Button
              theme="purple"
              onPress={handleSubmit(onSubmit)} // Add actual submit logic here
              marginTop="$4"
              fontWeight="600"
              borderRadius="$3"
              width="100%"
              disabled={isButtonDisabled}
              iconAfter={isButtonDisabled ? <Entypo name="circle-with-cross" size={20} color="gray" /> : <Entypo name="check" size={20} color="gray" />}
            >
              {"Sign Up "}
            </Button>
          )}
        </YStack>

        <YStack alignItems="center" marginTop="$6" gap="$2">
          <Text fontSize={14} color="#666">
            Already have an account? Login
          </Text>
          <Button
            size="$3"
            onPress={() => router.push('/login')}
          >
            {"Login "}
          </Button>
        </YStack>
      </View>
    </KeyboardAwareScrollView>

  );
}
