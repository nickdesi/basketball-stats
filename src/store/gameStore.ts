import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Player = {
    id: string;
    name: string;
    number: string;
    position: string;
    level: 'U11' | 'U13' | 'U15' | 'U18';
};

export type GameStats = {
    points1: number;
    missedPoints1: number;
    points2: number;
    missedPoints2: number;
    points3: number;
    missedPoints3: number;
    rebounds: number; // Kept for legacy/total, but we will mostly use off/def
    offensiveRebounds: number;
    defensiveRebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    turnovers: number;
    fouls: number;
    missedFreeThrows: number; // Redundant if we have missedPoints1 but explicit is nice. Actually missedPoints1 covers it. I will stick to missedPoints1.
};

// Action log entry for undo functionality
export type StatAction = {
    type: 'increment' | 'decrement';
    stat: keyof GameStats;
    timestamp: number;
};

export type CompletedGame = {
    id: string;
    date: string;
    playerId: string;
    opponent?: string;
    stats: GameStats;
};

export type GameState = {
    // Players
    players: Player[];

    // Current Game Setup
    activePlayerId: string | null;
    activeOpponent: string;

    // Current Game State
    isGameActive: boolean;
    currentStats: GameStats;

    // Undo Stack (last 50 actions)
    actionStack: StatAction[];

    // History
    history: CompletedGame[];

    // Actions
    addPlayer: (name: string, number: string, position: string, level: 'U11' | 'U13' | 'U15' | 'U18') => void;
    updatePlayer: (id: string, updates: Partial<Player>) => void;
    deletePlayer: (id: string) => void;

    setupGame: (playerId: string, opponent: string) => void;
    startGame: () => void;
    incrementStat: (stat: keyof GameStats) => void;
    decrementStat: (stat: keyof GameStats) => void;
    undoLastAction: () => void;
    canUndo: () => boolean;
    resetGame: () => void;
    finishGame: () => void;
    deleteGame: (id: string) => void;
    updateGame: (gameId: string, updatedStats: GameStats, date?: string) => void;
    importGame: (game: CompletedGame) => void;

    // Sync actions for Firebase
    setPlayers: (players: Player[]) => void;
    setHistory: (games: CompletedGame[]) => void;
};

const initialStats: GameStats = {
    points1: 0,
    missedPoints1: 0,
    points2: 0,
    missedPoints2: 0,
    points3: 0,
    missedPoints3: 0,
    rebounds: 0,
    offensiveRebounds: 0,
    defensiveRebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    fouls: 0,
    missedFreeThrows: 0,
};

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            players: [],
            activePlayerId: null,
            activeOpponent: '',
            isGameActive: false,
            currentStats: { ...initialStats },
            actionStack: [],
            history: [],

            addPlayer: (name, number, position, level) => set((state) => ({
                players: [...state.players, { id: crypto.randomUUID(), name, number, position, level }]
            })),

            updatePlayer: (id: string, updates: Partial<Player>) => set((state) => ({
                players: state.players.map(p => p.id === id ? { ...p, ...updates } : p)
            })),

            deletePlayer: (id) => set((state) => ({
                players: state.players.filter(p => p.id !== id)
            })),

            setupGame: (playerId, opponent) => set({
                activePlayerId: playerId,
                activeOpponent: opponent,
                isGameActive: false
            }),

            startGame: () => set({
                isGameActive: true,
                currentStats: { ...initialStats },
                actionStack: []
            }),

            incrementStat: (stat) => set((state) => ({
                currentStats: {
                    ...state.currentStats,
                    [stat]: state.currentStats[stat] + 1
                },
                actionStack: [
                    ...state.actionStack.slice(-49),
                    { type: 'increment', stat, timestamp: Date.now() }
                ]
            })),

            decrementStat: (stat) => set((state) => ({
                currentStats: {
                    ...state.currentStats,
                    [stat]: Math.max(0, state.currentStats[stat] - 1)
                },
                actionStack: [
                    ...state.actionStack.slice(-49),
                    { type: 'decrement', stat, timestamp: Date.now() }
                ]
            })),

            undoLastAction: () => set((state) => {
                if (state.actionStack.length === 0) return state;
                const lastAction = state.actionStack[state.actionStack.length - 1];
                const newStack = state.actionStack.slice(0, -1);

                // Reverse the action
                const delta = lastAction.type === 'increment' ? -1 : 1;
                const newValue = Math.max(0, state.currentStats[lastAction.stat] + delta);

                return {
                    currentStats: {
                        ...state.currentStats,
                        [lastAction.stat]: newValue
                    },
                    actionStack: newStack
                };
            }),

            canUndo: () => get().actionStack.length > 0,



            resetGame: () => set({
                isGameActive: false,
                currentStats: { ...initialStats },
                actionStack: []
            }),

            finishGame: () => set((state) => {
                if (!state.activePlayerId) return state;

                const newGame: CompletedGame = {
                    id: crypto.randomUUID(),
                    date: new Date().toISOString(),
                    playerId: state.activePlayerId,
                    opponent: state.activeOpponent,
                    stats: { ...state.currentStats },
                };
                return {
                    history: [newGame, ...state.history],
                    isGameActive: false,
                    activePlayerId: null,
                    activeOpponent: '',
                    currentStats: { ...initialStats },
                    actionStack: [],
                };
            }),

            deleteGame: (id) => set((state) => ({
                history: state.history.filter(g => g.id !== id)
            })),

            updateGame: (gameId, updatedStats, date) => set((state) => ({
                history: state.history.map(g =>
                    g.id === gameId
                        ? { ...g, stats: { ...updatedStats }, ...(date ? { date } : {}) }
                        : g
                )
            })),

            importGame: (game) => set((state) => ({
                history: [{ ...game, id: crypto.randomUUID() }, ...state.history]
            })),

            // Sync actions for Firebase - replace local state with Firestore data
            setPlayers: (players) => set({ players }),
            setHistory: (games) => set({ history: games }),
        }),
        {
            name: 'hoop-stats-storage',
        }
    )
);
