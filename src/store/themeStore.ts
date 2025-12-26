import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';
type ContrastMode = 'normal' | 'high';

interface ThemeState {
    theme: Theme;
    contrastMode: ContrastMode;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    toggleContrastMode: () => void;
    setContrastMode: (mode: ContrastMode) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'dark', // Default to dark
            contrastMode: 'normal', // Default to normal
            toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
            setTheme: (theme) => set({ theme }),
            toggleContrastMode: () => set((state) => ({ contrastMode: state.contrastMode === 'normal' ? 'high' : 'normal' })),
            setContrastMode: (contrastMode) => set({ contrastMode }),
        }),
        {
            name: 'hoop-stats-theme',
        }
    )
);
