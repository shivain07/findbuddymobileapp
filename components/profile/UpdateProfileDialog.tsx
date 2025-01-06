import { API_PATH } from '@/constants/Ui';
import { useUserStore } from '@/globalstore/userStore';
import { useApiCall } from '@/helpers/axiosWrapper';
import Entypo from '@expo/vector-icons/Entypo';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

import {
    Adapt,
    Button,
    Dialog,
    Input,
    Sheet,
    Text,
    Unspaced,
    View,
    XStack,
    YStack,
} from 'tamagui';
import KeyboardDismissComponent from '../modified/KeyboardDismissComponent';

interface IUserEdit {
    username: string;
    profileImgUrl?: string;
}

function UpdateProfileDialog({
    userId,
    username
}: {
    userId: string,
    username: string
}) {
    const [open, setOpen] = useState(false);
    const { updateUser } = useUserStore();
    const { apiCall } = useApiCall();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<IUserEdit>();

    const onSubmit: SubmitHandler<IUserEdit> = async (data) => {
        let postData = {
            username: data.username,
            profileImgUrl: data.profileImgUrl,
            userId: userId,
        };

        let response = await apiCall({
            url: API_PATH.user.update,
            method: "POST",
            data: postData,
        });

        if (response) {
            updateUser({
                username: response?.user?.username,
                profileImgUrl: response?.user?.profileImgUrl
            })
            reset({
                username: response?.user?.username,
                profileImgUrl: ""
            });
            setOpen(false);
            Toast.show({
                type: "success",
                text1: "User details updated successfully."
            })
        }
    };

    return (
        <Dialog modal open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button variant='outlined' onPress={() => setOpen(true)} >{"Update profile "}</Button>
            </Dialog.Trigger>

            <Adapt when="sm" platform="touch">
                <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
                    <Sheet.Frame padding="$4" gap="$4">
                        <Adapt.Contents />
                    </Sheet.Frame>
                    <Sheet.Overlay
                        animation="lazy"
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                </Sheet>
            </Adapt>

            <Dialog.Portal>
                <Dialog.Overlay
                    key="overlay"
                    animation="slow"
                    opacity={0.5}
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />

                <Dialog.Content
                    bordered
                    elevate
                    key="content"
                    animateOnly={['transform', 'opacity']}
                    animation={[
                        'quicker',
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
                    enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                    exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                    gap="$4"
                >
                    <KeyboardDismissComponent>
                        <View flex={1}>

                            <Dialog.Title>Edit profile</Dialog.Title>
                            <Dialog.Description>
                                Make changes to your profile here. Click save when you're done.
                            </Dialog.Description>

                            <YStack alignItems="center" gap="$3" marginTop="$2">
                                <YStack gap="$1" width={"100%"}>
                                    <Controller
                                        name="username"
                                        control={control}
                                        defaultValue={username}
                                        rules={{
                                            required: { value: true, message: "Please enter a username" },
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Input
                                                size="$4"
                                                placeholder="Username"
                                                borderColor={errors.username ? "$red8" : "#ccc"}
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
                                <YStack gap="$1" width={"100%"}>
                                    <Controller
                                        name="profileImgUrl"
                                        control={control}
                                        rules={{
                                            required: false,
                                            pattern: {
                                                value: /^(https?:\/\/)?((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|localhost|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/[^\s]*)?$/,
                                                message: "Please enter a valid url"
                                            },
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Input
                                                size="$4"
                                                placeholder='Pic url ex : https://github.com/shadcn.png'
                                                borderColor={errors.profileImgUrl ? "$red8" : "#ccc"}
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
                                    {errors.profileImgUrl && <Text color="$red9">{errors.profileImgUrl.message}</Text>}
                                </YStack>
                                <XStack alignSelf="flex-end" gap="$4">

                                    <Button theme={"purple"} onPress={handleSubmit(onSubmit)}>{"Save "}</Button>
                                    <Dialog.Close displayWhenAdapted asChild>
                                        <Button aria-label="Close">
                                            {"Cancel "}
                                        </Button>
                                    </Dialog.Close>
                                </XStack>
                            </YStack>


                            <Unspaced>
                                <Dialog.Close asChild>
                                    <Button
                                        position="absolute"
                                        top="$3"
                                        right="$3"
                                        size="$2"
                                        circular
                                        icon={<Entypo name="cross" size={24} color="red" />}
                                    />
                                </Dialog.Close>
                            </Unspaced>
                        </View>

                    </KeyboardDismissComponent>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    )
}

export default UpdateProfileDialog;