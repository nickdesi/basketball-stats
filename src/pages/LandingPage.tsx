import { memo, useState, useEffect } from 'react';
import { Play, Shield, Wifi, Zap, Trophy, ChevronRight, Activity, BarChart3, Lock } from 'lucide-react';

interface LandingPageProps {
    onStart: () => void;
}

const LandingPage = memo(({ onStart }: LandingPageProps) => {
    const [scrolled, setScrolled] = useState(false);

    // Parallax / Scroll effect logic
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#030303] text-white selection:bg-[var(--color-neon-blue)] selection:text-black overflow-x-hidden">

            {/* ════════ HEADER ════════ */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/5 py-4' : 'py-6 bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(0,243,255,0.3)]">
                            H
                        </div>
                        <span className="font-stats text-2xl tracking-tighter font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            HOOP.STATS
                        </span>
                    </div>
                    <button
                        onClick={onStart}
                        className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-all font-medium text-sm hidden md:block"
                    >
                        Connexion Coach
                    </button>
                </div>
            </nav>

            {/* ════════ HERO SECTION ════════ */}
            <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--color-neon-blue)] opacity-10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[var(--color-neon-purple)] opacity-5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-neon-green)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-neon-green)]"></span>
                        </span>
                        <span className="text-xs font-medium tracking-wide uppercase text-[var(--color-text-dim)]">V1.5 Live : Gamification Update</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        DON'T JUST WATCH.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] via-white to-[var(--color-neon-purple)] drop-shadow-[0_0_30px_rgba(0,243,255,0.3)]">
                            ANALYZE IT.
                        </span>
                    </h1>

                    <p className="text-lg md:text-2xl text-[var(--color-text-dim)] max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        L'outil de statistiques professionnel pour les coachs exigeants.
                        Calcul du PIR en temps réel, Shot Charts et Gamification pour propulser vos joueurs au niveau supérieur.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <button
                            onClick={onStart}
                            className="w-full md:w-auto px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
                        >
                            <Play size={20} fill="currentColor" />
                            Lancer le Match
                        </button>
                        <button className="w-full md:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm">
                            Voir la Démo
                        </button>
                    </div>
                </div>
            </header>

            {/* ════════ TICKER (ESPN STYLE) ════════ */}
            <div className="w-full border-y border-white/5 bg-black/50 backdrop-blur-sm py-3 overflow-hidden flex relative z-20">
                <div className="animate-ticker flex whitespace-nowrap gap-12 text-sm font-mono text-[var(--color-text-dim)] uppercase tracking-widest items-center">
                    <span className="flex items-center gap-2"><Activity size={14} className="text-[var(--color-neon-green)]" /> LIVE PIR TRACKING</span>
                    <span className="flex items-center gap-2"><Zap size={14} className="text-[var(--color-neon-orange)]" /> TRUE SHOOTING %</span>
                    <span className="flex items-center gap-2"><Wifi size={14} className="text-[var(--color-neon-blue)]" /> OFFLINE FIRST</span>
                    <span className="flex items-center gap-2"><Lock size={14} className="text-[var(--color-neon-purple)]" /> SECURE CLOUD SYNC</span>
                    <span className="flex items-center gap-2"><Trophy size={14} className="text-yellow-500" /> MVP BADGES SYSTEM</span>
                    <span className="flex items-center gap-2"><Activity size={14} className="text-[var(--color-neon-green)]" /> LIVE PIR TRACKING</span>
                    <span className="flex items-center gap-2"><Zap size={14} className="text-[var(--color-neon-orange)]" /> TRUE SHOOTING %</span>
                    <span className="flex items-center gap-2"><Wifi size={14} className="text-[var(--color-neon-blue)]" /> OFFLINE FIRST</span>
                    <span className="flex items-center gap-2"><Lock size={14} className="text-[var(--color-neon-purple)]" /> SECURE CLOUD SYNC</span>
                    <span className="flex items-center gap-2"><Trophy size={14} className="text-yellow-500" /> MVP BADGES SYSTEM</span>
                </div>
            </div>

            {/* ════════ BENTO GRID FEATURES ════════ */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <span className="text-[var(--color-neon-blue)] font-bold tracking-widest uppercase text-sm">PRO FEATURES</span>
                        <h2 className="text-4xl md:text-5xl font-black mt-2">THE ANALYTICS ADVANTAGE</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* FEATURE 1: QUANTUM COURT */}
                        <div className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#0a0a0c] border border-white/5 hover:border-[var(--color-neon-blue)]/30 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-blue)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="p-8 relative z-10">
                                <Activity className="w-12 h-12 text-[var(--color-neon-blue)] mb-6" />
                                <h3 className="text-2xl font-bold mb-2">Interface "Quantum Court"</h3>
                                <p className="text-[var(--color-text-dim)] max-w-md">
                                    Une UX conçue pour la vitesse. Saisie sans scroll, boutons tactiles optimisés, et feedback visuel instantané. Le mode sombre absolu économise votre batterie.
                                </p>
                            </div>
                            {/* Abstract decorative element simulating the UI */}
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient-to-tl from-[#1a1a20] to-[#0f0f13] rounded-tl-3xl border-t border-l border-white/5 p-4 flex flex-col gap-2 opacity-50 group-hover:opacity-80 transition-all group-hover:scale-105 group-hover:-translate-y-2">
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-[var(--color-neon-green)]/20" />
                                    <div className="h-2 w-20 bg-white/10 rounded-full my-auto" />
                                </div>
                                <div className="h-32 w-full bg-[var(--color-bg)] rounded-xl border border-white/5" />
                            </div>
                        </div>

                        {/* FEATURE 2: OFFLINE */}
                        <div className="relative group overflow-hidden rounded-3xl bg-[#0a0a0c] border border-white/5 hover:border-[var(--color-neon-purple)]/30 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-purple)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="p-8">
                                <Wifi className="w-12 h-12 text-[var(--color-neon-purple)] mb-6" />
                                <h3 className="text-2xl font-bold mb-2">Gym Mode (Offline)</h3>
                                <p className="text-[var(--color-text-dim)]">
                                    Pas de réseau ? Pas de problème. HoopStats stocke tout en local et synchronise dès le retour du Wi-Fi.
                                </p>
                            </div>
                        </div>

                        {/* FEATURE 3: ADVANCED METRICS */}
                        <div className="relative group overflow-hidden rounded-3xl bg-[#0a0a0c] border border-white/5 hover:border-[var(--color-neon-orange)]/30 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-orange)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="p-8">
                                <BarChart3 className="w-12 h-12 text-[var(--color-neon-orange)] mb-6" />
                                <h3 className="text-2xl font-bold mb-2">Moneyball Analytics</h3>
                                <p className="text-[var(--color-text-dim)]">
                                    Calcul automatique du PIR, True Shooting % et Effective FG%. Vos joueurs méritent des stats pro.
                                </p>
                            </div>
                        </div>

                        {/* FEATURE 4: BADGES (New!) */}
                        <div className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-[#0a0a0c] border border-white/5 hover:border-[var(--color-neon-green)]/30 transition-all duration-500">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-neon-green)] opacity-5 blur-[80px] rounded-full pointer-events-none" />
                            <div className="p-8 md:flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Trophy className="w-12 h-12 text-[var(--color-neon-green)]" />
                                        <span className="px-2 py-1 rounded bg-[var(--color-neon-green)]/10 text-[var(--color-neon-green)] text-xs font-bold border border-[var(--color-neon-green)]/20">NEW IN V1.5</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Gamification System</h3>
                                    <p className="text-[var(--color-text-dim)] max-w-sm mb-6">
                                        Motivez vos joueurs avec des badges de performance uniques générés automatiquement après chaque match.
                                    </p>
                                    <div className="flex gap-2">
                                        <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-[var(--color-neon-blue)]">SNIPER</div>
                                        <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-[var(--color-neon-purple)]">MAESTRO</div>
                                        <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-[var(--color-neon-orange)]">THE WALL</div>
                                    </div>
                                </div>
                                {/* Visual Badge mockup */}
                                <div className="mt-8 md:mt-0 flex gap-4 md:-mr-12 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <div className="w-24 h-32 rounded-lg bg-gradient-to-b from-[#1a1a20] to-[#0f0f13] border border-white/10 flex flex-col items-center justify-center p-2 shadow-xl transform rotate-3 group-hover:rotate-6 transition-transform">
                                        <Shield className="text-[var(--color-neon-blue)] mb-2" />
                                        <div className="w-12 h-1.5 bg-white/10 rounded-full" />
                                    </div>
                                    <div className="w-24 h-32 rounded-lg bg-gradient-to-b from-[#1a1a20] to-[#0f0f13] border border-white/10 flex flex-col items-center justify-center p-2 shadow-xl -mt-4 z-10 transform -rotate-2 group-hover:-rotate-3 transition-transform">
                                        <Trophy className="text-yellow-500 mb-2" />
                                        <div className="w-12 h-1.5 bg-white/10 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════ CALL TO ACTION ════════ */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-neon-blue)]/10 to-transparent pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl font-black mb-8">
                        READY TO <span className="text-outline-white">DOMINATE?</span>
                    </h2>
                    <p className="text-xl text-[var(--color-text-dim)] mb-12">
                        Rejoignez les coachs qui ont déjà transformé leurs données en victoires.
                    </p>
                    <button
                        onClick={onStart}
                        className="group relative px-10 py-5 rounded-full bg-white text-black font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.3)] overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            COMMENCER L'EXPÉRIENCE <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    </button>
                    <p className="mt-6 text-sm text-[var(--color-text-dim)]">Start. Analyze. Win. — v1.5.0</p>
                </div>
            </section>

            {/* ════════ FOOTER ════════ */}
            <footer className="border-t border-white/5 py-12 text-center text-[var(--color-text-dim)] text-sm">
                <p>© 2025 HoopStats Elite. Built for the love of the game.</p>
            </footer>

            {/* Custom Styles for Ticker */}
            <style>{`
                .text-outline-white {
                    -webkit-text-stroke: 1px rgba(255,255,255,0.5);
                    color: transparent;
                }
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    animation: ticker 20s linear infinite;
                }
            `}</style>
        </div>
    );
});

LandingPage.displayName = 'LandingPage';

export default LandingPage;
