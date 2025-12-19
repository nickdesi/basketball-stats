import { useEffect, useCallback, useRef } from 'react';
import {
    collection,
    onSnapshot,
    doc,
    setDoc,
    deleteDoc,
    writeBatch,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import type { Player, CompletedGame, GameStats } from '../store/gameStore';

/**
 * Hook to synchronize Zustand store with Firebase Firestore.
 * Each user has their own isolated data stored under users/{userId}/
 */
export function useFirebaseSync() {
    const { user } = useAuthStore();
    const { setPlayers, setHistory } = useGameStore();
    const isListeningRef = useRef(false);
    const currentUserIdRef = useRef<string | null>(null);

    // Get user-specific collection paths
    const getPlayersPath = useCallback((userId: string) => `users/${userId}/players`, []);
    const getGamesPath = useCallback((userId: string) => `users/${userId}/games`, []);

    // Subscribe to user-specific collections
    useEffect(() => {
        // Reset if user changed
        if (user?.uid !== currentUserIdRef.current) {
            isListeningRef.current = false;
            currentUserIdRef.current = user?.uid || null;

            // Clear data when user logs out
            if (!user) {
                setPlayers([]);
                setHistory([]);
            }
        }

        if (!user || isListeningRef.current) return;
        isListeningRef.current = true;

        const userId = user.uid;

        // Subscribe to user's Players collection
        const playersQuery = query(
            collection(db, getPlayersPath(userId)),
            orderBy('name')
        );

        const unsubscribePlayers = onSnapshot(
            playersQuery,
            (snapshot) => {
                const players: Player[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Player[];
                setPlayers(players);
            },
            (error) => {
                console.error('Error listening to players:', error);
            }
        );

        // Subscribe to user's Games collection
        const gamesQuery = query(
            collection(db, getGamesPath(userId)),
            orderBy('date', 'desc')
        );

        const unsubscribeGames = onSnapshot(
            gamesQuery,
            (snapshot) => {
                const games: CompletedGame[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as CompletedGame[];
                setHistory(games);
            },
            (error) => {
                console.error('Error listening to games:', error);
            }
        );

        return () => {
            unsubscribePlayers();
            unsubscribeGames();
            isListeningRef.current = false;
        };
    }, [user, setPlayers, setHistory, getPlayersPath, getGamesPath]);

    // Write functions for Firestore operations (user-specific)

    const addPlayerToFirestore = useCallback(async (player: Omit<Player, 'id'>): Promise<string> => {
        if (!user) throw new Error('User not authenticated');
        const id = crypto.randomUUID();
        await setDoc(doc(db, getPlayersPath(user.uid), id), {
            ...player,
        });
        return id;
    }, [user, getPlayersPath]);

    const updatePlayerInFirestore = useCallback(async (id: string, updates: Partial<Player>) => {
        if (!user) throw new Error('User not authenticated');
        const playerRef = doc(db, getPlayersPath(user.uid), id);
        await setDoc(playerRef, updates, { merge: true });
    }, [user, getPlayersPath]);

    const deletePlayerFromFirestore = useCallback(async (id: string) => {
        if (!user) throw new Error('User not authenticated');
        await deleteDoc(doc(db, getPlayersPath(user.uid), id));
    }, [user, getPlayersPath]);

    const saveGameToFirestore = useCallback(async (game: CompletedGame) => {
        if (!user) throw new Error('User not authenticated');
        await setDoc(doc(db, getGamesPath(user.uid), game.id), {
            date: game.date,
            playerId: game.playerId,
            opponent: game.opponent || '',
            stats: game.stats,
        });
    }, [user, getGamesPath]);

    const updateGameInFirestore = useCallback(async (gameId: string, updatedStats: GameStats, date?: string) => {
        if (!user) throw new Error('User not authenticated');
        const gameRef = doc(db, getGamesPath(user.uid), gameId);
        const updates: Partial<CompletedGame> = { stats: updatedStats };
        if (date) updates.date = date;
        await setDoc(gameRef, updates, { merge: true });
    }, [user, getGamesPath]);

    const deleteGameFromFirestore = useCallback(async (id: string) => {
        if (!user) throw new Error('User not authenticated');
        await deleteDoc(doc(db, getGamesPath(user.uid), id));
    }, [user, getGamesPath]);

    // Batch migration for uploading local data to user's Firestore
    const migrateLocalDataToFirestore = useCallback(async (players: Player[], games: CompletedGame[]) => {
        if (!user) throw new Error('User not authenticated');
        const batch = writeBatch(db);
        const userId = user.uid;

        // Add all players
        for (const player of players) {
            const playerRef = doc(db, getPlayersPath(userId), player.id);
            batch.set(playerRef, {
                name: player.name,
                number: player.number,
                position: player.position,
                level: player.level,
            });
        }

        // Add all games
        for (const game of games) {
            const gameRef = doc(db, getGamesPath(userId), game.id);
            batch.set(gameRef, {
                date: game.date,
                playerId: game.playerId,
                opponent: game.opponent || '',
                stats: game.stats,
            });
        }

        await batch.commit();
    }, [user, getPlayersPath, getGamesPath]);

    return {
        addPlayerToFirestore,
        updatePlayerInFirestore,
        deletePlayerFromFirestore,
        saveGameToFirestore,
        updateGameInFirestore,
        deleteGameFromFirestore,
        migrateLocalDataToFirestore,
    };
}
