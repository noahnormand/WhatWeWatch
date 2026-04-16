import React, { useEffect, useState } from "react";
import { Button, Image, Text, View } from "react-native";
import { getTrendingMovies } from "../service/tmdb";

interface Movie {
    id: number;
    title: string;
    poster_path: string;
}

const Swipe = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [likedMovies, setLikedMovies] = useState<Movie[]>([]);

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
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Image
                source={{ uri: "https://image.tmdb.org/t/p/w500" + movies[0].poster_path }}
                style={{ width: 300, height: 450 }}
            />
            <Text style={{ fontSize: 20, marginTop: 10 }}>{movies[0].title}</Text>
            <View style={{ height: 10 }} />
            <Button
                title="Smash"
                onPress={() => {
                    setLikedMovies([...likedMovies, movies[0]]);
                    setMovies(movies.slice(1));
                }}
            />
            <View style={{ height: 10 }} />
            <Button
                title="Pass"
                onPress={() => setMovies(movies.slice(1))}
            />
        </View>
    );
};

export default Swipe;