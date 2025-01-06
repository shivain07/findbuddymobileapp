import { userLoginPopupStore } from '@/globalstore/userStore';
import { router } from 'expo-router';
import { AlertDialog, Button, YStack, Text, XStack } from 'tamagui';

export default function LoginRequiredPopup() {
    const { showLoginPopup, setShowLoginPopup } = userLoginPopupStore();

    const redirectToLogin = () => {
        router.push('/login')
        setShowLoginPopup(false);
    }

    if (!showLoginPopup) {
        return null;
    }
    return (
        <AlertDialog native
            open={showLoginPopup}
            onOpenChange={setShowLoginPopup}>
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
                        <AlertDialog.Title>Hey ! </AlertDialog.Title>
                        <AlertDialog.Description>
                            Please login / signup to continue.
                        </AlertDialog.Description>

                        <XStack gap="$3" justifyContent="flex-end">
                            <AlertDialog.Cancel asChild>
                                <Button>{"Cancel "}</Button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild onPress={redirectToLogin}>
                                <Button theme="green">{"Login "}</Button>
                            </AlertDialog.Action>
                        </XStack>
                    </YStack>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog>
    );
}
