import { memo } from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    message?: string;
}

const LoadingSpinner = memo(({ size = 'md', color = 'var(--color-neon-blue)', message }: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full min-h-[50vh]">
            <div
                className={`animate-spin rounded-full border-t-2 border-b-2 ${sizeClasses[size]}`}
                style={{ borderColor: color }}
            />
            {message && (
                <p className="text-[var(--color-text-dim)] mt-4 text-sm">{message}</p>
            )}
        </div>
    );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
