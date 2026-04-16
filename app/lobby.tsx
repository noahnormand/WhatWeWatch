import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { addPlayer, createRoom, listenToRoom, setPlayerReady, startRoom } from "../service/rooms";

const Lobby = () => {
    const router = useRouter();
    const { pseudo, action, code: joinCode } = useLocalSearchParams();
    const [code, setCode] = useState<string>(joinCode as string || "");
    const [players, setPlayers] = useState<any>({});
    const [isReady, setIsReady] = useState(false);
    const [isHost, setIsHost] = useState(action === "create");
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const setup = async () => {
            if (action === "create") {
                const newCode = await createRoom(pseudo as string);
                setCode(newCode);
            } else {
                await addPlayer(joinCode as string, pseudo as string);
            }
        };
        setup();
    }, []);

    useEffect(() => {
        if (!code) return;
        const unsubscribe = listenToRoom(code, (room) => {
            setPlayers(room.players || {});
            setStarted(room.started || false);
        });
        return () => unsubscribe();
    }, [code]);

    useEffect(() => {
        if (started) {
            router.push(`/swipe?code=${code}&pseudo=${pseudo}`);
        }
    }, [started]);

    const handleReady = async () => {
        await setPlayerReady(code, pseudo as string);
        setIsReady(true);
    };

    const allReady = Object.keys(players).length > 0 &&
        Object.values(players).every((p: any) => p.ready);

    const handleStart = async () => {
        await startRoom(code);
    };

    return (
        <View style={{
            flex: 1, backgroundColor: "#1a1a2e",
            justifyContent: "center", alignItems: "center", padding: 30,
        }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: "#a0a0b0", marginBottom: 10 }}>
                Code de la Room
            </Text>
            <Text style={{ fontSize: 64, fontWeight: "bold", color: "#e94560", letterSpacing: 10, marginBottom: 30 }}>
                {code || "..."}
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white", marginBottom: 15 }}>
                Joueurs
            </Text>

            {Object.keys(players).map((name) => (
                <View key={name} style={{
                    flexDirection: "row", alignItems: "center",
                    marginBottom: 8, width: 250, justifyContent: "space-between",
                    backgroundColor: "#16213e", padding: 12, borderRadius: 10,
                }}>
                    <Text style={{ color: "white", fontSize: 16 }}>{name}</Text>
                    <Text style={{ fontSize: 16 }}>
                        {players[name].ready ? "✅" : "⏳"}
                    </Text>
                </View>
            ))}

            <View style={{ marginTop: 30 }}>
                {!isReady ? (
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#2ecc71", paddingVertical: 16,
                            borderRadius: 12, width: 260, alignItems: "center",
                        }}
                        onPress={handleReady}
                    >
                        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Je suis prêt !</Text>
                    </TouchableOpacity>
                ) : isHost ? (
                    <TouchableOpacity
                        style={{
                            backgroundColor: allReady ? "#e94560" : "#555",
                            paddingVertical: 16, borderRadius: 12,
                            width: 260, alignItems: "center",
                        }}
                        onPress={allReady ? handleStart : undefined}
                        disabled={!allReady}
                    >
                        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                            {allReady ? "Lancer la partie !" : "En attente des joueurs..."}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={{ color: "#a0a0b0", fontSize: 16, textAlign: "center" }}>
                        En attente que l'hôte lance la partie...
                    </Text>
                )}
            </View>
        </View>
    );
};

export default Lobby;