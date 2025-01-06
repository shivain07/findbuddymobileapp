import React, { useState } from 'react';
import { View, Text, Input } from 'tamagui'; // or 'react-native' if you're using RN components
import { Entypo } from '@expo/vector-icons'; // Assuming you're using Expo or a compatible icon set
import { FieldError, Noop } from 'react-hook-form';

interface PasswordComponentProps {
    onBlur: Noop;
    onChange: (...event: any[]) => void;
    value: string;
    isError: boolean
}

function PasswordComponent({
    onBlur,
    onChange,
    value,
    isError
}: PasswordComponentProps) {
    const [showPass, setShowPass] = useState(false);

    return (
        <View position="relative">
            <Input
                size="$4"
                secureTextEntry={!showPass}
                placeholder="Enter password"
                borderColor={isError ? "$red8" : "#ccc"}
                borderWidth={1}
                borderRadius="$3"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
            />
            <View position="absolute" right="$2" top="25%" onPress={() => setShowPass(!showPass)}>
                <Text fontSize="$4">
                    {!showPass ? (
                        <Entypo name="eye-with-line" size={24} color="gray" />
                    ) : (
                        <Entypo name="eye" size={24} color="gray" />
                    )}
                </Text>
            </View>
        </View>
    );
}

export default PasswordComponent;
