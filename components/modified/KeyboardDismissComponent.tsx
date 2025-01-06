import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

const KeyboardDismissComponent: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    return <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
            {children}
    </TouchableWithoutFeedback>
}

export default KeyboardDismissComponent;