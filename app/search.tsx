import Search from '@/components/search/Search';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Button, ScrollView, View } from 'tamagui';

export default function SearchPage() {
  return (
    <View backgroundColor={"$purple3"} flex={1}>
      <Button
        onPress={() => router.push("/")}
        alignSelf="flex-start"
        icon={<Ionicons name="arrow-back" size={20} />}
        margin="$4"

      >
      </Button>
      <Search />
    </View>
  );
}