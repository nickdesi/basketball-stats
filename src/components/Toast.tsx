import { memo } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const Toast = memo(() => {
    const { toasts, dismissToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[200] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    className={`
                        pointer-events-auto glass-card rounded-xl p-4 shadow-2xl border border-white/10
                        flex items-center justify-between gap-3
                        animate-in slide-in-from-bottom-4 fade-in duration-300
                    `}
                    style={{
                        animationDelay: `${index * 50}ms`,
                    }}
                >
                    {/* Message */}
                    <span className="text-sm font-medium text-[var(--color-text)] flex-1">
                        {toast.message}
                    </span>

                    {/* Action Button */}
                    {toast.action && (
                        <button
                            onClick={() => {
                                toast.action?.onClick();
                                dismissToast(toast.id);
                            }}
                            className="px-3 py-1.5 bg-[var(--color-neon-blue)] text-black font-bold text-xs rounded-lg hover:brightness-110 active:scale-95 transition-all"
                        >
                            {toast.action.label}
                        </button>
                    )}

                    {/* Dismiss */}
                    <button
                        onClick={() => dismissToast(toast.id)}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-[var(--color-text-dim)]"
                    >
                        <X size={16} />
                    </button>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 rounded-b-xl overflow-hidden">
                        <div
                            className="h-full bg-[var(--color-neon-blue)] animate-shrink-x"
                            style={{
                                animationDuration: `${toast.duration}ms`,
                                animationTimingFunction: 'linear',
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
});

Toast.displayName = 'Toast';

export default Toast;
