import React, { useState } from 'react';
import { TagSelector, TextInput } from './FormComponents';
import { Award, Plus, X, Info } from 'lucide-react';

export default function Step5Skills({ formData, updateFormData, errors }) {
  const [diplomaInput, setDiplomaInput] = useState('');
  const [experienceInput, setExperienceInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');
  const [softwareInput, setSoftwareInput] = useState('');

  const availableSkills = [
    // Soft Skills
    'Leadership', 'Communication', 'Travail d\'équipe', 'Gestion du temps', 'Résolution de problèmes',
    'Pensée critique', 'Créativité', 'Adaptabilité', 'Intelligence émotionnelle', 'Prise de décision',

    // Business & Stratégie
    'Stratégie d\'entreprise', 'Business Development', 'Analyse de marché', 'Innovation',
    'Entrepreneuriat', 'Gestion de projet', 'Management', 'Négociation', 'Consulting',

    // Finance
    'Comptabilité', 'Analyse financière', 'Gestion de trésorerie', 'Audit', 'Contrôle de gestion',
    'Finance d\'entreprise', 'Investissement', 'Fiscalité', 'Budget prévisionnel',

    // Tech & Digital
    'Développement web', 'Data Science', 'Machine Learning', 'Intelligence Artificielle',
    'Cybersécurité', 'Cloud Computing', 'DevOps', 'UX/UI Design', 'Mobile Development',
    'Blockchain', 'IoT', 'Big Data', 'Python', 'JavaScript', 'Java', 'C++', 'PHP', 'Ruby',

    // Design & Création
    'Design Graphique', 'Motion Design', 'Photographie', 'Vidéo', 'Illustration',
    'Direction Artistique', 'Branding', 'Typographie', 'UI Design', 'UX Research',

    // RH & Formation
    'Recrutement', 'Gestion des talents', 'Formation professionnelle', 'Coaching',
    'Développement RH', 'Paie et administration', 'Droit du travail', 'GPEC',

    // Juridique
    'Droit des affaires', 'Droit social', 'Droit commercial', 'Propriété intellectuelle',
    'Contrats', 'Compliance', 'RGPD', 'Droit fiscal',

    // Industrie
    'Lean Management', 'Supply Chain', 'Qualité', 'Logistique', 'Production',
    'Maintenance', 'Six Sigma', 'Kaizen', 'Industrie 4.0',

    // Communication & Marketing
    'Marketing digital', 'SEO/SEA', 'Social Media', 'Content Marketing', 'Email Marketing',
    'Relations Publiques', 'Communication corporate', 'Brand Management', 'Publicité',
    'Influence Marketing', 'Analytics', 'Growth Hacking',

    // Logiciels/Outils
    'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Figma', 'Sketch',
    'Microsoft Excel', 'Power BI', 'Tableau', 'Salesforce', 'HubSpot', 'Google Analytics',
    'WordPress', 'Shopify', 'AutoCAD', 'SolidWorks', 'SAP', 'ERP', 'CRM'
  ];

  const addDiploma = () => {
    if (diplomaInput.trim()) {
      updateFormData({
        diplomas: [...(formData.diplomas || []), diplomaInput.trim()]
      });
      setDiplomaInput('');
    }
  };

  const removeDiploma = (index) => {
    updateFormData({
      diplomas: formData.diplomas.filter((_, i) => i !== index)
    });
  };

  const addExperience = () => {
    if (experienceInput.trim()) {
      updateFormData({
        experiences: [...(formData.experiences || []), experienceInput.trim()]
      });
      setExperienceInput('');
    }
  };

  const removeExperience = (index) => {
    updateFormData({
      experiences: formData.experiences.filter((_, i) => i !== index)
    });
  };

  const addLanguage = () => {
    if (languageInput.trim()) {
      updateFormData({
        languages: [...(formData.languages || []), languageInput.trim()]
      });
      setLanguageInput('');
    }
  };

  const removeLanguage = (index) => {
    updateFormData({
      languages: formData.languages.filter((_, i) => i !== index)
    });
  };

  const addSoftware = () => {
    if (softwareInput.trim()) {
      updateFormData({
        software: [...(formData.software || []), softwareInput.trim()]
      });
      setSoftwareInput('');
    }
  };

  const removeSoftware = (index) => {
    updateFormData({
      software: formData.software.filter((_, i) => i !== index)
    });
  };

  const handleKeyPress = (e, addFunction) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFunction();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-bleu-nuit mb-2">
          <Award className="inline mr-2" size={28} />
          Vos compétences et qualifications
        </h2>
        <p className="text-gray-600">
          Détaillez vos compétences, diplômes et expériences pertinentes.
        </p>
      </div>

      {/* Compétences principales */}
      <div>
        <TagSelector
          label="Compétences principales"
          availableTags={availableSkills}
          selectedTags={formData.skills || []}
          onChange={(tags) => updateFormData({ skills: tags })}
          placeholder="Recherchez une compétence..."
          allowCustom={true}
        />
        {errors.skills && (
          <p className="text-red-600 text-sm flex items-center gap-2 mt-2">
            <Info size={16} />
            {errors.skills}
          </p>
        )}
      </div>

      {/* Diplômes */}
      <div className="space-y-3">
        <label className="block font-semibold text-bleu-nuit">Diplômes</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={diplomaInput}
            onChange={(e) => setDiplomaInput(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addDiploma)}
            placeholder="Ex: Master Marketing Digital - ESSEC 2020"
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-violet focus:ring-2 focus:ring-indigo-violet/20"
          />
          <button
            type="button"
            onClick={addDiploma}
            className="px-4 py-3 bg-indigo-violet text-white rounded-lg hover:bg-bleu-nuit transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Ajouter
          </button>
        </div>
        {formData.diplomas && formData.diplomas.length > 0 && (
          <ul className="space-y-2">
            {formData.diplomas.map((diploma, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-bleu-nuit">{diploma}</span>
                <button
                  type="button"
                  onClick={() => removeDiploma(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Expériences */}
      <div className="space-y-3">
        <label className="block font-semibold text-bleu-nuit">Expériences professionnelles</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={experienceInput}
            onChange={(e) => setExperienceInput(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addExperience)}
            placeholder="Ex: Directeur Marketing - Entreprise ABC (2018-2023)"
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-violet focus:ring-2 focus:ring-indigo-violet/20"
          />
          <button
            type="button"
            onClick={addExperience}
            className="px-4 py-3 bg-indigo-violet text-white rounded-lg hover:bg-bleu-nuit transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Ajouter
          </button>
        </div>
        {formData.experiences && formData.experiences.length > 0 && (
          <ul className="space-y-2">
            {formData.experiences.map((exp, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-bleu-nuit">{exp}</span>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Langues */}
      <div className="space-y-3">
        <label className="block font-semibold text-bleu-nuit">Langues</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addLanguage)}
            placeholder="Ex: Anglais (C1), Espagnol (B2)"
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-violet focus:ring-2 focus:ring-indigo-violet/20"
          />
          <button
            type="button"
            onClick={addLanguage}
            className="px-4 py-3 bg-indigo-violet text-white rounded-lg hover:bg-bleu-nuit transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Ajouter
          </button>
        </div>
        {formData.languages && formData.languages.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {formData.languages.map((lang, index) => (
              <li
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
              >
                {lang}
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Logiciels */}
      <div className="space-y-3">
        <label className="block font-semibold text-bleu-nuit">Logiciels maîtrisés</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={softwareInput}
            onChange={(e) => setSoftwareInput(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addSoftware)}
            placeholder="Ex: Adobe Photoshop, Figma, Excel avancé"
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-violet focus:ring-2 focus:ring-indigo-violet/20"
          />
          <button
            type="button"
            onClick={addSoftware}
            className="px-4 py-3 bg-indigo-violet text-white rounded-lg hover:bg-bleu-nuit transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Ajouter
          </button>
        </div>
        {formData.software && formData.software.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {formData.software.map((soft, index) => (
              <li
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full"
              >
                {soft}
                <button
                  type="button"
                  onClick={() => removeSoftware(index)}
                  className="hover:bg-green-200 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <p className="text-sm text-bleu-nuit">
          <strong>💡 Astuce :</strong> Plus votre profil est complet et détaillé, plus vous avez
          de chances d'être sélectionné pour des missions pertinentes. N'hésitez pas à ajouter
          toutes vos compétences et qualifications !
        </p>
      </div>
    </div>
  );
}
