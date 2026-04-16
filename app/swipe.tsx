import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { getTrendingMovies } from "../service/tmdb";



interface Movie {
    id: number;
    title: string;
    poster_path: string;
}

const Swipe = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [likedMovies, setLikedMovies] = useState<Movie[]>([]);
    const translateX = useSharedValue(0);
    const handleSmash = () => {
        setLikedMovies([...likedMovies, movies[0]]);
        setMovies(movies.slice(1));
    };

    const handlePass = () => {
        setMovies(movies.slice(1));
    };
    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            // pendant que le doigt bouge
            translateX.value = event.translationX;
        })
        .onEnd(() => {
            if (translateX.value > 150) {
                runOnJS(handleSmash)();
            } else if (translateX.value < -150) {
                runOnJS(handlePass)();
            }
            translateX.value = withSpring(0);
        });
    const cardStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    useEffect(() => {
        getTrendingMovies().then((results) => {
            setMovies(results);
        });
    }, []);

    if (movies.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Chargement...</Text>
            </View>
        );
    }

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={cardStyle}>
                <Image
                    source={{ uri: "https://image.tmdb.org/t/p/w500" + movies[0].poster_path }}
                    style={{ width: 300, height: 450 }}
                />
                <Text style={{ fontSize: 20, marginTop: 10 }}>{movies[0].title}</Text>
            </Animated.View>
        </GestureDetector>
    );
};

export default Swipe;