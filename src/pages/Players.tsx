import { useState } from 'react';
import EmptyState from '../components/EmptyState';
import { useGameStore, type Player } from '../store/gameStore';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import { UserPlus, Trash2, Users } from 'lucide-react';

const Players = () => {
    const { players, addPlayer, deletePlayer } = useGameStore();
    const { addPlayerToFirestore, deletePlayerFromFirestore, updatePlayerInFirestore } = useFirebaseSync();

    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [position, setPosition] = useState('Meneur');
    const [level, setLevel] = useState<'U11' | 'U13' | 'U15' | 'U18'>('U15');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit State
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name && number && !isSubmitting) {
            setIsSubmitting(true);

            // Optimistic Update: Add to local state immediately
            addPlayer(name, number, position, level);

            // Clear form immediately for snappy UX
            const savedName = name;
            const savedNumber = number;
            const savedPosition = position;
            const savedLevel = level;
            setName('');
            setNumber('');

            try {
                // Sync to Firebase in background
                await addPlayerToFirestore({ name: savedName, number: savedNumber, position: savedPosition, level: savedLevel });
            } catch (error) {
                console.error('Error adding player to Firebase:', error);
                // Note: The local optimistic update will be overwritten by onSnapshot sync
                // In a more robust implementation, we'd rollback here
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const startEditing = (player: Player) => {
        setEditingPlayer({ ...player });
    };

    const saveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPlayer && editingPlayer.name && editingPlayer.number && !isSubmitting) {
            setIsSubmitting(true);
            try {
                await updatePlayerInFirestore(editingPlayer.id, {
                    name: editingPlayer.name,
                    number: editingPlayer.number,
                    level: editingPlayer.level,
                    position: editingPlayer.position
                });
                setEditingPlayer(null);
            } catch (error) {
                console.error('Error updating player:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleDelete = async (playerId: string) => {
        // Optimistic Update: Remove from local state immediately
        deletePlayer(playerId);

        try {
            // Sync deletion to Firebase in background
            await deletePlayerFromFirestore(playerId);
        } catch (error) {
            console.error('Error deleting player from Firebase:', error);
            // Note: onSnapshot will re-add if Firebase deletion failed
        }
    };

    return (
        <div className="space-y-6 pb-24 relative">
            {/* EDIT MODAL */}
            {editingPlayer && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200" onClick={() => setEditingPlayer(null)}>
                    <div className="bg-[var(--color-card)] border border-[var(--color-glass-border)] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-[var(--color-glass-border)] bg-[var(--color-bg)]/50 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
                                <Users className="text-yellow-400" />
                                Modifier Joueur
                            </h3>
                            <button onClick={() => setEditingPlayer(null)} className="p-2 hover:bg-[var(--color-bg)] rounded-full transition-colors text-[var(--color-text)]">
                                <span className="text-2xl leading-none">&times;</span>
                            </button>
                        </div>

                        <form onSubmit={saveEdit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs text-[var(--color-text-dim)] uppercase font-bold">Nom Complet</label>
                                <input
                                    type="text"
                                    value={editingPlayer.name}
                                    onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-lg p-3 text-[var(--color-text)] focus:border-[var(--color-neon-blue)] focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-[var(--color-text-dim)] uppercase font-bold">Numéro</label>
                                    <input
                                        type="number"
                                        value={editingPlayer.number}
                                        onChange={(e) => setEditingPlayer({ ...editingPlayer, number: e.target.value })}
                                        className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-lg p-3 text-[var(--color-text)] focus:border-[var(--color-neon-blue)] focus:outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-[var(--color-text-dim)] uppercase font-bold">Niveau</label>
                                    <select
                                        value={editingPlayer.level}
                                        onChange={(e) => setEditingPlayer({ ...editingPlayer, level: e.target.value as 'U11' | 'U13' | 'U15' | 'U18' })}
                                        className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-lg p-3 text-[var(--color-text)] focus:border-[var(--color-neon-blue)] focus:outline-none transition-colors appearance-none"
                                    >
                                        <option value="U11">U11 (Pas de 3 pts)</option>
                                        <option value="U13">U13</option>
                                        <option value="U15">U15</option>
                                        <option value="U18">U18+</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-[var(--color-text-dim)] uppercase font-bold">Poste</label>
                                <select
                                    value={editingPlayer.position}
                                    onChange={(e) => setEditingPlayer({ ...editingPlayer, position: e.target.value })}
                                    className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-lg p-3 text-[var(--color-text)] focus:border-[var(--color-neon-blue)] focus:outline-none transition-colors appearance-none"
                                >
                                    <option value="Meneur">Meneur</option>
                                    <option value="Arrière">Arrière</option>
                                    <option value="Ailier">Ailier</option>
                                    <option value="Ailier Fort">Ailier Fort</option>
                                    <option value="Pivot">Pivot</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingPlayer(null)}
                                    className="flex-1 py-3 bg-[var(--color-bg)] hover:bg-[var(--color-glass-border)] text-[var(--color-text)] font-bold rounded-lg transition-colors"
                                >
                                    ANNULER
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-colors"
                                >
                                    ENREGISTRER
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-[var(--color-text)] flex items-center gap-3">
                    <Users className="text-[var(--color-neon-blue)]" />
                    Gestion des Joueurs
                </h2>
                <p className="text-[var(--color-text-dim)]">Ajoutez et gérez votre équipe</p>
            </div>

            {/* Add Player Form */}
            <form onSubmit={handleAdd} className="glass-card p-6 rounded-2xl space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <UserPlus size={20} className="text-[var(--color-neon-green)]" />
                    Nouveau Joueur
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-[var(--color-text-dim)] uppercase font-bold">Nom Complet</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Victor Wembanyama"
                            className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-lg p-3 text-[var(--color-text)] focus:border-[var(--color-neon-blue)] focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-[var(--color-text-dim)] uppercase font-bold">Numéro</label>
                            <input
                                type="number"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                placeholder="#"
                                className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-lg p-3 text-[var(--color-text)] focus:border-[var(--color-neon-blue)] focus:outline-none transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-[var(--color-text-dim)] uppercase font-bold">Niveau</label>
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value as 'U11' | 'U13' | 'U15' | 'U18')}
                                className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-lg p-3 text-[var(--color-text)] focus:border-[var(--color-neon-blue)] focus:outline-none transition-colors appearance-none"
                            >
                                <option value="U11">U11 (Pas de 3 pts)</option>
                                <option value="U13">U13</option>
                                <option value="U15">U15</option>
                                <option value="U18">U18+</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-[var(--color-text-dim)] uppercase font-bold">Poste</label>
                        <select
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="w-full bg-[var(--color-bg)] border border-[var(--color-glass-border)] rounded-lg p-3 text-[var(--color-text)] focus:border-[var(--color-neon-blue)] focus:outline-none transition-colors appearance-none"
                        >
                            <option value="Meneur">Meneur</option>
                            <option value="Arrière">Arrière</option>
                            <option value="Ailier">Ailier</option>
                            <option value="Ailier Fort">Ailier Fort</option>
                            <option value="Pivot">Pivot</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-[var(--color-neon-blue)] hover:bg-blue-500 text-black font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_25px_rgba(0,243,255,0.5)] active:scale-[0.98]"
                >
                    AJOUTER LE JOUEUR
                </button>
            </form>

            {/* Players List */}
            <h3 className="text-xl font-bold mt-8">Effectif Actuel</h3>
            <div className="grid gap-4">
                {players.length === 0 ? (
                    <EmptyState
                        title="Aucun joueur"
                        message="Votre équipe est vide. Ajoutez des joueurs pour commencer à suivre leurs stats."
                        icon="player"
                    />
                ) : (
                    players.map((player) => (
                        <div key={player.id} className="glass-card p-4 rounded-2xl flex justify-between items-center group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-elevated)] flex items-center justify-center font-stats text-xl text-[var(--color-neon-purple)] border border-[var(--color-glass-border)]">
                                    {player.number}
                                </div>
                                <div>
                                    <div className="font-bold text-lg">{player.name}</div>
                                    <div className="text-xs text-[var(--color-text-dim)] uppercase">{player.position} • <span className="text-[var(--color-neon-blue)]">{player.level}</span></div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => startEditing(player)}
                                    className="p-3 text-yellow-400/50 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                                    title="Modifier"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(player.id)}
                                    className="p-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Supprimer"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Players;
