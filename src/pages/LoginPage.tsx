import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

// Google icon SVG
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

type LoginPageProps = {
    onLoginSuccess: () => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { login, signUp, signInWithGoogle, loading, error, clearError, user } = useAuthStore();

    // Redirect on successful login
    useEffect(() => {
        if (user) {
            onLoginSuccess();
        }
    }, [user, onLoginSuccess]);

    // Clear error when switching modes
    useEffect(() => {
        clearError();
    }, [mode, clearError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        const success = mode === 'login'
            ? await login(email, password)
            : await signUp(email, password);

        if (success) {
            onLoginSuccess();
        }
    };

    const handleGoogleSignIn = async () => {
        const success = await signInWithGoogle();
        if (success) {
            onLoginSuccess();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)]">
            <div className="glass-panel rounded-2xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <img
                        src="/pwa-192x192.png"
                        alt="HoopStats Logo"
                        className="w-20 h-20 mx-auto mb-4 rounded-2xl"
                    />
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">HoopStats</h1>
                    <p className="text-[var(--color-text-dim)] mt-2">
                        {mode === 'login' ? 'Connexion à votre compte' : 'Créer un compte'}
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-red-400 text-sm font-medium">{error}</p>
                            <button
                                onClick={clearError}
                                className="text-red-400/70 text-xs mt-1 hover:text-red-300 transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                )}

                {/* Google Sign-In Button */}
                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-3 mb-4 rounded-xl bg-white text-gray-800 font-medium flex items-center justify-center gap-3 transition-all hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
                >
                    <GoogleIcon />
                    Continuer avec Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 h-px bg-[var(--color-glass-border)]"></div>
                    <span className="text-[var(--color-text-dim)] text-sm">ou</span>
                    <div className="flex-1 h-px bg-[var(--color-glass-border)]"></div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-[var(--color-text-dim)] mb-2"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-glass-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-dim)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-neon-blue)]/50 focus:border-[var(--color-neon-blue)] transition-all disabled:opacity-50"
                            autoComplete="email"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-[var(--color-text-dim)] mb-2"
                        >
                            Mot de passe
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                disabled={loading}
                                className="w-full px-4 py-3 pr-12 rounded-xl bg-[var(--color-bg)] border border-[var(--color-glass-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-dim)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-neon-blue)]/50 focus:border-[var(--color-neon-blue)] transition-all disabled:opacity-50"
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors disabled:opacity-50"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {mode === 'signup' && (
                            <p className="text-xs text-[var(--color-text-dim)] mt-1">Minimum 6 caractères</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !email || !password}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white font-bold text-lg flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {mode === 'login' ? 'Connexion...' : 'Inscription...'}
                            </>
                        ) : (
                            <>
                                {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                                {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                            </>
                        )}
                    </button>
                </form>

                {/* Mode Toggle */}
                <p className="text-center text-[var(--color-text-dim)] text-sm mt-6">
                    {mode === 'login' ? (
                        <>
                            Pas encore de compte ?{' '}
                            <button
                                onClick={() => setMode('signup')}
                                className="text-[var(--color-neon-blue)] font-medium hover:underline"
                            >
                                S'inscrire
                            </button>
                        </>
                    ) : (
                        <>
                            Déjà un compte ?{' '}
                            <button
                                onClick={() => setMode('login')}
                                className="text-[var(--color-neon-blue)] font-medium hover:underline"
                            >
                                Se connecter
                            </button>
                        </>
                    )}
                </p>

                {/* Footer */}
                <p className="text-center text-[var(--color-text-dim)]/40 text-xs mt-6">
                    Suivi des statistiques basketball
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
