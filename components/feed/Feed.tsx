import { API_PATH } from "@/constants/Ui";
import { useApiCall } from "@/helpers/axiosWrapper";
import { IUserPost } from "@/interfaces/user";
import { useCallback, useState } from "react";
import { Text, View, XStack, YStack } from "tamagui";
import Post from "../post/Post";
import { useFocusEffect } from "expo-router";
import { FlatList } from "react-native";

function Feed() {
    const { apiCall } = useApiCall(); // Accessing the apiCall function
    const [relevantPosts, setRelevantPosts] = useState<IUserPost[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            getAllRelevantPosts();
        }, [])
    );

    const getAllRelevantPosts = async () => {
        try {
            const data = await apiCall({
                url: API_PATH.post.getRelevant,
                method: "GET",
            });
            data.allPosts ? setRelevantPosts(data.allPosts) : setRelevantPosts([]);
        } catch (error) {

        }
    };

    const handleRefresh=()=>{
        setRefreshing(true);
        getAllRelevantPosts();
        setRefreshing(false);
    }

    return (<YStack gap="$3" padding="$3" marginTop="$8">

        {relevantPosts.length > 0 ? (
            <FlatList
                data={relevantPosts}
                renderItem={({ item: post }: { item: IUserPost }) => (
                    <View padding="$2">
                        <Post
                            _id={post._id}
                            title={post.title}
                            content={post.content}
                            postedBy={post.postedBy}
                            tags={post.tags}
                            likes={post.likes}
                            comments={post.comments}
                            createdAt={post.createdAt}
                            updatedAt={post.updatedAt}
                            refresh={getAllRelevantPosts}
                        />
                    </View>
                )}
                keyExtractor={(item) => item._id!}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
        ) : (
            <XStack padding="$4" alignItems="center" gap="$2" justifyContent="center">
                <Text fontWeight="600">No posts available currently.</Text>
            </XStack>
        )}
    </YStack>);
}

export default Feed;