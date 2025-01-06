import { API_PATH } from '@/constants/Ui';
import { userVerificationPopupStore, useUserStore } from '@/globalstore/userStore';
import { useApiCall } from '@/helpers/axiosWrapper';
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { AlertDialog, Button, YStack, Text, XStack } from 'tamagui';

export default function VerifyUserPopup() {
    const { showUserVerificationModal, setShowUserVerificationModal } = userVerificationPopupStore();
    const { user } = useUserStore();
    const { apiCall } = useApiCall();

    const verifyUser = async () => {
        const response = await apiCall({
            url: API_PATH.user.sendmail,
            method: "POST",
            data: { userId: user?._id },
        });

        if (response) {
            Toast.show({
                type: "success",
                text1: "Verification mail sent.",
                text2: "Please check your inbox."
            });
        }
        setShowUserVerificationModal(false);

    };

    if (!showUserVerificationModal) {
        return null;
    }
    return (
        <AlertDialog native open={showUserVerificationModal} onOpenChange={setShowUserVerificationModal}>
            <AlertDialog.Trigger padding="$2">
                <Button display='none'>Alert</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal >
                <AlertDialog.Overlay
                    key="overlay"
                    animation="quick"
                    opacity={0.5}
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <AlertDialog.Content
                    bordered
                    elevate
                    key="content"
                    animation={[
                        'quick',
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
                    enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                    exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                    x={0}
                    scale={1}
                    opacity={1}
                    y={0}
                >
                    <YStack gap="$2">
                        <AlertDialog.Title>Verification needed</AlertDialog.Title>
                        <AlertDialog.Description>
                            Please verify your email address to add , like & comment on posts.
                        </AlertDialog.Description>

                        <XStack gap="$3" justifyContent="flex-end">
                            <AlertDialog.Cancel asChild>
                                <Button>{"Cancel "}</Button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild onPress={verifyUser}>
                                <Button theme="green">{"Verify "}</Button>
                            </AlertDialog.Action>
                        </XStack>
                    </YStack>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog>
    );
}
