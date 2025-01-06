import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Button, Input, YStack, View, Text } from 'tamagui';
import { useUserStore } from '@/globalstore/userStore';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useApiCall } from '@/helpers/axiosWrapper';
import { API_PATH } from '@/constants/Ui';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Entypo from '@expo/vector-icons/Entypo';
import PasswordComponent from '@/components/modified/PasswordComponent';

type Inputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setIsLoggedin, setAccessToken, setRefreshToken, clearUser } = useUserStore();
  const { apiCall } = useApiCall();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const handleLogin: SubmitHandler<Inputs> = async (formdata) => {
    const response = await apiCall({
      url: API_PATH.user.login,
      method: "POST",
      data: formdata
    });

    if (response.success) {
      setIsLoggedin(true);
      setUser(response?.user);
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      Toast.show({
        text1: "Login successfull.",
        type: "success"
      })
    } else {
      Toast.show({
        text1: "Login failed.",
        text2: "Please try again.",
        type: "error"
      })
      clearUser();
    }

  };

  return (
    <View flex={1} justifyContent="center" alignItems="center" padding={"$4"}>
      {/* Back Button */}
      <Button
        onPress={() => router.push("/")}
        alignSelf="flex-start"
        icon={<Ionicons name="arrow-back" size={20} />}
        marginBottom="$4"
      >
      </Button>

      {/* Title */}
      <Text fontSize={24} fontWeight="bold" color="#333" marginBottom="$6">
        Welcome Back
      </Text>

      {/* Login Form */}
      <YStack padding={"$4"} gap={"$5"} width={320} borderRadius="$4" backgroundColor="white" shadowColor="black" shadowRadius={10} shadowOpacity={0.1} shadowOffset={{ width: 0, height: 4 }}>

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

        {/* Password Input */}
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

        <Button
          // size="$5"
          theme="purple"
          // backgroundColor={"$purple6"}
          onPress={handleSubmit(handleLogin)}
          borderRadius="$3"
        >
          {"Login "}
        </Button>
      </YStack>

      {/* Footer */}
      <YStack alignItems="center" marginTop="$6" gap="$2">
        <Text fontSize={14} color="#666">
          Don't have an account?
        </Text>
        <Button
          size="$3"
          onPress={() => router.push('/signup')}
        >
          {"Sign Up "}
        </Button>
      </YStack>
    </View>
  );
}
