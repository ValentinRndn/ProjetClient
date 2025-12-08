import React from 'react';
import { TextInput, Select } from './FormComponents';

export default function Step2CompanyInfo({ formData, updateFormData, errors }) {
  const legalForms = [
    { value: 'SAS', label: 'SAS - Société par Actions Simplifiée' },
    { value: 'SARL', label: 'SARL - Société à Responsabilité Limitée' },
    { value: 'EURL', label: 'EURL - Entreprise Unipersonnelle à Responsabilité Limitée' },
    { value: 'SA', label: 'SA - Société Anonyme' },
    { value: 'SASU', label: 'SASU - Société par Actions Simplifiée Unipersonnelle' },
    { value: 'SNC', label: 'SNC - Société en Nom Collectif' },
    { value: 'Micro', label: 'Micro-entreprise' },
    { value: 'EI', label: 'Entreprise Individuelle' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-bleu-nuit mb-2">
          Informations de votre entreprise
        </h2>
        <p className="text-gray-600">
          Renseignez les informations légales de votre structure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <TextInput
            label="Nom de la société"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Ex: Vizion Consulting"
            error={errors.companyName}
            required
          />
        </div>

        <Select
          label="Forme sociale"
          name="legalForm"
          value={formData.legalForm}
          onChange={handleChange}
          options={legalForms}
          error={errors.legalForm}
          required
        />

        <TextInput
          label="Capital social (€)"
          name="capital"
          type="number"
          value={formData.capital}
          onChange={handleChange}
          placeholder="10000"
          error={errors.capital}
          required
        />

        <TextInput
          label="SIRET"
          name="siret"
          value={formData.siret}
          onChange={handleChange}
          placeholder="12345678901234"
          pattern="[0-9]{14}"
          maxLength={14}
          error={errors.siret}
          required
        />

        <TextInput
          label="SIREN RCS"
          name="siren"
          value={formData.siren}
          onChange={handleChange}
          placeholder="123456789"
          pattern="[0-9]{9}"
          maxLength={9}
          error={errors.siren}
          required
        />

        <div className="md:col-span-2">
          <TextInput
            label="Ville d'attribution de la société (RCS)"
            name="rcsCity"
            value={formData.rcsCity}
            onChange={handleChange}
            placeholder="Ex: Paris"
            error={errors.rcsCity}
            required
          />
        </div>

        <div className="md:col-span-2">
          <TextInput
            label="Adresse de l'entreprise"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Ex: 10 Rue de la Paix, 75001 Paris"
            error={errors.address}
            required
          />
        </div>

        <TextInput
          label="1er jour de l'exercice comptable"
          name="fiscalYearStart"
          type="date"
          value={formData.fiscalYearStart}
          onChange={handleChange}
          error={errors.fiscalYearStart}
          required
        />

        <TextInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="contact@exemple.fr"
          error={errors.email}
          required
        />

        <TextInput
          label="Téléphone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="06 12 34 56 78"
          error={errors.phone}
          required
        />

        <div className="md:col-span-2">
          <div className="border-t-2 border-gray-200 pt-6 mt-2">
            <h3 className="text-lg font-bold text-bleu-nuit mb-4">
              Contact principal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Prénom du contact"
                name="contactFirstName"
                value={formData.contactFirstName}
                onChange={handleChange}
                placeholder="Jean"
                error={errors.contactFirstName}
                required
              />

              <TextInput
                label="Nom du contact"
                name="contactLastName"
                value={formData.contactLastName}
                onChange={handleChange}
                placeholder="Dupont"
                error={errors.contactLastName}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
        <p className="text-sm text-bleu-nuit">
          <strong>⚠️ Important :</strong> Vérifiez attentivement les numéros SIRET et SIREN.
          Toute erreur pourrait retarder la validation de votre profil.
        </p>
      </div>
    </div>
  );
}
