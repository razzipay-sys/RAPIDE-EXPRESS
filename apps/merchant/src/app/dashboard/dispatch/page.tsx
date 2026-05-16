'use client';

import { useState, useCallback } from 'react';

interface ParsedOrder {
  pickupAddress: string;
  dropoffAddress: string;
  recipientName: string;
  recipientPhone: string;
  parcelCategory: string;
  notes: string;
}

const CSV_TEMPLATE = `pickup_address,dropoff_address,recipient_name,recipient_phone,parcel_category,notes
"Plateau, Cotonou","Akpakpa, Cotonou",Jean Dupont,+22997000001,DOCUMENTS,
"Ganhi, Cotonou","Vedoko, Cotonou",Marie Martin,+22997000002,ELECTRONICS,Fragile`;

function downloadTemplate() {
  const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rapide_bulk_template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function DispatchPage() {
  const [orders, setOrders] = useState<ParsedOrder[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const parseCSV = useCallback(async (file: File) => {
    const Papa = await import('papaparse');
    Papa.default.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed: ParsedOrder[] = results.data.map((row) => ({
          pickupAddress: row['pickup_address'] ?? '',
          dropoffAddress: row['dropoff_address'] ?? '',
          recipientName: row['recipient_name'] ?? '',
          recipientPhone: row['recipient_phone'] ?? '',
          parcelCategory: row['parcel_category'] ?? 'OTHER',
          notes: row['notes'] ?? '',
        }));
        setOrders(parsed);
        setFileName(file.name);
      },
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith('.csv')) parseCSV(file);
  }, [parseCSV]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseCSV(file);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500)); // simulate API call
    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="font-display font-bold text-white text-xl mb-2">Commandes soumises !</h2>
        <p className="text-white/50 text-sm mb-6">{orders.length} livraisons créées avec succès</p>
        <button
          onClick={() => { setSubmitted(false); setOrders([]); setFileName(''); }}
          className="px-6 py-2.5 rounded-xl bg-rapide-gradient text-white font-medium text-sm"
        >
          Nouvelle importation
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-white text-2xl">Envoi en masse</h1>
          <p className="text-white/40 text-sm">Importez un fichier CSV pour créer plusieurs livraisons</p>
        </div>
        <button
          onClick={downloadTemplate}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 transition-all"
        >
          ↓ Télécharger le modèle CSV
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all mb-6 ${
          isDragging ? 'border-rapide-orange bg-rapide-orange/5' : 'border-white/10 hover:border-white/20'
        }`}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <p className="text-4xl mb-3">📂</p>
        <p className="text-white font-medium mb-1">
          {fileName ? fileName : 'Glissez votre fichier CSV ici'}
        </p>
        <p className="text-white/40 text-sm">ou cliquez pour parcourir</p>
      </div>

      {/* Preview */}
      {orders.length > 0 && (
        <div className="bg-dark-surface border border-white/[0.06] rounded-2xl overflow-hidden mb-5">
          <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="font-semibold text-white text-sm">{orders.length} livraisons à créer</h2>
            <button onClick={() => { setOrders([]); setFileName(''); }} className="text-white/30 hover:text-white/60 text-sm">Effacer</button>
          </div>
          <div className="overflow-x-auto max-h-64">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['#', 'Collecte', 'Livraison', 'Destinataire', 'Téléphone', 'Catégorie'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-white/40 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 50).map((order, i) => (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5 text-white/40">{i + 1}</td>
                    <td className="px-4 py-2.5 text-white/70 max-w-[120px] truncate">{order.pickupAddress}</td>
                    <td className="px-4 py-2.5 text-white/70 max-w-[120px] truncate">{order.dropoffAddress}</td>
                    <td className="px-4 py-2.5 text-white/70">{order.recipientName}</td>
                    <td className="px-4 py-2.5 text-white/60 font-mono">{order.recipientPhone}</td>
                    <td className="px-4 py-2.5 text-white/60">{order.parcelCategory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl bg-rapide-gradient font-semibold text-white shadow-rapide hover:shadow-rapide-lg transition-all disabled:opacity-50"
        >
          {isSubmitting ? `Création de ${orders.length} livraisons...` : `Créer ${orders.length} livraisons`}
        </button>
      )}
    </div>
  );
}
