import React, { useState } from 'react';
import { TextArea, TextInput, CheckboxGroup, FileUploader, TagSelector } from './FormComponents';
import { BookOpen, Plus, X, AlertTriangle, Linkedin, FileText } from 'lucide-react';

export default function Step6Modules({ formData, updateFormData, errors }) {
  const [newModule, setNewModule] = useState({
    title: '',
    summary: '',
    evaluationType: ''
  });

  const interestsOptions = [
    { value: 'jurys', label: 'Participation à des jurys' },
    { value: 'modules_reguliers', label: 'Modules réguliers (cours récurrents)' },
    { value: 'conferences', label: 'Conférences et keynotes' },
    { value: 'ateliers', label: 'Ateliers pratiques' },
    { value: 'challenges', label: 'Encadrement de challenges' },
    { value: 'mentorat', label: 'Mentorat individuel' },
    { value: 'bootcamps', label: 'Bootcamps intensifs' },
    { value: 'projets', label: 'Suivi de projets étudiants' }
  ];

  const availableSchools = [
    'HEC Paris', 'ESSEC', 'ESCP Europe', 'EDHEC', 'EM Lyon',
    'Grenoble École de Management', 'SKEMA', 'Audencia', 'NEOMA',
    'IESEG', 'TBS Education', 'Kedge', 'Rennes School of Business',
    'Montpellier Business School', 'Aucune (première intervention)'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleAddModule = () => {
    if (newModule.title && newModule.summary && newModule.evaluationType) {
      updateFormData({
        modules: [...(formData.modules || []), { ...newModule, id: Date.now() }]
      });
      setNewModule({ title: '', summary: '', evaluationType: '' });
    } else {
      alert('Veuillez remplir tous les champs du module');
    }
  };

  const handleRemoveModule = (id) => {
    updateFormData({
      modules: formData.modules.filter(m => m.id !== id)
    });
  };

  const handleCvUpload = ({ file, preview }) => {
    updateFormData({
      cvFile: file,
      cvPreview: preview
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-bleu-nuit mb-2">
          <BookOpen className="inline mr-2" size={28} />
          Vos modules et tarifs
        </h2>
        <p className="text-gray-600">
          Décrivez vos disponibilités, expériences et modules proposés.
        </p>
      </div>

      {/* Disponibilités */}
      <TextArea
        label="Disponibilités"
        name="availability"
        value={formData.availability}
        onChange={handleChange}
        placeholder="Ex: Disponible en semaine après 18h et le week-end. Préférence pour des interventions ponctuelles ou modules de 2-3 jours."
        rows={3}
        error={errors.availability}
        required
      />

      {/* Écoles partenaires */}
      <div className="space-y-3">
        <TagSelector
          label="Écoles avec lesquelles vous avez déjà travaillé"
          availableTags={availableSchools}
          selectedTags={formData.previousSchools || []}
          onChange={(tags) => updateFormData({ previousSchools: tags })}
          placeholder="Recherchez une école..."
          allowCustom={true}
        />
        {errors.previousSchools && (
          <p className="text-red-600 text-sm">{errors.previousSchools}</p>
        )}

        <div className="bg-red-50 border-2 border-red-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="flex-shrink-0 text-red-600 mt-0.5" size={20} />
            <div>
              <p className="font-bold text-red-900 mb-1">⚠️ CRUCIAL : Ne vous trompez pas !</p>
              <p className="text-sm text-red-800">
                Les informations sur les écoles partenaires sont vérifiées. Toute fausse déclaration
                entraînera le rejet de votre candidature et pourra donner lieu à des poursuites.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Intérêts */}
      <CheckboxGroup
        label="Intérêts en tant qu'intervenant"
        name="interests"
        options={interestsOptions}
        selectedValues={formData.interests || []}
        onChange={handleChange}
        error={errors.interests}
      />

      {/* Modules proposés */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-bleu-nuit">Modules proposés</h3>

        {/* Liste des modules existants */}
        {formData.modules && formData.modules.length > 0 && (
          <div className="space-y-3">
            {formData.modules.map((module) => (
              <div
                key={module.id}
                className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-bleu-nuit">{module.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{module.summary}</p>
                    <p className="text-sm text-indigo-violet mt-1">
                      Évaluation : {module.evaluationType === 'individual' ? 'Individuelle' : 'Collective'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveModule(module.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulaire d'ajout de module */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-4">
          <h4 className="font-semibold text-bleu-nuit">Ajouter un module</h4>

          <TextInput
            label="Titre du module"
            name="moduleTitle"
            value={newModule.title}
            onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
            placeholder="Ex: Introduction au Marketing Digital"
          />

          <TextArea
            label="Résumé du module"
            name="moduleSummary"
            value={newModule.summary}
            onChange={(e) => setNewModule({ ...newModule, summary: e.target.value })}
            placeholder="Décrivez le contenu, les objectifs et la méthodologie (max 10 lignes)..."
            rows={6}
            maxLength={800}
            showCounter={true}
          />

          <div>
            <label className="block font-semibold text-bleu-nuit mb-2">
              Type d'évaluation
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="evaluationType"
                  value="individual"
                  checked={newModule.evaluationType === 'individual'}
                  onChange={(e) => setNewModule({ ...newModule, evaluationType: e.target.value })}
                  className="w-4 h-4 text-indigo-violet"
                />
                <span>Individuelle</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="evaluationType"
                  value="collective"
                  checked={newModule.evaluationType === 'collective'}
                  onChange={(e) => setNewModule({ ...newModule, evaluationType: e.target.value })}
                  className="w-4 h-4 text-indigo-violet"
                />
                <span>Collective</span>
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddModule}
            className="w-full px-4 py-3 bg-indigo-violet text-white rounded-lg hover:bg-bleu-nuit transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Ajouter ce module
          </button>
        </div>
      </div>

      {/* LinkedIn */}
      <TextInput
        label="Profil LinkedIn"
        name="linkedinUrl"
        type="url"
        value={formData.linkedinUrl}
        onChange={handleChange}
        placeholder="https://linkedin.com/in/votre-profil"
        error={errors.linkedinUrl}
      />

      {/* Upload CV */}
      <FileUploader
        label="Curriculum Vitae (CV)"
        name="cvFile"
        accept=".pdf"
        onChange={handleCvUpload}
        preview={formData.cvFile ? formData.cvFile.name : null}
        error={errors.cvFile}
        helperText="Format PDF uniquement, max 10MB"
      />

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <p className="text-sm text-bleu-nuit">
          <strong>💡 Conseil :</strong> Plus vous proposez de modules variés, plus vous augmentez
          vos opportunités d'intervention. N'hésitez pas à détailler vos expertises !
        </p>
      </div>
    </div>
  );
}
