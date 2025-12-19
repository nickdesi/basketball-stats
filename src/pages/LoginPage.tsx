import React, { useState, useEffect } from 'react';
import { LogIn, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

type LoginPageProps = {
    onLoginSuccess: () => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { login, loading, error, clearError, user } = useAuthStore();

    // Redirect on successful login
    useEffect(() => {
        if (user) {
            onLoginSuccess();
        }
    }, [user, onLoginSuccess]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        const success = await login(email, password);
        if (success) {
            onLoginSuccess();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-panel rounded-2xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] flex items-center justify-center">
                        <LogIn className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">HoopStats</h1>
                    <p className="text-[var(--color-text-dim)] mt-2">Connexion Admin SCBA</p>
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

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
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
                            placeholder="admin@scba.fr"
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
                                autoComplete="current-password"
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
                                Connexion...
                            </>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                Se connecter
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-[var(--color-text-dim)]/60 text-xs mt-6">
                    Stade Clermontois Basket Auvergne
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
