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

// Collection names in Firestore
const PLAYERS_COLLECTION = 'players';
const GAMES_COLLECTION = 'games';

/**
 * Hook to synchronize Zustand store with Firebase Firestore.
 * - Listens to Firestore collections and updates local state
 * - Provides functions to write changes to Firestore
 */
export function useFirebaseSync() {
    const { user } = useAuthStore();
    const { setPlayers, setHistory } = useGameStore();
    const isListeningRef = useRef(false);

    // Subscribe to Players collection
    useEffect(() => {
        if (!user || isListeningRef.current) return;
        isListeningRef.current = true;

        const playersQuery = query(
            collection(db, PLAYERS_COLLECTION),
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

        // Subscribe to Games collection
        const gamesQuery = query(
            collection(db, GAMES_COLLECTION),
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
    }, [user, setPlayers, setHistory]);

    // Write functions for Firestore operations

    const addPlayerToFirestore = useCallback(async (player: Omit<Player, 'id'>): Promise<string> => {
        const id = crypto.randomUUID();
        await setDoc(doc(db, PLAYERS_COLLECTION, id), {
            ...player,
        });
        return id;
    }, []);

    const updatePlayerInFirestore = useCallback(async (id: string, updates: Partial<Player>) => {
        const playerRef = doc(db, PLAYERS_COLLECTION, id);
        await setDoc(playerRef, updates, { merge: true });
    }, []);

    const deletePlayerFromFirestore = useCallback(async (id: string) => {
        await deleteDoc(doc(db, PLAYERS_COLLECTION, id));
    }, []);

    const saveGameToFirestore = useCallback(async (game: CompletedGame) => {
        await setDoc(doc(db, GAMES_COLLECTION, game.id), {
            date: game.date,
            playerId: game.playerId,
            opponent: game.opponent || '',
            stats: game.stats,
        });
    }, []);

    const updateGameInFirestore = useCallback(async (gameId: string, updatedStats: GameStats, date?: string) => {
        const gameRef = doc(db, GAMES_COLLECTION, gameId);
        const updates: Partial<CompletedGame> = { stats: updatedStats };
        if (date) updates.date = date;
        await setDoc(gameRef, updates, { merge: true });
    }, []);

    const deleteGameFromFirestore = useCallback(async (id: string) => {
        await deleteDoc(doc(db, GAMES_COLLECTION, id));
    }, []);

    // Batch migration for uploading local data to Firestore
    const migrateLocalDataToFirestore = useCallback(async (players: Player[], games: CompletedGame[]) => {
        const batch = writeBatch(db);

        // Add all players
        for (const player of players) {
            const playerRef = doc(db, PLAYERS_COLLECTION, player.id);
            batch.set(playerRef, {
                name: player.name,
                number: player.number,
                position: player.position,
                level: player.level,
            });
        }

        // Add all games
        for (const game of games) {
            const gameRef = doc(db, GAMES_COLLECTION, game.id);
            batch.set(gameRef, {
                date: game.date,
                playerId: game.playerId,
                opponent: game.opponent || '',
                stats: game.stats,
            });
        }

        await batch.commit();
    }, []);

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
