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
    updateGame: (gameId: string, updatedStats: GameStats, date?: string, playerId?: string) => void;
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

            updateGame: (gameId, updatedStats, date, playerId) => set((state) => ({
                history: state.history.map(g =>
                    g.id === gameId
                        ? { ...g, stats: { ...updatedStats }, ...(date ? { date } : {}), ...(playerId ? { playerId } : {}) }
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

// Selector for Advanced Stats
export const getAdvancedStats = (stats: GameStats) => {
    // Basic Calculations
    const points = stats.points1 + (stats.points2 * 2) + (stats.points3 * 3);
    const fga = stats.points2 + stats.points3 + stats.missedPoints2 + stats.missedPoints3;
    const fta = stats.points1 + stats.missedPoints1;
    const fgm = stats.points2 + stats.points3;

    // 1. Evaluation (PIR) - Standard FIBA/Euroleague Formula
    // (Pts + Reb + Ast + Stl + Blk + FoulsDrawn) - (MissedFG + MissedFT + TO + FoulsCommited)
    // Note: FoulsDrawn is not currently tracked, so it's omitted (conceptually 0).
    const totalRebounds = stats.offensiveRebounds + stats.defensiveRebounds || stats.rebounds; // Fallback to legacy rebounds if specific ones are 0
    const missedFG = stats.missedPoints2 + stats.missedPoints3;
    const missedFT = stats.missedPoints1 || stats.missedFreeThrows; // Fallback

    const evaluation = (
        points +
        totalRebounds +
        stats.assists +
        stats.steals +
        stats.blocks
    ) - (
            missedFG +
            missedFT +
            stats.turnovers +
            stats.fouls
        );

    // 2. True Shooting % (TS%)
    // Pts / (2 * (FGA + 0.44 * FTA))
    const tsDenominator = 2 * (fga + (0.44 * fta));
    const trueShooting = tsDenominator > 0 ? (points / tsDenominator) * 100 : 0;

    // 3. Effective FG% (eFG%)
    // (FGM + 0.5 * 3PM) / FGA
    const effectiveFg = fga > 0 ? ((fgm + (0.5 * stats.points3)) / fga) * 100 : 0;

    return {
        evaluation: Math.round(evaluation),
        trueShooting: Math.round(trueShooting),
        effectiveFg: Math.round(effectiveFg),
        fieldGoalPercentage: fga > 0 ? Math.round((fgm / fga) * 100) : 0,
        freeThrowPercentage: fta > 0 ? Math.round((stats.points1 / fta) * 100) : 0
    };
};
