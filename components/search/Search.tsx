import Post from '@/components/post/Post';
import { API_PATH } from '@/constants/Ui';
import { useApiCall } from '@/helpers/axiosWrapper';
import { IUserPost } from '@/interfaces/user';
import React, { useState } from 'react';
import { YStack, Text, Slider, Button, View, XStack, Separator } from 'tamagui';
import PhotonAutoSuggestion from '@/components/modified/PhotonAutoSuggestion';
import { FlatList } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';


function Search() {
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    location: string;
    coordinates: (number | null)[];
  } | null>({
    location: "",
    coordinates: [],
  });
  const [refreshing, setRefreshing] = useState(false);
  const maxKm = 50;
  const [rangeInKm, setRangeInKm] = useState(1);
  const { apiCall } = useApiCall(); // Accessing the apiCall function
  const [relevantPosts, setRelevantPosts] = useState<IUserPost[]>([]);

  const getSearchResults = async () => {
    try {
      const res = await apiCall({
        url: API_PATH.search,
        method: "POST",
        data: {
          coordinates: selectedCoordinates?.coordinates,
          rangeInKm: rangeInKm,
        },
      });
      setRelevantPosts(res.posts || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefresh=()=>{
    setRefreshing(true);
    getSearchResults();
    setRefreshing(false);
}
  const isButtonDisabled =
    !selectedCoordinates ||
    selectedCoordinates.location.trim() === "" ||
    selectedCoordinates.coordinates.length === 0 ||
    selectedCoordinates.coordinates.every((coord) => coord === null);

  return (
    <View flex={1} padding="$5">

      <YStack backgroundColor={"white"} padding="$4" borderRadius={"$4"} width="100%" alignSelf="center" maxWidth={600} gap="$2" flex={1}>
        <Text fontSize="$6" fontWeight="bold" color="gray.800">
          Search Nearby Posts
        </Text>

        <YStack gap="$4">
          <YStack>

            <PhotonAutoSuggestion
              selectedCoordinates={selectedCoordinates}
              setSelectedCoordinates={setSelectedCoordinates}
            />
            {!selectedCoordinates?.location && (
              <Text fontSize={"$2"} color={"$red8"}>
                *Please fill in some location*
              </Text>
            )}
          </YStack>

          <YStack gap="$2">
            <XStack>
              <Text fontSize={15} fontWeight="semi-bold" marginBottom="$3">Range in kms: </Text>
              <Text fontSize={15} fontWeight="bold" marginBottom="$3">{rangeInKm} </Text>
            </XStack>


            <Slider defaultValue={[rangeInKm]} max={maxKm} min={1} step={1} onValueChange={(e) => setRangeInKm(e[0])}>
              <Slider.Track>
                <Slider.TrackActive />
              </Slider.Track>
              <Slider.Thumb size="$2" index={0} circular backgroundColor={"$purple8"} />
            </Slider>
          </YStack>

          <Button onPress={getSearchResults} theme={"purple"} disabled={isButtonDisabled}
            iconAfter={isButtonDisabled ? <Entypo name="circle-with-cross" size={20} color="gray" /> : <Entypo name="check" size={20} color="gray" />}
          >{"Search "}</Button>
        </YStack>
      </YStack>
      {/* <Separator borderColor={"$purple8"} marginVertical="$4" /> */}
      <View
        width="100%"
        maxWidth={600}
        alignSelf="center"
        flex={1}
        gap="$1"
        marginTop="$2"
      >
        <XStack justifyContent='flex-end'>
          <Text fontSize={"$2"} color={"gray"}>{relevantPosts?.length} results found</Text>
        </XStack>
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
                  refresh={getSearchResults}
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
            <Text color="gray.500">No posts found. Try searching in a larger range.</Text>
          </XStack>
        )}
      </View>
    </View>
  );
}

export default Search;

