import { addDoc, collection, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase";
import { getTrendingMovies } from "./tmdb";


export const createRoom = async (pseudo: string) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const movies = await getTrendingMovies();

    await addDoc(collection(db, "rooms"), {
        code: code,
        movies: movies,
        users: {},
        players: { [pseudo]: { ready: false, finished: false } },
        started: false,
        createdAt: new Date(),
    });

    return code;
};
export const addPlayer = async (code: string, pseudo: string) => {
    const q = query(collection(db, "rooms"), where("code", "==", code));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        const roomRef = snapshot.docs[0].ref;
        const roomData = snapshot.docs[0].data();
        const players = roomData.players || {};
        players[pseudo] = { ready: false, finished: false };
        await updateDoc(roomRef, { players: players });
    }
};

export const setPlayerReady = async (code: string, pseudo: string) => {
    const q = query(collection(db, "rooms"), where("code", "==", code));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        const roomRef = snapshot.docs[0].ref;
        const roomData = snapshot.docs[0].data();
        const players = roomData.players || {};
        players[pseudo].ready = true;
        await updateDoc(roomRef, { players: players });
    }
};

export const setPlayerFinished = async (code: string, pseudo: string) => {
    const q = query(collection(db, "rooms"), where("code", "==", code));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        const roomRef = snapshot.docs[0].ref;
        const roomData = snapshot.docs[0].data();
        const players = roomData.players || {};
        players[pseudo].finished = true;
        await updateDoc(roomRef, { players: players });
    }
};

export const startRoom = async (code: string) => {
    const q = query(collection(db, "rooms"), where("code", "==", code));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        await updateDoc(snapshot.docs[0].ref, { started: true });
    }
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
export const listenToRoom = (code: string, callback: (data: any) => void) => {
    const q = query(collection(db, "rooms"), where("code", "==", code));
    return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
            callback({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        }
    });
};