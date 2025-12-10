import React from 'react';
import { MapPin, Clock, TrendingUp, Briefcase, Award } from 'lucide-react';
import Tag from './Tag';

/**
 * MissionCard - Carte d'affichage d'une mission disponible
 * Affiche tous les détails et un CTA pour postuler
 *
 * @param {Object} mission - Objet mission
 * @param {Function} onApply - Callback au clic sur "Postuler"
 * @param {Function} onTagClick - Callback au clic sur un tag
 */
export default function MissionCard({ mission, onApply, onTagClick }) {
  const statusColors = {
    open: 'bg-green-100 text-green-800 border-green-200',
    closed: 'bg-red-100 text-red-800 border-red-200',
    filled: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const statusLabels = {
    open: 'Ouverte',
    closed: 'Fermée',
    filled: 'Pourvue'
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all border border-gray-200 p-6 hover:-translate-y-1 duration-300">
      {/* Header avec titre et statut */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-bleu-nuit mb-2">{mission.title}</h3>
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <MapPin size={16} className="text-indigo-violet" />
            <span className="text-sm font-semibold">{mission.school}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[mission.status]}`}>
          {statusLabels[mission.status]}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 leading-relaxed">
        {mission.description}
      </p>

      {/* Tags/Compétences */}
      <div className="flex flex-wrap gap-2 mb-4">
        {mission.tags.map((tag, index) => (
          <Tag
            key={index}
            text={tag}
            onClick={() => onTagClick(tag)}
          />
        ))}
      </div>

      {/* Infos complémentaires */}
      <div className="grid grid-cols-2 gap-3 mb-4 py-4 border-y border-gray-200">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-indigo-violet" />
          <div>
            <p className="text-xs text-gray-500">Durée</p>
            <p className="text-sm font-semibold text-bleu-nuit">{mission.duration}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Briefcase size={16} className="text-indigo-violet" />
          <div>
            <p className="text-xs text-gray-500">Volume</p>
            <p className="text-sm font-semibold text-bleu-nuit">{mission.volume}h</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-indigo-violet" />
          <div>
            <p className="text-xs text-gray-500">Taux horaire</p>
            <p className="text-sm font-semibold text-bleu-nuit">{mission.hourlyRate}€/h</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Award size={16} className="text-indigo-violet" />
          <div>
            <p className="text-xs text-gray-500">Niveau</p>
            <p className="text-sm font-semibold text-bleu-nuit">{mission.level}</p>
          </div>
        </div>
      </div>

      {/* Montant total estimé */}
      <div className="bg-gradient-to-r from-beige-elegant/20 to-beige-elegant/10 rounded-xl p-4 mb-4 border-l-4 border-beige-elegant">
        <p className="text-xs text-gray-600 mb-1">Montant total estimé</p>
        <p className="text-3xl font-bold text-bleu-nuit">{mission.totalAmount.toLocaleString()}€</p>
      </div>

      {/* CTA */}
      <button
        onClick={onApply}
        disabled={mission.status !== 'open'}
        className={`w-full py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-xl ${
          mission.status === 'open'
            ? 'bg-bleu-nuit text-white hover:bg-bleu-nuit'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {mission.status === 'open' ? 'Postuler à cette mission' : 'Mission non disponible'}
      </button>

      {/* Meta infos */}
      <p className="text-xs text-gray-500 text-center mt-3">
        Publiée le {new Date(mission.datePosted).toLocaleDateString('fr-FR')}
      </p>
    </div>
  );
}
