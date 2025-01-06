import React from 'react';
import { API_PATH } from '@/constants/Ui';
import { useApiCall } from '@/helpers/axiosWrapper';
import Toast from 'react-native-toast-message';
import { AlertDialog, Button, YStack, XStack, View, Text } from 'tamagui';
import { Octicons } from '@expo/vector-icons';

interface IPostDeletePopup {
    userId: string;
    postId: string;
    refresh: () => void;
}

export default function PostDeletePopup({
    userId,
    postId,
    refresh
}: IPostDeletePopup) {
    const { apiCall } = useApiCall();

    const deletePost = async () => {
        const response = await apiCall({
            url: API_PATH.post.delete,
            method: 'DELETE',
            params: { userId, postId },
        });

        if (response.success) {
            Toast.show({
                type: 'success',
                text1: 'Post has been deleted.',
            });
            refresh();
        }
    };

    return (
        <View>
            <AlertDialog native>
                <AlertDialog.Trigger padding="$2">
                    <Octicons name='trash' size={24} />
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
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
                        <YStack gap="$2" theme="red">
                            <AlertDialog.Title>
                                <Text>{'Are you sure you want to delete this post'}</Text>
                            </AlertDialog.Title>
                            <AlertDialog.Description>
                                <Text>{'Are you sure you want to delete this post'}</Text>

                            </AlertDialog.Description>

                            <XStack gap="$3" justifyContent="flex-end">
                                <AlertDialog.Cancel asChild>
                                    <Button>{"Cancel"}</Button>
                                </AlertDialog.Cancel>
                                <AlertDialog.Action asChild onPress={deletePost}>
                                    <Button theme="red" >
                                        {"Continue"}
                                    </Button>
                                </AlertDialog.Action>
                            </XStack>
                        </YStack>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog>
        </View>
    );
}
