import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { joinRoom, voteMovie } from "../service/rooms";

interface Movie {
    id: number;
    title: string;
    poster_path: string;
}

const SWIPE_THRESHOLD = 150;

const Swipe = () => {
    const { code } = useLocalSearchParams();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [likedMovies, setLikedMovies] = useState<Movie[]>([]);
    const [userId] = useState(() => Math.random().toString(36).substring(2, 8));
    const translateX = useSharedValue(0);

    const handleSmash = () => {
        const movie = movies[0];
        setLikedMovies([...likedMovies, movie]);
        voteMovie(code as string, userId, movie.id, true);
        setMovies(movies.slice(1));
    };

    const handlePass = () => {
        const movie = movies[0];
        voteMovie(code as string, userId, movie.id, false);
        setMovies(movies.slice(1));
    };

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
        })
        .onEnd(() => {
            if (translateX.value > SWIPE_THRESHOLD) {
                runOnJS(handleSmash)();
            } else if (translateX.value < -SWIPE_THRESHOLD) {
                runOnJS(handlePass)();
            }
            translateX.value = withSpring(0);
        });

    const cardStyle = useAnimatedStyle(() => {
        const rotate = interpolate(translateX.value, [-300, 0, 300], [-15, 0, 15]);
        return {
            transform: [
                { translateX: translateX.value },
                { rotate: `${rotate}deg` },
            ],
        };
    });

    const smashOverlay = useAnimatedStyle(() => {
        const opacity = interpolate(translateX.value, [0, 100], [0, 1]);
        return { opacity: Math.min(Math.max(opacity, 0), 1) };
    });

    const passOverlay = useAnimatedStyle(() => {
        const opacity = interpolate(translateX.value, [0, -100], [0, 1]);
        return { opacity: Math.min(Math.max(opacity, 0), 1) };
    });

    useEffect(() => {
        const loadRoom = async () => {
            const room = await joinRoom(code as string);
            if (room) {
                setMovies(room.movies);
            }
        };
        loadRoom();
    }, []);

    if (movies.length === 0) {
        return (
            <View style={{ flex: 1, backgroundColor: "#1a1a2e", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#e94560", fontSize: 24, fontWeight: "bold" }}>
                    {likedMovies.length > 0 ? "C'est fini ! 🎬" : "Chargement..."}
                </Text>
                {likedMovies.length > 0 && (
                    <Text style={{ color: "#a0a0b0", fontSize: 16, marginTop: 10 }}>
                        {likedMovies.length} film(s) liké(s)
                    </Text>
                )}
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#1a1a2e", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#a0a0b0", fontSize: 14, marginBottom: 10 }}>
                Room : {code}
            </Text>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[cardStyle, {
                    borderRadius: 20,
                    overflow: "hidden",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                    elevation: 10,
                }]}>
                    <Image
                        source={{ uri: "https://image.tmdb.org/t/p/w500" + movies[0].poster_path }}
                        style={{ width: 300, height: 420, borderRadius: 20 }}
                    />
                    <Animated.View style={[smashOverlay, {
                        position: "absolute", top: 20, left: 20,
                        borderWidth: 3, borderColor: "#2ecc71", borderRadius: 8, padding: 8,
                    }]}>
                        <Text style={{ color: "#2ecc71", fontSize: 28, fontWeight: "bold" }}>SMASH</Text>
                    </Animated.View>
                    <Animated.View style={[passOverlay, {
                        position: "absolute", top: 20, right: 20,
                        borderWidth: 3, borderColor: "#e74c3c", borderRadius: 8, padding: 8,
                    }]}>
                        <Text style={{ color: "#e74c3c", fontSize: 28, fontWeight: "bold" }}>PASS</Text>
                    </Animated.View>
                </Animated.View>
            </GestureDetector>

            <Text style={{ fontSize: 22, fontWeight: "bold", color: "white", marginTop: 20 }}>
                {movies[0].title}
            </Text>

            <View style={{ flexDirection: "row", marginTop: 25, gap: 20 }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#e74c3c", width: 70, height: 70, borderRadius: 35,
                        justifyContent: "center", alignItems: "center",
                    }}
                    onPress={handlePass}
                >
                    <Text style={{ fontSize: 30 }}>👎</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#2ecc71", width: 70, height: 70, borderRadius: 35,
                        justifyContent: "center", alignItems: "center",
                    }}
                    onPress={handleSmash}
                >
                    <Text style={{ fontSize: 30 }}>👍</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Swipe;