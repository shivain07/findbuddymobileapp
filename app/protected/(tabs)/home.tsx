import Feed from '@/components/feed/Feed';
import PostInputModal from '@/components/post/PostInputModal';
import React from 'react';
import {View } from 'tamagui';

export default function HomePage() {

  return (
    <View padding="$4" flex={1} maxHeight={"100%"}>
      <PostInputModal />
      <Feed />
    </View>
  );
}
