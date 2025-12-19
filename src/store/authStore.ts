import { create } from 'zustand';
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../config/firebase';

export type AuthState = {
    user: User | null;
    loading: boolean;
    error: string | null;
    initialized: boolean;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    initAuth: () => () => void; // Returns unsubscribe function
    clearError: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    loading: false,
    error: null,
    initialized: false,

    login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
            await signInWithEmailAndPassword(auth, email, password);
            set({ loading: false });
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
            // Translate common Firebase errors to French
            let friendlyError = errorMessage;
            if (errorMessage.includes('invalid-credential') || errorMessage.includes('wrong-password')) {
                friendlyError = 'Email ou mot de passe incorrect';
            } else if (errorMessage.includes('user-not-found')) {
                friendlyError = 'Aucun compte trouvé avec cet email';
            } else if (errorMessage.includes('too-many-requests')) {
                friendlyError = 'Trop de tentatives. Réessayez plus tard.';
            } else if (errorMessage.includes('network-request-failed')) {
                friendlyError = 'Erreur réseau. Vérifiez votre connexion.';
            }
            set({ loading: false, error: friendlyError });
            return false;
        }
    },

    logout: async () => {
        set({ loading: true, error: null });
        try {
            await signOut(auth);
            set({ loading: false, user: null });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur de déconnexion';
            set({ loading: false, error: errorMessage });
        }
    },

    initAuth: () => {
        set({ loading: true });
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            set({ user, loading: false, initialized: true });
        });
        return unsubscribe;
    },

    clearError: () => set({ error: null }),
}));
