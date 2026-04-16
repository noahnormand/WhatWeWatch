import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { joinRoom } from "../service/rooms";

const Join = () => {
    const router = useRouter();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const { pseudo } = useLocalSearchParams();

    const handleJoin = async () => {
        if (code.length != 4) {
            setError("Le code doit contenir 4 chiffres");
            return;
        }
        const room = await joinRoom(code);
        if (room) {
            router.push(`/lobby?code=${code}&pseudo=${pseudo}&action=join`);
        } else {
            setError("Room non trouvée");
        }
    };

    return (
        <View style={{
            flex: 1,
            backgroundColor: "#1a1a2e",
            justifyContent: "center",
            alignItems: "center",
            padding: 30,
        }}>
            <Text style={{ fontSize: 32, fontWeight: "bold", color: "#e94560", marginBottom: 10 }}>
                Rejoindre une Room
            </Text>
            <Text style={{ fontSize: 16, color: "#a0a0b0", marginBottom: 40 }}>
                Entre le code à 4 chiffres
            </Text>

            <TextInput
                style={{
                    backgroundColor: "#16213e",
                    color: "white",
                    fontSize: 32,
                    fontWeight: "bold",
                    textAlign: "center",
                    width: 220,
                    padding: 15,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: "#e94560",
                    letterSpacing: 10,
                    marginBottom: 15,
                }}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={4}
                placeholder="0000"
                placeholderTextColor="#444"
            />

            {error ? (
                <Text style={{ color: "#e74c3c", marginBottom: 15 }}>{error}</Text>
            ) : null}

            <TouchableOpacity
                style={{
                    backgroundColor: "#e94560",
                    paddingVertical: 16,
                    paddingHorizontal: 40,
                    borderRadius: 12,
                    width: 260,
                    alignItems: "center",
                    marginTop: 10,
                }}
                onPress={handleJoin}
            >
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Rejoindre</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Join;