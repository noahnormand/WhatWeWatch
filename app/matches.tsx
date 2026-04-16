import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { joinRoom } from "../service/rooms";



interface Movie {
    id: number;
    title: string;
    poster_path: string;
}

const Matches = () => {
    const { code } = useLocalSearchParams();
    const [matches, setMatches] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadMatches = async () => {
            const room = await joinRoom(code as string) as any;
            if (room) {
                const users = room.users || {};
                const userIds = Object.keys(users);

                // pour chaque film, vérifier si TOUS les users l'ont liké
                const matchedMovies = room.movies.filter((movie: Movie) => {
                    if (userIds.length === 0) return false;
                    return userIds.every((userId: string) => users[userId][movie.id.toString()] === true);
                });

                setMatches(matchedMovies);
            }
            setLoading(false);
        };
        loadMatches();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: "#1a1a2e", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#a0a0b0", fontSize: 18 }}>Recherche des matchs...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#1a1a2e", paddingTop: 60 }}>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#e94560", textAlign: "center", marginBottom: 5 }}>
                🎬 Matchs
            </Text>
            <Text style={{ fontSize: 14, color: "#a0a0b0", textAlign: "center", marginBottom: 20 }}>
                Room : {code}
            </Text>

            {matches.length === 0 ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 48, marginBottom: 15 }}>😢</Text>
                    <Text style={{ color: "#a0a0b0", fontSize: 18, textAlign: "center" }}>
                        Aucun match pour l'instant...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={matches}
                    numColumns={2}
                    contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 30 }}
                    columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 15 }}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={{
                            width: "48%",
                            backgroundColor: "#16213e",
                            borderRadius: 12,
                            overflow: "hidden",
                        }}>
                            <Image
                                source={{ uri: "https://image.tmdb.org/t/p/w500" + item.poster_path }}
                                style={{ width: "100%", height: 250 }}
                            />
                            <Text style={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: "bold",
                                padding: 10,
                                textAlign: "center",
                            }}>
                                {item.title}
                            </Text>
                        </View>
                    )}
                />
            )}
            <TouchableOpacity
                style={{
                    backgroundColor: "#e94560",
                    paddingVertical: 16,
                    borderRadius: 12,
                    marginHorizontal: 30,
                    marginBottom: 30,
                    marginTop: 15,
                    alignItems: "center",
                }}
                onPress={() => router.push("/")}
            >
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Retour à l'accueil</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Matches;