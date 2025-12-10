import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';

/**
 * ContactInfo - Bloc d'informations de contact (adresse, email, téléphone)
 */
export default function ContactInfo() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <h3 className="text-2xl font-bold text-bleu-nuit mb-6">Informations contact</h3>

      <div className="space-y-6">
        {/* Adresse */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-violet/10 rounded-xl flex-shrink-0">
            <MapPin size={24} className="text-indigo-violet" />
          </div>
          <div>
            <h4 className="font-bold text-bleu-nuit mb-1">Adresse</h4>
            <p className="text-gray-700 leading-relaxed">
              H7, 70 quai Perrache,<br />
              69002 Lyon, France
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-violet/10 rounded-xl flex-shrink-0">
            <Mail size={24} className="text-indigo-violet" />
          </div>
          <div>
            <h4 className="font-bold text-bleu-nuit mb-1">Email</h4>
            <a
              href="mailto:secretariat@vizionacademy.fr"
              className="text-indigo-violet hover:text-bleu-nuit transition-colors font-medium"
            >
              secretariat@vizionacademy.fr
            </a>
          </div>
        </div>

        {/* Téléphone */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-violet/10 rounded-xl flex-shrink-0">
            <Phone size={24} className="text-indigo-violet" />
          </div>
          <div>
            <h4 className="font-bold text-bleu-nuit mb-1">Téléphone</h4>
            <a
              href="tel:+33659196550"
              className="text-indigo-violet hover:text-bleu-nuit transition-colors font-medium"
            >
              +33 6 59 19 65 50
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
