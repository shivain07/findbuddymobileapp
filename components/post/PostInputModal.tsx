import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Button, Sheet, YStack, Text, XStack, View, Input, TextArea } from 'tamagui';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { IUserPost } from '@/interfaces/user';
import Toast from 'react-native-toast-message';
import PhotonAutoSuggestion from '@/components/modified/PhotonAutoSuggestion';
import { API_PATH } from '@/constants/Ui';
import { useApiCall } from '@/helpers/axiosWrapper';
import { useUserStore } from '@/globalstore/userStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function PostInputModal() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { user } = useUserStore();
    const { control, handleSubmit, formState: { errors }, reset } = useForm<IUserPost>();
    const { apiCall } = useApiCall();
    const [selectedCoordinates, setSelectedCoordinates] = useState<{
        location: string;
        coordinates: (number | null)[];
    } | null>({
        location: "",
        coordinates: [],
    });

    const onSubmit: SubmitHandler<IUserPost> = async (data) => {
        let postData = {
            content: data.content,
            title: data.title,
            tags: data.tags ? data.tags.split(" ") : [],
            postedBy: user?._id,
            location: selectedCoordinates?.location,
            geoLocation: {
                type: "Point",
                coordinates: selectedCoordinates?.coordinates,
            },
        };

        const response = await apiCall({
            url: API_PATH.post.add,
            method: "POST",
            data: postData,
        })

        if (response) {
            setIsSheetOpen(false)
            reset({
                title: '',
                content: '',
                tags: '',
            });
            Toast.show({
                type: "success",
                text1: "Post added successfully"
            });
        } else {
            setIsSheetOpen(false)
            Toast.show({
                type: "error",
                text1: "Something went wrong . Please try again."
            });
        }
    };

    const isButtonDisabled =
        !selectedCoordinates ||
        selectedCoordinates.location.trim() === "" ||
        selectedCoordinates.coordinates.length === 0 ||
        selectedCoordinates.coordinates.every((coord) => coord === null);

    const openAddPostModal = () => {
        setIsSheetOpen(true);
    }
    return (
        <YStack flex={1} alignItems="center" justifyContent="center" margin="$4">
            <Pressable onPress={openAddPostModal} style={({ pressed }) => [
                {
                    transform: [{ scale: pressed ? 0.95 : 1 }],  // Scale down slightly when pressed
                    transition: 'transform 0.1s ease-in-out',     // Smooth transition effect
                }
            ]}>
                <YStack backgroundColor="white" width={300} height={50} justifyContent='center' padding="$3" borderRadius={"$4"}>
                    <View flexDirection='row' justifyContent='space-between'>
                        <Text fontWeight={"500"}>{"Add a post "}</Text>
                        <FontAwesome name="edit" size={20} color="#71797E" />
                    </View>
                </YStack>
            </Pressable>


            {/* Bottom Sheet */}
            <Sheet
                modal
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen} // Close the sheet when the user interacts with it
                snapPoints={[90, 50, 20]} // Percentage heights for snapping
                dismissOnSnapToBottom={true}
            >
                {/* Sheet Overlay */}
                <Sheet.Overlay backgroundColor="rgba(0,0,0,0.2)" />

                {/* Sheet Content */}
                <Sheet.Frame flex={1} backgroundColor="white" borderRadius="$4" padding="$4">
                    <KeyboardAwareScrollView style={{ flex: 1 }}>
                        <YStack gap="$4">
                            <XStack alignItems='center' justifyContent='space-between'>
                                <Text fontWeight="bold" fontSize="$6">
                                    What's on your mind ?
                                </Text>

                                <Entypo name="cross" size={30} color="red" onPress={() => setIsSheetOpen(false)} />
                            </XStack>

                            <YStack gap="$1">
                                <Controller
                                    name="title"
                                    control={control}
                                    rules={{
                                        required: { value: true, message: "Title is required." }
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            size="$4"
                                            placeholder="Title"
                                            borderColor={errors.title ? "$red8" : "#ccc"}
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
                                {errors.title && <Text color="$red9">{errors.title.message}</Text>}
                            </YStack>

                            <YStack gap="$1">
                                <Controller
                                    name="content"
                                    control={control}
                                    rules={{
                                        required: { value: true, message: "Please fill in something." }
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextArea
                                            size="$4"
                                            placeholder="Write something up ...."
                                            borderColor={errors.title ? "$red8" : "#ccc"}
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
                                {errors.content && <Text color="$red9">{errors.content.message}</Text>}
                            </YStack>

                            <YStack gap="$1">
                                <Controller
                                    name="tags"
                                    control={control}
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

                            <YStack>
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
                            </YStack>


                            {/* Close Button */}
                            <Button theme={"purple"} onPress={handleSubmit(onSubmit)} disabled={isButtonDisabled}
                                iconAfter={isButtonDisabled ? <Entypo name="circle-with-cross" size={20} color="gray" /> : <Entypo name="check" size={20} color="gray" />}>{"Post "} </Button>
                            <Button onPress={() => setIsSheetOpen(false)}>{"Cancel "}</Button>
                        </YStack>
                    </KeyboardAwareScrollView>
                </Sheet.Frame>
            </Sheet>
        </YStack>

    );
}

export default PostInputModal;
