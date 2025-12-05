import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { UserPlus, Trash2, Users } from 'lucide-react';

const Players = () => {
    const { players, addPlayer, deletePlayer } = useGameStore();

    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [position, setPosition] = useState('Meneur');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && number) {
            addPlayer(name, number, position);
            setName('');
            setNumber('');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-24">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Users className="text-[var(--color-neon-blue)]" />
                    Gestion des Joueurs
                </h2>
                <p className="text-gray-400">Ajoutez et gérez votre équipe</p>
            </div>

            {/* Add Player Form */}
            <form onSubmit={handleAdd} className="glass-panel p-6 rounded-xl border border-[var(--color-glass-border)] space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <UserPlus size={20} className="text-[var(--color-neon-green)]" />
                    Nouveau Joueur
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 uppercase font-bold">Nom Complet</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Victor Wembanyama"
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--color-neon-blue)] focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 uppercase font-bold">Numéro</label>
                            <input
                                type="number"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                placeholder="#"
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--color-neon-blue)] focus:outline-none transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 uppercase font-bold">Poste</label>
                            <select
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--color-neon-blue)] focus:outline-none transition-colors appearance-none"
                            >
                                <option value="Meneur">Meneur</option>
                                <option value="Arrière">Arrière</option>
                                <option value="Ailier">Ailier</option>
                                <option value="Ailier Fort">Ailier Fort</option>
                                <option value="Pivot">Pivot</option>
                            </select>
                        </div>
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
                    <div className="text-center py-10 text-gray-500 glass-panel rounded-xl">
                        Aucun joueur dans l'équipe.
                    </div>
                ) : (
                    players.map((player) => (
                        <div key={player.id} className="glass-panel p-4 rounded-xl border border-[var(--color-glass-border)] flex justify-between items-center group hover:border-[var(--color-neon-purple)] transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-bold text-xl font-mono text-[var(--color-neon-purple)] border border-white/10">
                                    {player.number}
                                </div>
                                <div>
                                    <div className="font-bold text-lg">{player.name}</div>
                                    <div className="text-xs text-gray-400 uppercase">{player.position}</div>
                                </div>
                            </div>

                            <button
                                onClick={() => deletePlayer(player.id)}
                                className="p-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Supprimer"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Players;
