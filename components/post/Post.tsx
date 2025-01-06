import { useUserStore } from '@/globalstore/userStore';
import { IUserPost } from '@/interfaces/user';
import { getDateAndTime } from '@/libutils/utils';
import React, { useState } from 'react';
import { Avatar, Button, Text, YStack, XStack, Spacer, ScrollView } from 'tamagui';
import userNoDp from "@/assets/images/userimg.png";
import Octicons from '@expo/vector-icons/Octicons';
import PostLike from './PostLike';
import PostComment from './PostComment';
import { Pressable } from 'react-native';
import PostDeletePopup from '../popups/PostDeletePopup';

interface PostProps extends IUserPost {
    refresh: () => void; // Add a refresh method
}
export default function Post({
    _id,
    title,
    content,
    postedBy,
    tags,
    likes,
    comments,
    createdAt,
    updatedAt,
    refresh
}: PostProps) {
    const { user } = useUserStore();

    return (
        <YStack borderRadius="$4" padding="$4" backgroundColor="white" elevation={1} gap="$4">
            {/* {user?._id === postedBy._id && <PostDeletePopup show={show} setShow={setShow} userId={user?._id || ""} postId={_id || ""} />} */}
            <XStack alignItems="center" justifyContent='space-between' gap="$2">
                <XStack gap="$3">
                    <Avatar circular size="$4">
                        <Avatar.Image
                            accessibilityLabel="Cam"
                            src={postedBy.profileImgUrl || userNoDp}
                        />
                        <Avatar.Fallback backgroundColor="$blue10" />
                    </Avatar>

                    <YStack alignSelf="flex-start">
                        <Text fontSize="$5" fontWeight="600">
                            {postedBy.username}
                        </Text>
                        <Text fontSize="$2" fontWeight="300">
                            {postedBy.email}
                        </Text>
                    </YStack>
                </XStack>
                {user?._id === postedBy._id && <PostDeletePopup userId={user?._id || ""} postId={_id || ""} refresh={refresh}/>}
            </XStack>
            <ScrollView
                maxHeight={210}
            >
                {/* Text */}
                <Text fontSize="$4" fontWeight={"600"} marginBottom={"$2"}>
                    {title}
                </Text>
                <Text fontSize="$4">
                    {content}
                </Text>

                {/* Date */}
                <Spacer />
                <YStack alignItems="flex-end">
                    <Text fontSize="$3" fontStyle="italic" color="gray400">
                        {updatedAt ? getDateAndTime(updatedAt) : '-'}
                    </Text>
                </YStack>
            </ScrollView>

            {/* Footer */}
            <XStack justifyContent="space-between" alignItems="center" paddingTop="$2" borderTopWidth={1} borderTopColor="gray300">

                <PostLike
                    postId={_id || ""}
                    userId={user?._id || ""}
                    likes={likes || []}
                />
                <PostComment
                    title={title}
                    content={content}
                    postId={_id || ""}
                    userId={user?._id || ""}
                    commentsCount={comments?.length || 0}
                />

                <Button size="$2" onPress={() => { }} chromeless>
                    <Octicons name="share-android" size={20} color="#71797E" />
                </Button>
            </XStack>
        </YStack>
    );
}
