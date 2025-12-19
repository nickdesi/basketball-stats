import { create } from 'zustand';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../config/firebase';

const googleProvider = new GoogleAuthProvider();

export type AuthState = {
    user: User | null;
    loading: boolean;
    error: string | null;
    initialized: boolean;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    signUp: (email: string, password: string) => Promise<boolean>;
    signInWithGoogle: () => Promise<boolean>;
    logout: () => Promise<void>;
    initAuth: () => () => void; // Returns unsubscribe function
    clearError: () => void;
};

// Helper to translate Firebase errors to French
const translateError = (errorMessage: string): string => {
    if (errorMessage.includes('invalid-credential') || errorMessage.includes('wrong-password')) {
        return 'Email ou mot de passe incorrect';
    } else if (errorMessage.includes('user-not-found')) {
        return 'Aucun compte trouvé avec cet email';
    } else if (errorMessage.includes('too-many-requests')) {
        return 'Trop de tentatives. Réessayez plus tard.';
    } else if (errorMessage.includes('network-request-failed')) {
        return 'Erreur réseau. Vérifiez votre connexion.';
    } else if (errorMessage.includes('email-already-in-use')) {
        return 'Cet email est déjà utilisé. Essayez de vous connecter.';
    } else if (errorMessage.includes('weak-password')) {
        return 'Mot de passe trop faible (min. 6 caractères)';
    } else if (errorMessage.includes('invalid-email')) {
        return 'Adresse email invalide';
    } else if (errorMessage.includes('popup-closed-by-user')) {
        return 'Connexion annulée';
    }
    return errorMessage;
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
            set({ loading: false, error: translateError(errorMessage) });
            return false;
        }
    },

    signUp: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            set({ loading: false });
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur d\'inscription';
            set({ loading: false, error: translateError(errorMessage) });
            return false;
        }
    },

    signInWithGoogle: async () => {
        set({ loading: true, error: null });
        try {
            await signInWithPopup(auth, googleProvider);
            set({ loading: false });
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion Google';
            set({ loading: false, error: translateError(errorMessage) });
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

