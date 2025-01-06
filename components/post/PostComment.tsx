import { API_PATH } from "@/constants/Ui";
import { useApiCall } from "@/helpers/axiosWrapper";
import { IComment } from "@/interfaces/user";
import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Toast from "react-native-toast-message";
import userNoDp from "@/assets/images/userimg.png";

import {
    Text,
    Button,
    TextArea,
    YStack,
    XStack,
    Avatar,
    Separator,
    Sheet,
    View,
} from "tamagui";
import Octicons from "@expo/vector-icons/Octicons";
import { FlatList, Pressable } from "react-native";
import KeyboardDismissComponent from "@/components/modified/KeyboardDismissComponent";

interface IPostComment {
    title: string;
    content: string;
    postId: string;
    userId: string;
    commentsCount: number;
}

interface ICommentForm {
    comment: string;
}

const PostComment: React.FC<IPostComment> = ({
    title,
    content,
    postId,
    userId,
    commentsCount,
}) => {
    const { apiCall } = useApiCall(); // Custom API call hook
    const [comments, setComments] = useState<IComment[]>([]);
    const [totalComments, setTotalComments] = useState(commentsCount);
    const [open, setOpen] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<ICommentForm>();

    const onSubmit: SubmitHandler<ICommentForm> = async (data) => {
        let commentData = {
            content: data.comment,
            postedBy: userId,
            postId,
        };

        let res = await apiCall({
            url: API_PATH.comment.add,
            method: "POST",
            data: commentData,
        });

        if (res) {
            Toast.show({
                text1: "Comment added successfully",
                type: "success",
            });
            getAllComments();
            setValue("comment", "")
        } else {
            setOpen(false);
        }
    };

    const getAllComments = async () => {
        const data = await apiCall({
            url: API_PATH.comment.get,
            method: "GET",
            params: { postId: postId },
        });

        if (data.postComments) {
            setComments(data.postComments);
            setTotalComments(data.postComments.length || 0);
        }

    };

    const viewComments = () => {
        setOpen(true);
        getAllComments();
    }

    return (
        <View>
            <Pressable onPress={viewComments} style={({ pressed }) => [
                {
                    padding: 5,
                    backgroundColor: pressed ? 'rgba(0, 0, 0, 0.1)' : 'transparent', // Subtle tint when pressed
                    borderRadius: 5
                }
            ]} >
                <XStack alignItems="center" gap="$2">
                    <Text>{totalComments > 0 ? totalComments : ""}</Text>
                    <Octicons name="comment" size={20} color="#71797E" />
                </XStack>
            </Pressable>

            <Sheet
                modal
                open={open}
                onOpenChange={setOpen}
                snapPoints={[90, 50, 20]} // Percentage heights for snapping
                dismissOnSnapToBottom={true}
            >
                {/* Sheet Overlay */}
                <Sheet.Overlay backgroundColor="rgba(0,0,0,0.2)" />

                {/* Sheet Content */}
                <Sheet.Frame flex={1} backgroundColor="white" borderRadius="$4" padding="$4">
                    <KeyboardDismissComponent>
                        <YStack gap="$3" padding="$2" marginBottom={"$1"}>
                            {/* Post Details */}
                            <Text fontSize="$4" fontWeight="bold">
                                {title}
                            </Text>
                            <Text>{content}</Text>

                            {/* Comment Input */}
                            <YStack gap="$2">
                                <Controller
                                    name="comment"
                                    control={control}
                                    rules={{
                                        required: { value: true, message: "Please add a comment" }
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextArea
                                            size="$4"
                                            placeholder="Add a comment..."
                                            borderColor={errors.comment ? "$red8" : "#ccc"}
                                            borderWidth={1}
                                            onBlur={() => {
                                                onChange(value?.trim());
                                                onBlur();  // Ensure the onBlur event still gets triggered
                                            }}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    )}
                                />
                                {errors.comment && <Text color="$red9">{errors.comment.message}</Text>}
                                <Button theme={"purple"} onPress={handleSubmit(onSubmit)}>{"Submit "}</Button>
                            </YStack>
                            <Separator borderColor={"$purple8"} />
                        </YStack>
                    </KeyboardDismissComponent>
                    {/* Comments Section */}
                    <YStack gap="$3" padding="$2" flex={1} flexGrow={1}>
                        <XStack justifyContent="space-between" alignItems="center">
                            <Text>Comments ({comments.length})</Text>
                            <Text fontSize="$4" padding="$1">
                                Most relevant <Octicons name="triangle-down" size={20} color="#71797E" />
                            </Text>
                        </XStack>

                        {/* FlatList to show comments */}
                        {comments?.length > 0 ? (
                            <FlatList
                                data={comments}
                                renderItem={({ item: comment }: { item: IComment }) => (
                                    <YStack
                                        key={comment._id}
                                        padding="$2"
                                        backgroundColor="$background"
                                        borderRadius="$2"
                                        borderColor="$gray7"
                                        borderWidth={1}
                                        marginVertical={"$2"}
                                    >
                                        <XStack gap="$2" alignItems="center">
                                            <Avatar circular size="$3">
                                                <Avatar.Image
                                                    src={comment.postedBy?.profileImgUrl || userNoDp}
                                                />
                                            </Avatar>
                                            <YStack>
                                                <Text fontWeight="bold">{comment.postedBy?.username}</Text>
                                                <Text fontSize="$2">{comment.postedBy?.email}</Text>
                                            </YStack>
                                        </XStack>
                                        <Text padding="$2">{comment.content}</Text>
                                    </YStack>
                                )}
                                keyExtractor={(item) => item._id!}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                style={{ flexGrow: 1 }}  // Allow FlatList to take available space and scroll
                            />
                        ) : (
                            <XStack padding="$4" alignItems="center" gap="$2" justifyContent="center">
                                <Text fontWeight="600">No comments yet. Be the first!</Text>
                            </XStack>
                        )}
                    </YStack>

                </Sheet.Frame>
            </Sheet>
        </View>
    );
};

export default PostComment;
