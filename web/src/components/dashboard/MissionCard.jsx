import React from 'react';
import { Calendar, Users, Euro, MapPin } from 'lucide-react';

/**
 * MissionCard - Carte d'affichage d'une mission
 *
 * @param {Object} mission - Données de la mission
 */
export default function MissionCard({ mission }) {
  const statusColors = {
    completed: 'bg-green-100 text-green-800 border-green-200',
    active: 'bg-blue-100 text-blue-800 border-blue-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusLabels = {
    completed: 'Terminée',
    active: 'En cours',
    pending: 'En attente',
    cancelled: 'Annulée'
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-bleu-nuit mb-1">{mission.module}</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} />
            <span className="text-sm">{mission.school}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[mission.status]}`}>
          {statusLabels[mission.status]}
        </span>
      </div>

      {/* Infos */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={16} className="text-indigo-violet" />
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-sm font-semibold text-bleu-nuit">{mission.date}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Users size={16} className="text-indigo-violet" />
          <div>
            <p className="text-xs text-gray-500">Étudiants</p>
            <p className="text-sm font-semibold text-bleu-nuit">{mission.students}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Euro size={16} className="text-indigo-violet" />
          <div>
            <p className="text-xs text-gray-500">Rémunération</p>
            <p className="text-sm font-semibold text-bleu-nuit">{mission.remuneration.toFixed(2)}€</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button className="flex-1 px-4 py-2 text-indigo-violet border border-indigo-violet rounded-lg hover:bg-indigo-violet hover:text-white transition-all text-sm font-semibold">
          Voir détails
        </button>
        {mission.status === 'completed' && (
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold">
            Télécharger facture
          </button>
        )}
      </div>
    </div>
  );
}
