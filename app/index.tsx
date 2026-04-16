import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Home = () => {
    const router = useRouter();

    return (
        <View style={{
            flex: 1,
            backgroundColor: "#1a1a2e",
            justifyContent: "center",
            alignItems: "center",
            padding: 30,
        }}>
            <Text style={{ fontSize: 42, fontWeight: "bold", color: "#e94560", marginBottom: 10 }}>
                🍿 WhatWeWatch
            </Text>
            <Text style={{ fontSize: 16, color: "#a0a0b0", marginBottom: 50, textAlign: "center" }}>
                Swipez ensemble, trouvez LE film.
            </Text>

            <TouchableOpacity
                style={{
                    backgroundColor: "#e94560",
                    paddingVertical: 16,
                    paddingHorizontal: 40,
                    borderRadius: 12,
                    width: 260,
                    alignItems: "center",
                    marginBottom: 15,
                }}
                onPress={() => router.push("/swipe")}
            >
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Créer une Room</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    backgroundColor: "transparent",
                    borderWidth: 2,
                    borderColor: "#e94560",
                    paddingVertical: 16,
                    paddingHorizontal: 40,
                    borderRadius: 12,
                    width: 260,
                    alignItems: "center",
                }}
                onPress={() => console.log("Join Room")}
            >
                <Text style={{ color: "#e94560", fontSize: 18, fontWeight: "bold" }}>Rejoindre une Room</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Home;