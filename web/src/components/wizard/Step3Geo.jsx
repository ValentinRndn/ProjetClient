import React from 'react';
import { TextInput, CheckboxGroup, TagSelector } from './FormComponents';
import { MapPin, Info } from 'lucide-react';

export default function Step3Geo({ formData, updateFormData, errors }) {
  const availableCities = [
    'Lyon', 'Paris', 'Marseille', 'Lille', 'Nantes',
    'Bordeaux', 'Toulouse', 'Nice', 'Strasbourg', 'Montpellier',
    'Rennes', 'Grenoble', 'Dijon', 'Angers', 'Saint-Étienne',
    'Remote (Distanciel)'
  ];

  const interventionModeOptions = [
    { value: 'presentiel', label: 'Présentiel' },
    { value: 'distanciel', label: 'Distanciel (Remote)' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-bleu-nuit mb-2">
          <MapPin className="inline mr-2" size={28} />
          Zone géographique d'intervention
        </h2>
        <p className="text-gray-600">
          Indiquez où vous pouvez intervenir et vos modalités.
        </p>
      </div>

      <TextInput
        label="Ville principale"
        name="mainCity"
        value={formData.mainCity}
        onChange={handleChange}
        placeholder="Ex: Lyon"
        error={errors.mainCity}
        required
      />

      <TagSelector
        label="Zones d'intervention"
        availableTags={availableCities}
        selectedTags={formData.interventionZones || []}
        onChange={(tags) => updateFormData({ interventionZones: tags })}
        placeholder="Recherchez une ville..."
        allowCustom={true}
      />
      {errors.interventionZones && (
        <p className="text-red-600 text-sm flex items-center gap-2 -mt-3">
          <Info size={16} />
          {errors.interventionZones}
        </p>
      )}

      <CheckboxGroup
        label="Mode d'intervention"
        name="interventionModes"
        options={interventionModeOptions}
        selectedValues={formData.interventionModes || []}
        onChange={handleChange}
        error={errors.interventionModes}
      />

      <div className="bg-beige-elegant border-l-4 border-yellow-600 p-4 rounded-r-lg">
        <p className="text-sm text-bleu-nuit">
          <strong>💡 Défraiement nécessaire :</strong> Pour certaines villes éloignées de votre
          ville principale, un défraiement (transport, hébergement) pourra être demandé aux
          établissements.
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <p className="text-sm text-bleu-nuit">
          <strong>📍 Astuce :</strong> Plus vous ajoutez de zones d'intervention, plus vous aurez
          d'opportunités. N'hésitez pas à inclure "Remote" si vous pouvez intervenir en distanciel.
        </p>
      </div>
    </div>
  );
}
