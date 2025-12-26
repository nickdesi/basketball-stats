import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'system' | 'high-contrast';

interface ThemeState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    cycleTheme: () => void;
}

const themeOrder: Theme[] = ['dark', 'light', 'system', 'high-contrast'];

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'dark', // Default to dark
            setTheme: (theme) => set({ theme }),
            cycleTheme: () => {
                const currentIndex = themeOrder.indexOf(get().theme);
                const nextIndex = (currentIndex + 1) % themeOrder.length;
                set({ theme: themeOrder[nextIndex] });
            },
        }),
        {
            name: 'hoop-stats-theme',
        }
    )
);
