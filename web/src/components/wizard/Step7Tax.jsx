import React from 'react';
import { Select, TextInput } from './FormComponents';
import { Receipt, Info } from 'lucide-react';

export default function Step7Tax({ formData, updateFormData, errors }) {
  const vatOptions = [
    { value: 'oui', label: 'Oui, je suis assujetti à la TVA' },
    { value: 'non', label: 'Non, je ne suis pas assujetti à la TVA' },
    { value: 'franchise', label: 'Franchise en base de TVA (micro-entreprise)' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-bleu-nuit mb-2">
          <Receipt className="inline mr-2" size={28} />
          TVA et Facturation
        </h2>
        <p className="text-gray-600">
          Informations nécessaires pour la facturation automatisée.
        </p>
      </div>

      {/* Informations sur la facturation automatisée */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-bleu-nuit mb-3 flex items-center gap-2">
          <Info size={20} className="text-blue-600" />
          Facturation automatisée
        </h3>
        <div className="space-y-2 text-sm text-bleu-nuit">
          <p>
            ✅ <strong>Vizion Academy gère la facturation pour vous :</strong> Dès qu'une mission
            est validée, une facture est générée automatiquement selon vos paramètres.
          </p>
          <p>
            ✅ <strong>Paiement garanti :</strong> Vous êtes payé selon le délai que vous avez
            défini (généralement 30 jours).
          </p>
          <p>
            ✅ <strong>Traçabilité complète :</strong> Toutes vos factures sont accessibles depuis
            votre dashboard intervenant.
          </p>
        </div>
      </div>

      {/* TVA */}
      <Select
        label="Êtes-vous assujetti à la TVA ?"
        name="vatSubject"
        value={formData.vatSubject}
        onChange={handleChange}
        options={vatOptions}
        error={errors.vatSubject}
        required
        placeholder="Sélectionnez votre situation"
      />

      {formData.vatSubject === 'oui' && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <p className="text-sm text-bleu-nuit">
            <strong>ℹ️ Information :</strong> La TVA sera appliquée automatiquement sur vos
            factures au taux en vigueur (20% pour la plupart des prestations).
          </p>
        </div>
      )}

      {formData.vatSubject === 'franchise' && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
          <p className="text-sm text-bleu-nuit">
            <strong>ℹ️ Franchise en base :</strong> La mention "TVA non applicable, art. 293 B du
            CGI" sera ajoutée automatiquement sur vos factures.
          </p>
        </div>
      )}

      {/* Délai de paiement */}
      <TextInput
        label="Délai de paiement des factures (jours)"
        name="paymentDelay"
        type="number"
        value={formData.paymentDelay}
        onChange={handleChange}
        placeholder="30"
        error={errors.paymentDelay}
        required
      />

      <div className="text-sm text-gray-600 -mt-3 pl-1">
        Délai standard : 30 jours. Peut être ajusté selon vos besoins (15, 30, 45 ou 60 jours).
      </div>

      {/* Taux de pénalité */}
      <TextInput
        label="Taux des pénalités de retard (%)"
        name="penaltyRate"
        type="number"
        step="0.1"
        value={formData.penaltyRate}
        onChange={handleChange}
        placeholder="3"
        error={errors.penaltyRate}
        required
      />

      <div className="text-sm text-gray-600 -mt-3 pl-1">
        Taux légal recommandé : 3 fois le taux d'intérêt légal (environ 10-12% annuel).
      </div>

      {/* Informations complémentaires */}
      <div className="bg-purple-50 border-2 border-indigo-violet rounded-xl p-6 space-y-3">
        <h3 className="font-bold text-bleu-nuit flex items-center gap-2">
          <Info size={20} className="text-indigo-violet" />
          À savoir
        </h3>
        <ul className="space-y-2 text-sm text-bleu-nuit">
          <li>
            • <strong>Format des factures :</strong> Les factures sont générées au format PDF
            conforme aux obligations légales françaises.
          </li>
          <li>
            • <strong>Numérotation :</strong> La numérotation est automatique et séquentielle
            pour garantir la conformité fiscale.
          </li>
          <li>
            • <strong>Archivage :</strong> Toutes vos factures sont archivées pendant 10 ans
            conformément à la législation.
          </li>
          <li>
            • <strong>Modification :</strong> Vous pouvez modifier ces paramètres à tout moment
            depuis votre dashboard.
          </li>
        </ul>
      </div>

      <div className="bg-beige-elegant border-2 border-yellow-400 rounded-xl p-4">
        <p className="text-sm text-bleu-nuit">
          <strong>⚠️ Important :</strong> Ces paramètres seront utilisés pour toutes vos
          factures. Assurez-vous qu'ils sont conformes à votre situation fiscale réelle.
        </p>
      </div>
    </div>
  );
}
