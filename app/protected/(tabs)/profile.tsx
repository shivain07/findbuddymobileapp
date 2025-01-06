import Post from '@/components/post/Post';
import { API_PATH } from '@/constants/Ui';
import { useUserStore } from '@/globalstore/userStore';
import { useApiCall } from '@/helpers/axiosWrapper';
import { IUserPost } from '@/interfaces/user';
import Octicons from '@expo/vector-icons/Octicons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { YStack, Text, XStack, View } from 'tamagui';

export default function ProfilePage() {
  const [userPosts, setUserPosts] = useState<IUserPost[]>([]);
  const { user } = useUserStore();
  const { apiCall } = useApiCall(); // Accessing the apiCall funct

  useFocusEffect(
    useCallback(() => {
      getUserData();
    }, [])
  );

  const getUserData = async () => {

    const data = await apiCall({
      url: API_PATH.post.get,
      method: "GET",
      params: { userId: user?._id },
    });
    data.userPosts ? setUserPosts(data.userPosts) : setUserPosts([]);

  };

  return (
    <YStack gap="$2" padding="$3" flex={1}>
      <XStack padding="$4" alignItems='center' gap="$2" justifyContent='center'>
        <Text fontWeight={"600"} >Hey checkout posts made by you</Text>
        <Octicons name='heart-fill' color={"purple"} size={20} />
      </XStack>


      {userPosts.length > 0 ? (
        <FlatList
          data={userPosts}
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
                refresh={getUserData}
              />
            </View>
          )}
          keyExtractor={(item) => item._id!}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <XStack padding="$4" alignItems="center" gap="$2" justifyContent="center">
          <Text fontWeight="600">Add a few posts and come back again</Text>
          <Octicons name="heart-fill" color="purple" size={20} />
        </XStack>
      )}

    </YStack>
  );
}
