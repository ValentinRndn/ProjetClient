import React from 'react';
import { motion } from 'framer-motion';

/**
 * StatCard - Composant de carte statistique réutilisable
 * Affiche une statistique avec icône, valeur et label
 *
 * @param {React.ReactNode} icon - Icône à afficher
 * @param {string|number} value - Valeur de la statistique
 * @param {string} label - Label descriptif
 * @param {string} color - Couleur d'accent (défaut: indigo-violet)
 * @param {number} index - Index pour animation échelonnée
 */
export default function StatCard({ icon, value, label, color = 'indigo-violet', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-4 sm:p-6 border-l-4 border-indigo-violet"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">{label}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-bleu-nuit">{value}</p>
        </div>
        <div className={`p-2 sm:p-3 lg:p-4 bg-${color}/10 rounded-xl flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
