import React from 'react';
import { RadioGroup } from './FormComponents';

export default function Step1TypeContract({ formData, updateFormData, errors }) {
  const options = [
    {
      value: 'personne_physique',
      label: 'Personne Physique',
      description: 'Avec micro-entreprise'
    },
    {
      value: 'entreprise',
      label: 'Entreprise',
      description: 'SAS, SARL, EURL, etc.'
    }
  ];

  const handleChange = (e) => {
    updateFormData({ contractType: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-bleu-nuit mb-2">
          Type de contractualisation
        </h2>
        <p className="text-gray-600">
          Sélectionnez le type de structure avec laquelle vous souhaitez intervenir.
        </p>
      </div>

      <RadioGroup
        label="Choisissez votre statut"
        name="contractType"
        options={options}
        selectedValue={formData.contractType}
        onChange={handleChange}
        error={errors.contractType}
        required
      />

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <p className="text-sm text-bleu-nuit">
          <strong>💡 Conseil :</strong> Si vous n'avez pas encore de structure, la micro-entreprise
          est le statut le plus simple pour démarrer. Vous pourrez le modifier plus tard.
        </p>
      </div>
    </div>
  );
}
