import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { XStack, YStack, Text, Input, ScrollView } from 'tamagui';

// Type Definitions for Photon API Response
interface PhotonFeature {
    properties: {
        name: string;
        city?: string;
        country?: string;
    };
    geometry: {
        coordinates: [number, number]; // [longitude, latitude]
    };
}

interface ICustomLocationSelector {
    selectedCoordinates: {
        location: string;
        coordinates: (number | null)[];
    } | null;
    setSelectedCoordinates: React.Dispatch<
        React.SetStateAction<{
            location: string;
            coordinates: (number | null)[];
        } | null>
    >;
    placeholder?: string;
    showLabel?: boolean;
}

const CustomLocationSelector = ({
    selectedCoordinates,
    setSelectedCoordinates,
    placeholder = 'Type a place / location name...',
    showLabel = true,
}: ICustomLocationSelector) => {
    const [query, setQuery] = useState<string>(''); // User's search query
    const [options, setOptions] = useState<PhotonFeature[]>([]); // Suggestions
    const [loading, setLoading] = useState<boolean>(false); // Loading state
    const [optionIsSelected, setOptionIsSelected] = useState(false);

    // Fetch suggestions from Photon API
    useEffect(() => {
        setOptionIsSelected(false);
        const fetchSuggestions = async () => {
            if (query.trim().length === 0) {
                setOptions([]);
                return;
            }

            setLoading(true); // Show loading indicator
            try {
                const response = await axios.get('https://photon.komoot.io/api/', {
                    params: { q: query, lang: 'en' },
                });

                // Set options from API response
                setOptions(response.data.features);
            } catch (error) {
                console.error('Error fetching suggestions from Photon:', error);
            } finally {
                setLoading(false); // Hide loading indicator
            }
        };

        // Debounced API call
        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId); // Cleanup debounce
    }, [query]);


    // Handle suggestion selection
    const handleSelect = (selected: PhotonFeature) => {
        const { coordinates } = selected.geometry;
        setOptionIsSelected(true);
        setSelectedCoordinates({
            location: `${selected.properties.name}${selected.properties.city ? `, ${selected.properties.city}` : ''}${selected.properties.country ? `, ${selected.properties.country}` : ''}`,
            coordinates: coordinates,
        });
    };

    return (
        <YStack width="100%">
            {showLabel && <Text fontSize={15} fontWeight="semi-bold" marginBottom="$3">Place / Location:</Text>}
            <Input
                value={query}
                onChangeText={setQuery}
                placeholder={placeholder}
                width="100%"
                borderColor="#ccc"
                borderWidth={1}
                borderRadius="$3"
            />

            {loading && <Text fontSize={14} color="$gray500">Loading...</Text>}

            {/* Render suggestions */}
            {options.length > 0 && !loading && !optionIsSelected && (
                <ScrollView
                    height={200} // Set height to scroll
                    marginTop="$2"
                    //   borderWidth={1}
                    borderColor="$gray300"
                    borderRadius="$2"
                    backgroundColor="#F8F8FF"
                >
                    {options.map((option) => (
                        <CustomOption
                            key={option.geometry.coordinates.join(',')}
                            onPress={() => handleSelect(option)}
                            option={option}
                            selected={selectedCoordinates?.location === `${option.properties.name}${option.properties.city ? `, ${option.properties.city}` : ''}${option.properties.country ? `, ${option.properties.country}` : ''}`}
                        />
                    ))}
                </ScrollView>
            )}

            {options.length === 0 && !loading && query.trim() !== "" && (
                <Text fontSize={14} color="$gray500">No results found</Text>
            )}
        </YStack>
    );
};

const CustomOption = ({ option, onPress, selected }: { option: PhotonFeature; onPress: () => void; selected: boolean }) => {
    return (
        <XStack
            alignItems="center"
            justifyContent="space-between"
            padding="$3"
            backgroundColor={selected ? '$gray100' : '$white'}
            onPress={onPress}
        >
            <Text>{`${option.properties.name}${option.properties.city ? `, ${option.properties.city}` : ''}${option.properties.country ? `, ${option.properties.country}` : ''}`}</Text>
            {/* {selected && <Check color="$primary" />} */}
        </XStack>
    );
};

export default CustomLocationSelector;
