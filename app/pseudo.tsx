import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const Pseudo = () => {
    const router = useRouter();
    const { action } = useLocalSearchParams();
    const [pseudo, setPseudo] = useState("");

    const handleContinue = () => {
        if (pseudo.trim().length === 0) return;
        if (action === "create") {
            router.push(`/lobby?pseudo=${pseudo}&action=create`);
        } else {
            router.push(`/join?pseudo=${pseudo}`);
        }
    };

    return (
        <View style={{
            flex: 1, backgroundColor: "#1a1a2e",
            justifyContent: "center", alignItems: "center", padding: 30,
        }}>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#e94560", marginBottom: 30 }}>
                Choisis ton pseudo
            </Text>
            <TextInput
                style={{
                    backgroundColor: "#16213e", color: "white",
                    fontSize: 22, textAlign: "center",
                    width: 260, padding: 15, borderRadius: 12,
                    borderWidth: 2, borderColor: "#e94560", marginBottom: 20,
                }}
                value={pseudo}
                onChangeText={setPseudo}
                placeholder="Ton pseudo"
                placeholderTextColor="#444"
                maxLength={15}
            />
            <TouchableOpacity
                style={{
                    backgroundColor: "#e94560", paddingVertical: 16,
                    borderRadius: 12, width: 260, alignItems: "center",
                }}
                onPress={handleContinue}
            >
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Continuer</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Pseudo;