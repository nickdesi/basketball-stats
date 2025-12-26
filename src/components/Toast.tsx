import { memo } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const Toast = memo(() => {
    const { toasts, dismissToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[200] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast, index) => {
                const isSuccess = toast.type === 'success';
                const isError = toast.type === 'error';

                return (
                    <div
                        key={toast.id}
                        className={`
                            pointer-events-auto glass-card rounded-xl p-4 shadow-2xl border border-[var(--color-glass-border)]
                            flex items-center justify-between gap-3
                            animate-in slide-in-from-bottom-4 fade-in duration-300
                            ${isSuccess ? 'bg-[var(--color-neon-green)]/10 ring-1 ring-[var(--color-neon-green)]/30' : ''}
                            ${isError ? 'bg-red-500/10 ring-1 ring-red-500/30' : ''}
                        `}
                        style={{
                            animationDelay: `${index * 50}ms`,
                        }}
                    >
                        {/* Icon */}
                        {isSuccess && <CheckCircle size={20} className="text-[var(--color-neon-green)] shrink-0" />}
                        {isError && <AlertCircle size={20} className="text-red-500 shrink-0" />}
                        {!isSuccess && !isError && <Info size={20} className="text-[var(--color-neon-blue)] shrink-0" />}

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
                                className={`
                                    px-3 py-1.5 font-bold text-xs rounded-lg hover:brightness-110 active:scale-95 transition-all
                                    ${isSuccess ? 'bg-[var(--color-neon-green)] text-black' :
                                        isError ? 'bg-red-500 text-white' :
                                            'bg-[var(--color-neon-blue)] text-black'}
                                `}
                            >
                                {toast.action.label}
                            </button>
                        )}

                        {/* Dismiss */}
                        <button
                            onClick={() => dismissToast(toast.id)}
                            className="p-1.5 hover:bg-[var(--color-bg-elevated)] rounded-full transition-colors text-[var(--color-text-dim)]"
                        >
                            <X size={16} />
                        </button>

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-glass-border)] rounded-b-xl overflow-hidden">
                            <div
                                className={`h-full animate-shrink-x ${isSuccess ? 'bg-[var(--color-neon-green)]' :
                                        isError ? 'bg-red-500' :
                                            'bg-[var(--color-neon-blue)]'
                                    }`}
                                style={{
                                    animationDuration: `${toast.duration}ms`,
                                    animationTimingFunction: 'linear',
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

Toast.displayName = 'Toast';

export default Toast;
