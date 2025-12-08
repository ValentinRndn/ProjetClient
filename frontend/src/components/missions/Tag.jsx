import React from 'react';

/**
 * Tag - Composant badge réutilisable pour afficher des tags/compétences
 * Cliquable pour filtrer par tag
 *
 * @param {string} text - Texte du tag
 * @param {Function} onClick - Callback au clic (optional)
 * @param {boolean} clickable - Si le tag est cliquable
 */
export default function Tag({ text, onClick, clickable = true }) {
  return (
    <span
      onClick={clickable ? onClick : undefined}
      className={`inline-block px-3 py-1 bg-indigo-violet/10 text-indigo-violet rounded-full text-xs font-semibold border border-indigo-violet/20 ${
        clickable ? 'cursor-pointer hover:bg-indigo-violet hover:text-white transition-all' : ''
      }`}
    >
      {text}
    </span>
  );
}
