import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Player = {
    id: string;
    name: string;
    number: string;
    position: string;
};

export type GameStats = {
    points1: number;
    points2: number;
    points3: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    turnovers: number;
    fouls: number;
};

export type CompletedGame = {
    id: string;
    date: string;
    playerId: string;
    opponent?: string;
    stats: GameStats;
    quarter: number;
};

export type GameState = {
    // Players
    players: Player[];

    // Current Game Setup
    activePlayerId: string | null;
    activeOpponent: string;

    // Current Game State
    isGameActive: boolean;
    quarter: number;
    currentStats: GameStats;

    // History
    history: CompletedGame[];

    // Actions
    addPlayer: (name: string, number: string, position: string) => void;
    deletePlayer: (id: string) => void;

    setupGame: (playerId: string, opponent: string) => void;
    startGame: () => void;
    incrementStat: (stat: keyof GameStats) => void;
    decrementStat: (stat: keyof GameStats) => void;
    nextQuarter: () => void;
    resetGame: () => void;
    finishGame: () => void;
    deleteGame: (id: string) => void;
    updateGame: (gameId: string, updatedStats: GameStats) => void;
};

const initialStats: GameStats = {
    points1: 0,
    points2: 0,
    points3: 0,
    rebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    fouls: 0,
};

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            players: [],
            activePlayerId: null,
            activeOpponent: '',
            isGameActive: false,
            quarter: 1,
            currentStats: { ...initialStats },
            history: [],

            addPlayer: (name, number, position) => set((state) => ({
                players: [...state.players, { id: crypto.randomUUID(), name, number, position }]
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
                quarter: 1,
                currentStats: { ...initialStats }
            }),

            incrementStat: (stat) => set((state) => ({
                currentStats: {
                    ...state.currentStats,
                    [stat]: state.currentStats[stat] + 1
                }
            })),

            decrementStat: (stat) => set((state) => ({
                currentStats: {
                    ...state.currentStats,
                    [stat]: Math.max(0, state.currentStats[stat] - 1)
                }
            })),

            nextQuarter: () => set((state) => ({
                quarter: state.quarter < 4 ? state.quarter + 1 : state.quarter
            })),

            resetGame: () => set({
                isGameActive: false,
                quarter: 1,
                currentStats: { ...initialStats }
            }),

            finishGame: () => set((state) => {
                if (!state.activePlayerId) return state;

                const newGame: CompletedGame = {
                    id: crypto.randomUUID(),
                    date: new Date().toISOString(),
                    playerId: state.activePlayerId,
                    opponent: state.activeOpponent,
                    stats: { ...state.currentStats },
                    quarter: state.quarter,
                };
                return {
                    history: [newGame, ...state.history],
                    isGameActive: false,
                    activePlayerId: null,
                    activeOpponent: '',
                    currentStats: { ...initialStats },
                    quarter: 1
                };
            }),

            deleteGame: (id) => set((state) => ({
                history: state.history.filter(g => g.id !== id)
            })),

            updateGame: (gameId, updatedStats) => set((state) => ({
                history: state.history.map(g =>
                    g.id === gameId
                        ? { ...g, stats: { ...updatedStats } }
                        : g
                )
            })),
        }),
        {
            name: 'hoop-stats-storage',
        }
    )
);
