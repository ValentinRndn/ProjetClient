import React from 'react';
import { Phone, Mail } from 'lucide-react';

/**
 * TeamCard - Carte membre de l'équipe
 *
 * @param {Object} member - Données du membre (initial, name, role, phone, email)
 */
export default function TeamCard({ member }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        {/* Avatar avec initiale */}
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-violet to-bleu-nuit rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-white font-bold text-2xl">{member.initial}</span>
        </div>

        {/* Infos */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-bleu-nuit mb-1">{member.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{member.role}</p>

          {/* Contact */}
          <div className="space-y-2">
            <a
              href={`tel:${member.phone}`}
              className="flex items-center gap-2 text-sm text-indigo-violet hover:text-bleu-nuit transition-colors"
            >
              <Phone size={14} />
              <span className="font-medium">{member.phone}</span>
            </a>
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex items-center gap-2 text-sm text-indigo-violet hover:text-bleu-nuit transition-colors"
              >
                <Mail size={14} />
                <span className="font-medium">{member.email}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
