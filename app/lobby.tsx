import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Lobby = () => {
    const router = useRouter();
    const { code } = useLocalSearchParams();

    return (
        <View style={{
            flex: 1,
            backgroundColor: "#1a1a2e",
            justifyContent: "center",
            alignItems: "center",
            padding: 30,
        }}>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#a0a0b0", marginBottom: 10 }}>
                Code de la Room
            </Text>
            <Text style={{ fontSize: 64, fontWeight: "bold", color: "#e94560", letterSpacing: 10, marginBottom: 40 }}>
                {code}
            </Text>
            <Text style={{ fontSize: 16, color: "#a0a0b0", marginBottom: 50, textAlign: "center" }}>
                Partage ce code à tes potes pour qu'ils rejoignent !
            </Text>

            <TouchableOpacity
                style={{
                    backgroundColor: "#e94560",
                    paddingVertical: 16,
                    paddingHorizontal: 40,
                    borderRadius: 12,
                    width: 260,
                    alignItems: "center",
                }}
                onPress={() => router.push(`/swipe?code=${code}`)}
            >
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Commencer à swiper</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Lobby;