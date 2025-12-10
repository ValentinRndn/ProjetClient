import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import MainNav from '../components/MainNav';

// Import des steps
import Step1TypeContract from '../components/wizard/Step1TypeContract';
import Step2CompanyInfo from '../components/wizard/Step2CompanyInfo';
import Step3Geo from '../components/wizard/Step3Geo';
import Step4Presentation from '../components/wizard/Step4Presentation';
import Step5Skills from '../components/wizard/Step5Skills';
import Step6Modules from '../components/wizard/Step6Modules';
import Step7Tax from '../components/wizard/Step7Tax';
import Step8Summary from '../components/wizard/Step8Summary';

const STORAGE_KEY = 'vizion_wizard_data';

export default function VizionWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1
    contractType: '',

    // Step 2
    companyName: '',
    legalForm: '',
    capital: '',
    siret: '',
    siren: '',
    rcsCity: '',
    address: '',
    fiscalYearStart: '',
    email: '',
    phone: '',
    contactFirstName: '',
    contactLastName: '',

    // Step 3
    mainCity: '',
    interventionZones: [],
    interventionModes: [],

    // Step 4
    presentation: '',
    profilePhoto: null,
    profilePhotoPreview: null,
    presentationVideo: '',

    // Step 5
    skills: [],
    diplomas: [],
    experiences: [],
    languages: [],
    software: [],

    // Step 6
    availability: '',
    previousSchools: [],
    interests: [],
    modules: [],
    linkedinUrl: '',
    cvFile: null,
    cvPreview: null,

    // Step 7
    vatSubject: '',
    paymentDelay: '30',
    penaltyRate: '3',
  });

  const [errors, setErrors] = useState({});

  const totalSteps = 8;

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setFormData(data.formData || formData);
        setCurrentStep(data.currentStep || 0);
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  // Save to localStorage on data change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ formData, currentStep })
    );
  }, [formData, currentStep]);

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => delete newErrors[field]);
      return newErrors;
    });
  };

  const validateStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 0: // Step 1
        if (!formData.contractType) {
          newErrors.contractType = 'Veuillez sélectionner un type de contractualisation';
        }
        break;

      case 1: // Step 2
        if (!formData.companyName) newErrors.companyName = 'Champ obligatoire';
        if (!formData.legalForm) newErrors.legalForm = 'Champ obligatoire';
        if (!formData.capital) newErrors.capital = 'Champ obligatoire';
        if (!formData.siret || formData.siret.length !== 14) {
          newErrors.siret = 'Le SIRET doit contenir exactement 14 chiffres';
        }
        if (!formData.siren || formData.siren.length !== 9) {
          newErrors.siren = 'Le SIREN doit contenir exactement 9 chiffres';
        }
        if (!formData.rcsCity) newErrors.rcsCity = 'Champ obligatoire';
        if (!formData.address) newErrors.address = 'Champ obligatoire';
        if (!formData.fiscalYearStart) newErrors.fiscalYearStart = 'Champ obligatoire';
        if (!formData.email) {
          newErrors.email = 'Champ obligatoire';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Email invalide';
        }
        if (!formData.phone) newErrors.phone = 'Champ obligatoire';
        if (!formData.contactFirstName) newErrors.contactFirstName = 'Champ obligatoire';
        if (!formData.contactLastName) newErrors.contactLastName = 'Champ obligatoire';
        break;

      case 2: // Step 3
        if (!formData.mainCity) newErrors.mainCity = 'Champ obligatoire';
        if (formData.interventionZones.length === 0) {
          newErrors.interventionZones = 'Sélectionnez au moins une zone';
        }
        if (formData.interventionModes.length === 0) {
          newErrors.interventionModes = 'Sélectionnez au moins un mode';
        }
        break;

      case 3: // Step 4
        if (!formData.presentation) newErrors.presentation = 'Champ obligatoire';
        if (formData.presentation && formData.presentation.length > 400) {
          newErrors.presentation = 'Maximum 400 caractères';
        }
        break;

      case 4: // Step 5
        if (formData.skills.length === 0) {
          newErrors.skills = 'Sélectionnez au moins une compétence';
        }
        break;

      case 5: // Step 6
        if (!formData.availability) newErrors.availability = 'Champ obligatoire';
        if (formData.previousSchools.length === 0) {
          newErrors.previousSchools = 'Indiquez au moins une école ou "Aucune"';
        }
        if (formData.interests.length === 0) {
          newErrors.interests = 'Sélectionnez au moins un intérêt';
        }
        break;

      case 6: // Step 7
        if (!formData.vatSubject) newErrors.vatSubject = 'Champ obligatoire';
        if (!formData.paymentDelay) newErrors.paymentDelay = 'Champ obligatoire';
        if (!formData.penaltyRate) newErrors.penaltyRate = 'Champ obligatoire';
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (validateStep()) {
      // Ici, normalement on enverrait les données au serveur
      alert('✅ Profil créé avec succès ! (Simulation)');
      console.log('Form Data:', formData);

      // Reset
      localStorage.removeItem(STORAGE_KEY);
      setFormData({});
      setCurrentStep(0);
    }
  };

  const steps = [
    {
      title: 'Type de contractualisation',
      component: Step1TypeContract
    },
    {
      title: 'Informations entreprise',
      component: Step2CompanyInfo
    },
    {
      title: 'Zone géographique',
      component: Step3Geo
    },
    {
      title: 'Votre présentation',
      component: Step4Presentation
    },
    {
      title: 'Vos compétences',
      component: Step5Skills
    },
    {
      title: 'Vos modules et tarifs',
      component: Step6Modules
    },
    {
      title: 'TVA et Facturation',
      component: Step7Tax
    },
    {
      title: 'Récapitulatif et validation',
      component: Step8Summary
    }
  ];

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-blanc-teinte">
      {/* Header avec navigation */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <div>
                <h1 className="text-black font-bold text-xl">Vizion Academy</h1>
                <p className="text-indigo-violet text-xs">Créer mon profil</p>
              </div>
            </div>
            <MainNav />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-bleu-nuit mb-4">
            Devenir <span className="text-indigo-violet">Vizionner</span>
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Créez votre profil d'expert en quelques étapes
          </p>

          <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
            <Clock size={20} />
            <span>Temps estimé : 15 minutes</span>
          </div>

          {/* Avertissements */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-sm text-bleu-nuit">
              <p>
                <strong>Prenez le temps</strong> de remplir correctement ce formulaire.
                Toutes les informations seront visibles par les écoles partenaires.
              </p>
            </div>

            <div className="bg-beige-elegant border-2 border-yellow-400 rounded-xl p-4 text-sm text-bleu-nuit">
              <div className="flex items-start gap-3">
                <AlertTriangle className="flex-shrink-0 mt-0.5" size={20} />
                <p>
                  <strong>Vous prenez la responsabilité</strong> de l'exactitude des informations fournies.
                  En cas d'erreur ou de fausse déclaration, vous en êtes pleinement responsable.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Étape {currentStep + 1} sur {totalSteps}
            </span>
            <span className="text-sm font-medium text-indigo-violet">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-violet to-bleu-nuit transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center mt-3 font-semibold text-bleu-nuit text-lg">
            {steps[currentStep].title}
          </p>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-8">
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-4">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white border-2 border-indigo-violet text-indigo-violet hover:bg-indigo-violet hover:text-white'
            }`}
          >
            <ChevronLeft size={20} />
            Précédent
          </button>

          {currentStep < totalSteps - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-bleu-nuit text-white rounded-lg font-semibold hover:bg-indigo-violet transition-all shadow-lg hover:shadow-xl"
            >
              Suivant
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-3 bg-beige-elegant text-bleu-nuit rounded-lg font-bold hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl"
            >
              ✅ Valider et créer mon profil
            </button>
          )}
        </div>

        {/* Save indicator */}
        <p className="text-center text-sm text-gray-500 mt-4">
          💾 Vos données sont sauvegardées automatiquement
        </p>
      </div>
    </div>
  );
}
