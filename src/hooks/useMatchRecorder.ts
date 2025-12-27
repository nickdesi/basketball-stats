import { useState, useCallback, useMemo, useEffect } from 'react';
import { useGameStore, type GameStats, type Player, type CompletedGame } from '../store/gameStore';
import { useFirebaseSync } from './useFirebaseSync';

export interface FloatingAnimation {
    id: string;
    text: string;
    x: number;
    y: number;
    color: string;
    rot: number;
}

export interface MatchRecorderState {
    viewMode: 'input' | 'stats';
    animations: FloatingAnimation[];
    selectedPlayer: string;
    opponentName: string;
    showFoulConfirm: boolean;
    showEndMatchConfirm: boolean;
    showResetConfirm: boolean;
}

export interface MatchRecorderActions {
    setViewMode: (mode: 'input' | 'stats') => void;
    setSelectedPlayer: (id: string) => void;
    setOpponentName: (name: string) => void;
    handleScore: (type: 'make' | 'miss', points: 1 | 2 | 3, e: React.MouseEvent | React.TouchEvent) => void;
    handleStat: (stat: keyof GameStats, label: string, color: string, e: React.MouseEvent | React.TouchEvent) => void;
    confirmFoulOut: () => void;
    handleConfirmFinish: () => void;
    handleReset: () => void;
    setShowFoulConfirm: (show: boolean) => void;
    setShowEndMatchConfirm: (show: boolean) => void;
    setShowResetConfirm: (show: boolean) => void;
    startMatch: () => void;
}

export interface UseMatchRecorderReturn {
    // Store state
    currentStats: GameStats;
    isGameActive: boolean;
    players: Player[];
    activePlayerId: string | null;
    activePlayer: Player | undefined;
    canUndo: () => boolean;
    undoLastAction: () => void;
    decrementStat: (stat: keyof GameStats) => void;

    // Timer state
    isTimerRunning: boolean;
    gameDuration: number;
    toggleTimer: () => void;

    // Local state
    state: MatchRecorderState;

    // Computed
    totalPoints: number;
    isFouledOut: boolean;

    // Actions
    actions: MatchRecorderActions;
}

export function useMatchRecorder(onNavigate?: (view: 'dashboard' | 'match' | 'players') => void): UseMatchRecorderReturn {
    const {
        currentStats,
        isGameActive,
        players,
        activePlayerId,
        activeOpponent,
        isTimerRunning,
        gameDuration,
        setupGame,
        startGame,
        incrementStat,
        decrementStat,
        undoLastAction,
        canUndo,
        resetGame,
        toggleTimer,
        tickTimer
    } = useGameStore();

    const { saveGameToFirestore } = useFirebaseSync();

    // Local state
    const [viewMode, setViewMode] = useState<'input' | 'stats'>('input');
    const [animations, setAnimations] = useState<FloatingAnimation[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<string>(activePlayerId || '');
    const [opponentName, setOpponentName] = useState('');
    const [showFoulConfirm, setShowFoulConfirm] = useState(false);
    const [showEndMatchConfirm, setShowEndMatchConfirm] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    // Timer Effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isTimerRunning && isGameActive) {
            interval = setInterval(() => {
                tickTimer();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, isGameActive, tickTimer]);

    // Computed
    const activePlayer = players.find(p => p.id === activePlayerId);
    const isFouledOut = currentStats.fouls >= 5;
    const totalPoints = currentStats.points1 + (currentStats.points2 * 2) + (currentStats.points3 * 3);

    // Animation trigger
    const triggerAnimation = useCallback((e: React.MouseEvent | React.TouchEvent, text: string, color: string) => {
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const id = Date.now().toString() + Math.random();
        const rot = (Math.random() - 0.5) * 30;
        setAnimations(prev => [...prev, { id, text, x: clientX, y: clientY, color, rot }]);

        if (navigator.vibrate) navigator.vibrate(50);

        setTimeout(() => {
            setAnimations(prev => prev.filter(a => a.id !== id));
        }, 800);
    }, []);

    // Handlers
    const handleScore = useCallback((type: 'make' | 'miss', points: 1 | 2 | 3, e: React.MouseEvent | React.TouchEvent) => {
        if (isFouledOut) return;

        if (type === 'make') {
            incrementStat(`points${points}` as keyof GameStats);
            triggerAnimation(e, `+ ${points}`, 'var(--color-neon-green)');
        } else {
            incrementStat(`missedPoints${points}` as keyof GameStats);
            triggerAnimation(e, 'MISS', 'var(--color-neon-red)');
        }
    }, [isFouledOut, incrementStat, triggerAnimation]);

    const handleStat = useCallback((stat: keyof GameStats, label: string, color: string, e: React.MouseEvent | React.TouchEvent) => {
        if (isFouledOut && stat !== 'fouls') return;

        if (stat === 'fouls' && currentStats.fouls === 4) {
            setShowFoulConfirm(true);
            return;
        }

        incrementStat(stat);
        triggerAnimation(e, label, color);
    }, [isFouledOut, currentStats.fouls, incrementStat, triggerAnimation]);

    // Finish game and save to Firebase
    const handleConfirmFinish = useCallback(async () => {
        if (!activePlayerId) return;

        // Create the game object
        const newGame: CompletedGame = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            playerId: activePlayerId,
            opponent: activeOpponent || opponentName || 'Opponent',
            stats: {
                ...currentStats,
                playTimeSeconds: gameDuration
            },
        };

        // Save to Firebase (Firestore will update local state via listener)
        try {
            await saveGameToFirestore(newGame);
        } catch (error) {
            console.error('Error saving game to Firebase:', error);
        }

        // Reset local game state
        resetGame();
        setShowEndMatchConfirm(false);

        if (onNavigate) {
            onNavigate('dashboard');
        }
    }, [activePlayerId, activeOpponent, opponentName, currentStats, gameDuration, saveGameToFirestore, resetGame, onNavigate]);

    const confirmFoulOut = useCallback(() => {
        incrementStat('fouls');
        setShowFoulConfirm(false);
        handleConfirmFinish();
    }, [incrementStat, handleConfirmFinish]);

    const handleReset = useCallback(() => {
        resetGame();
        setShowResetConfirm(false);
    }, [resetGame]);

    const startMatch = useCallback(() => {
        setupGame(selectedPlayer, opponentName || 'Opponent');
        startGame();
    }, [setupGame, startGame, selectedPlayer, opponentName]);

    // Memoized state object
    const state = useMemo<MatchRecorderState>(() => ({
        viewMode,
        animations,
        selectedPlayer,
        opponentName,
        showFoulConfirm,
        showEndMatchConfirm,
        showResetConfirm,
    }), [viewMode, animations, selectedPlayer, opponentName, showFoulConfirm, showEndMatchConfirm, showResetConfirm]);

    // Memoized actions object
    const actions = useMemo<MatchRecorderActions>(() => ({
        setViewMode,
        setSelectedPlayer,
        setOpponentName,
        handleScore,
        handleStat,
        confirmFoulOut,
        handleConfirmFinish,
        handleReset,
        setShowFoulConfirm,
        setShowEndMatchConfirm,
        setShowResetConfirm,
        startMatch,
    }), [handleScore, handleStat, confirmFoulOut, handleConfirmFinish, handleReset, startMatch]);

    return {
        // Store state
        currentStats,
        isGameActive,
        players,
        activePlayerId,
        activePlayer,
        isTimerRunning,
        gameDuration,
        canUndo,
        undoLastAction,
        decrementStat,
        toggleTimer,

        // Local state
        state,

        // Computed
        totalPoints,
        isFouledOut,

        // Actions
        actions,
    };
}
