import { addDoc, collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase";
import { getTrendingMovies } from "./tmdb";

export const createRoom = async () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const movies = await getTrendingMovies();

    await addDoc(collection(db, "rooms"), {
        code: code,
        movies: movies,
        users: {},
        createdAt: new Date(),
    });

    return code;
};

export const joinRoom = async (code: string) => {
    const q = query(collection(db, "rooms"), where("code", "==", code));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return null;
    }

    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

export const voteMovie = async (roomId: string, oderId: string, movieId: number, liked: boolean) => {
    try {
        console.log("voteMovie called:", roomId, oderId, movieId, liked);
        const q = query(collection(db, "rooms"), where("code", "==", roomId));
        const snapshot = await getDocs(q);
        console.log("snapshot empty?", snapshot.empty);

        if (!snapshot.empty) {
            const roomRef = snapshot.docs[0].ref;
            const roomData = snapshot.docs[0].data();
            const users = roomData.users || {};

            if (!users[oderId]) {
                users[oderId] = {};
            }
            users[oderId][movieId.toString()] = liked;

            await updateDoc(roomRef, { users: users });
            console.log("vote saved!");
        }
    } catch (error) {
        console.log("voteMovie error:", error);
    }
};