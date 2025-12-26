import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Toast {
    id: string;
    message: string;
    type: 'info' | 'success' | 'error';
    action?: {
        label: string;
        onClick: () => void;
    };
    duration: number;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (message: string, options?: {
        type?: 'info' | 'success' | 'error';
        action?: { label: string; onClick: () => void };
        duration?: number;
    }) => string;
    dismissToast: (id: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, options?: {
        type?: 'info' | 'success' | 'error';
        action?: { label: string; onClick: () => void };
        duration?: number;
    }) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const duration = options?.duration ?? 4000;
        const type = options?.type ?? 'info';


        const newToast: Toast = {
            id,
            message,
            type,
            action: options?.action,
            duration,
        };

        setToasts(prev => [...prev, newToast]);

        // Auto-dismiss
        setTimeout(() => {
            dismissToast(id);
        }, duration);

        return id;
    }, [dismissToast]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export default ToastProvider;
