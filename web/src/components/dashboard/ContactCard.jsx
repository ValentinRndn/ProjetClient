import React from 'react';
import { Phone, Mail, User } from 'lucide-react';

/**
 * ContactCard - Carte de contact pour l'équipe Vizion
 *
 * @param {Object} contact - Données du contact
 */
export default function ContactCard({ contact }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-violet to-bleu-nuit rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
          <User size={24} className="text-white" />
        </div>

        {/* Infos */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-bleu-nuit mb-1">{contact.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{contact.role}</p>

          {/* Coordonnées */}
          <div className="space-y-2">
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-2 text-sm text-indigo-violet hover:text-bleu-nuit transition-colors"
            >
              <Phone size={16} />
              <span className="font-medium">{contact.phone}</span>
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2 text-sm text-indigo-violet hover:text-bleu-nuit transition-colors"
            >
              <Mail size={16} />
              <span className="font-medium">{contact.email}</span>
            </a>
          </div>
        </div>

        {/* Bouton contact */}
        <a
          href={`mailto:${contact.email}`}
          className="px-4 py-2 bg-indigo-violet/10 border border-indigo-violet text-indigo-violet rounded-lg hover:bg-indigo-violet hover:text-white transition-all text-sm font-semibold"
        >
          Contacter
        </a>
      </div>
    </div>
  );
}
