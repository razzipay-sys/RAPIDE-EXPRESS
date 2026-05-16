'use client';

import { useState } from 'react';

const MOCK_KEYS = [
  { id: '1', name: 'Production Key', prefix: 'rpd_live_', lastUsedAt: '2026-05-16T09:30:00Z', isActive: true, permissions: ['deliveries:create', 'deliveries:read', 'pricing:read'] },
  { id: '2', name: 'Integration Test', prefix: 'rpd_test_', lastUsedAt: '2026-05-14T14:00:00Z', isActive: true, permissions: ['deliveries:read', 'pricing:read'] },
];

export default function ApiKeysPage() {
  const [showNew, setShowNew] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    const fakeKey = `rpd_live_${Math.random().toString(36).slice(2, 18)}`;
    setCreatedKey(fakeKey);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(createdKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-white text-2xl">Clés API</h1>
          <p className="text-white/40 text-sm">Intégrez Rapide dans votre système</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="px-4 py-2 rounded-xl bg-rapide-gradient text-white text-sm font-medium shadow-rapide"
        >
          + Nouvelle clé
        </button>
      </div>

      {/* API docs link */}
      <div className="bg-rapide-orange-muted border border-rapide-orange/20 rounded-2xl p-4 mb-6 flex items-center gap-3">
        <span className="text-xl">📖</span>
        <div className="flex-1">
          <p className="text-white font-medium text-sm">Documentation API</p>
          <p className="text-white/50 text-xs">Consultez notre guide d&apos;intégration pour démarrer</p>
        </div>
        <a href="#" className="text-rapide-orange text-sm hover:underline">Voir →</a>
      </div>

      {/* Keys list */}
      <div className="space-y-3 mb-6">
        {MOCK_KEYS.map((key) => (
          <div key={key.id} className="bg-dark-surface border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-medium">{key.name}</p>
                <p className="text-white/40 text-xs mt-0.5">
                  Dernière utilisation : {new Date(key.lastUsedAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full ${key.isActive ? 'text-green-400 bg-green-400/10' : 'text-white/40 bg-white/5'}`}>
                {key.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 rounded-xl px-3 py-2 mb-3">
              <code className="text-white/70 text-xs font-mono flex-1">{key.prefix}{'•'.repeat(24)}</code>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {key.permissions.map((p) => (
                <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50 font-mono">{p}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10">
                Révoquer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New key modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-dark-surface border border-white/[0.08] rounded-3xl p-6 w-full max-w-md">
            <h2 className="font-display font-semibold text-white mb-4">Créer une clé API</h2>

            {!createdKey ? (
              <>
                <input
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Nom de la clé (ex: Production)"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-rapide-orange transition-colors mb-4"
                />
                <div className="flex gap-2">
                  <button onClick={() => setShowNew(false)} className="flex-1 h-11 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm">
                    Annuler
                  </button>
                  <button onClick={handleCreate} disabled={!newKeyName} className="flex-[2] h-11 rounded-xl bg-rapide-gradient text-white font-medium text-sm disabled:opacity-50">
                    Générer
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-yellow-400 text-xs mb-3">⚠️ Copiez cette clé maintenant — elle ne sera plus affichée.</p>
                <div className="flex items-center gap-2 bg-black/30 rounded-xl px-3 py-3 mb-4">
                  <code className="text-white text-xs font-mono flex-1 break-all">{createdKey}</code>
                  <button onClick={handleCopy} className="text-rapide-orange text-xs flex-shrink-0 hover:underline">
                    {copied ? '✓ Copié' : 'Copier'}
                  </button>
                </div>
                <button
                  onClick={() => { setShowNew(false); setCreatedKey(''); setNewKeyName(''); }}
                  className="w-full h-11 rounded-xl bg-rapide-gradient text-white font-medium text-sm"
                >
                  Terminé
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
