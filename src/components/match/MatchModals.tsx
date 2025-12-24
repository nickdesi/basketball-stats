import { BarChart3, Undo2 } from 'lucide-react';

interface MatchModalsProps {
    showFoulConfirm: boolean;
    showEndMatchConfirm: boolean;
    showResetConfirm: boolean;
    onFoulConfirm: () => void;
    onFoulCancel: () => void;
    onEndMatchConfirm: () => void;
    onEndMatchCancel: () => void;
    onResetConfirm: () => void;
    onResetCancel: () => void;
}

const MatchModals = ({
    showFoulConfirm,
    showEndMatchConfirm,
    showResetConfirm,
    onFoulConfirm,
    onFoulCancel,
    onEndMatchConfirm,
    onEndMatchCancel,
    onResetConfirm,
    onResetCancel,
}: MatchModalsProps) => {
    return (
        <>
            {/* 5-FOUL CONFIRMATION MODAL */}
            {showFoulConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
                    <div className="glass-card rounded-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 space-y-4 text-center border-2 border-red-500">
                        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                            <span className="text-3xl font-black">5</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">5ème Faute !</h3>
                            <p className="text-[var(--color-text-dim)] text-sm">
                                Attention, cette action va valider la 5ème faute et <span className="text-white font-bold">terminer le match</span> pour ce joueur.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                onClick={onFoulCancel}
                                className="py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                            >
                                ANNULER
                            </button>
                            <button
                                onClick={onFoulConfirm}
                                className="py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/20"
                            >
                                CONFIRMER
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* END MATCH CONFIRMATION MODAL */}
            {showEndMatchConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
                    <div className="glass-card rounded-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 space-y-4 text-center border-2 border-[var(--color-neon-blue)]">
                        <div className="mx-auto w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-[var(--color-neon-blue)]">
                            <BarChart3 size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">Terminer le match ?</h3>
                            <p className="text-[var(--color-text-dim)] text-sm">
                                Les statistiques seront sauvegardées dans l'historique et vous serez redirigé vers le tableau de bord.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                onClick={onEndMatchCancel}
                                className="py-3 bg-[var(--color-card)] hover:bg-[var(--color-bg)] text-[var(--color-text)] font-bold rounded-xl transition-colors border border-[var(--color-glass-border)]"
                            >
                                ANNULER
                            </button>
                            <button
                                onClick={onEndMatchConfirm}
                                className="py-3 bg-[var(--color-neon-blue)] hover:brightness-110 text-black font-black rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                            >
                                CONFIRMER
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* RESET CONFIRMATION MODAL */}
            {showResetConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
                    <div className="glass-card rounded-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 space-y-4 text-center border-2 border-red-500">
                        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                            <Undo2 size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">Réinitialiser le match ?</h3>
                            <p className="text-[var(--color-text-dim)] text-sm">
                                Toutes les statistiques actuelles seront perdues. Cette action est irréversible.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                onClick={onResetCancel}
                                className="py-3 bg-[var(--color-card)] hover:bg-[var(--color-bg)] text-[var(--color-text)] font-bold rounded-xl transition-colors border border-[var(--color-glass-border)]"
                            >
                                ANNULER
                            </button>
                            <button
                                onClick={onResetConfirm}
                                className="py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/20"
                            >
                                RESET
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MatchModals;
