import { API_PATH } from "@/constants/Ui";
import { useApiCall } from "@/helpers/axiosWrapper";
import Octicons from "@expo/vector-icons/Octicons";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import Toast from "react-native-toast-message";
import { Text, XStack } from "tamagui";

function PostLike({
    postId,
    userId,
    likes,
}: {
    postId: string;
    userId: string;
    likes: string[];
}) {
    const { apiCall } = useApiCall(); // Accessing the apiCall function
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(likes?.length || 0);

    useEffect(() => {
        if (likes.includes(userId)) {
            setIsLiked(true);
        } else {
            setIsLiked(false);
        }
    }, [likes]);

    const getAllLikes = () => { };

    const likePost = async () => {
        let response = await apiCall({
            url: API_PATH.post.like,
            method: "POST",
            data: {
                postId,
                likedBy: userId,
            },
        });

        if (response) {
            setIsLiked(!isLiked);
            if (!isLiked) {
                Toast.show({ text1: "Post liked.", type: "success" })
            }
            isLiked ? setLikesCount(prev => prev - 1) : setLikesCount(prev => prev + 1)
        }

    };

    return (<Pressable onPress={likePost} style={({ pressed }) => [
        {
            padding: 5,
            backgroundColor: pressed ? 'rgba(0, 0, 0, 0.1)' : 'transparent', // Subtle tint when pressed
            borderRadius: 5
        }
    ]} >
        <XStack gap="$2" alignItems='center'>
            <Text fontSize="$4">
                {likesCount > 0 ? likesCount : ""}
            </Text>
            {!isLiked ? <Octicons name="heart" size={20} color={"#71797E"} />
                : <Octicons name="heart-fill" size={20} color={"purple"} />
            }
        </XStack>
    </Pressable>);
}

export default PostLike;