import { useRouter } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

const WhatWeWatch = () => {
    const router = useRouter();
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>What We Watch</Text>
            <Button
                title="Join Room"
                onPress={() => console.log("Join Room")}
            />
            <Button
                title="Create Room"
                onPress={() => router.push("/swipe")}
            />
        </View>
    );
};
export default WhatWeWatch;