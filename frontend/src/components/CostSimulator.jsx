import { useState, useEffect } from 'react';

const TARIF_BASE = 70;
const TAUX_MAQUETTAGE = 0.20;
const TAUX_TVA = 0.20;

const OPTIONS_FIXES = {
  visite: 500,
  expert: 300,
  materiel: 200
};

const challenges = [
  { value: '', label: 'Sélectionnez un challenge' },
  { value: 'paperasse', label: 'Paperasse Poursuite' },
  { value: 'cinemia', label: 'Cinem-IA' },
  { value: 'aimagination', label: 'AI Magination' },
  { value: 'bizz', label: "Bizz L'éclair" },
  { value: 'proplayer', label: 'Pro Player Manager' },
  { value: 'masterpiece', label: 'Masterpiece Market' },
  { value: 'accesstech', label: 'AccessTech' },
  { value: 'iacquisition', label: 'IA-cquisition' },
  { value: 'creai', label: 'CRE-AI' },
  { value: 'faitonfest', label: 'Fais Ton Fest' }
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const SimulatorForm = ({ onCalculate, error }) => {
  const [challenge, setChallenge] = useState('');
  const [duration, setDuration] = useState(8);
  const [participants, setParticipants] = useState(20);
  const [maquettage, setMaquettage] = useState(false);
  const [visite, setVisite] = useState(false);
  const [expert, setExpert] = useState(false);
  const [materiel, setMateriel] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({
      challenge,
      duration,
      participants,
      maquettage,
      visite,
      expert,
      materiel
    });
  };

  useEffect(() => {
    if (duration >= 1 && participants >= 1) {
      onCalculate({
        challenge,
        duration,
        participants,
        maquettage,
        visite,
        expert,
        materiel
      }, true);
    }
  }, [duration, participants, maquettage, visite, expert, materiel]);

  return (
    <section className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-bleu-nuit mb-6 pb-3 border-b-4 border-indigo-violet">
        Simulateur de Coût
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="challenge" className="block font-semibold text-bleu-nuit">
            Challenge sélectionné
          </label>
          <select
            id="challenge"
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-violet focus:ring-2 focus:ring-indigo-violet/20 transition-colors"
          >
            {challenges.map((ch) => (
              <option key={ch.value} value={ch.value}>
                {ch.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="duration" className="block font-semibold text-bleu-nuit">
            Durée (heures)
          </label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            step="1"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-violet focus:ring-2 focus:ring-indigo-violet/20 transition-colors"
          />
          <small className="text-sm text-gray-600">Minimum 1 heure</small>
        </div>

        <div className="space-y-2">
          <label htmlFor="participants" className="block font-semibold text-bleu-nuit">
            Nombre de participants
          </label>
          <input
            type="number"
            id="participants"
            value={participants}
            onChange={(e) => setParticipants(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            step="1"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-violet focus:ring-2 focus:ring-indigo-violet/20 transition-colors"
          />
          <small className="text-sm text-gray-600">Minimum 1 participant</small>
        </div>

        <fieldset className="space-y-3">
          <legend className="font-semibold text-bleu-nuit mb-3">Options supplémentaires</legend>

          <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={maquettage}
              onChange={(e) => setMaquettage(e.target.checked)}
              className="w-5 h-5 text-bleu-nuit border-gray-300 rounded focus:ring-indigo-violet focus:ring-2 cursor-pointer"
            />
            <span className="flex-1">Maquettage (+20% du coût de base)</span>
          </label>

          <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={visite}
              onChange={(e) => setVisite(e.target.checked)}
              className="w-5 h-5 text-bleu-nuit border-gray-300 rounded focus:ring-indigo-violet focus:ring-2 cursor-pointer"
            />
            <span className="flex-1">Visite d'entreprise (+500€)</span>
          </label>

          <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={expert}
              onChange={(e) => setExpert(e.target.checked)}
              className="w-5 h-5 text-bleu-nuit border-gray-300 rounded focus:ring-indigo-violet focus:ring-2 cursor-pointer"
            />
            <span className="flex-1">Intervenant expert spécialisé (+300€)</span>
          </label>

          <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={materiel}
              onChange={(e) => setMateriel(e.target.checked)}
              className="w-5 h-5 text-bleu-nuit border-gray-300 rounded focus:ring-indigo-violet focus:ring-2 cursor-pointer"
            />
            <span className="flex-1">Matériel spécifique requis (+200€)</span>
          </label>
        </fieldset>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-violet text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-bleu-nuit transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Calculer le devis
        </button>
      </form>
    </section>
  );
};

const ResultsDisplay = ({ results, onPayment }) => {
  if (!results) {
    return (
      <section className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-bleu-nuit mb-6 pb-3 border-b-4 border-indigo-violet">
          Estimation du coût
        </h2>
        <div className="text-center py-12 text-gray-500 text-lg">
          Configurez votre challenge pour voir l'estimation
        </div>
      </section>
    );
  }

  return (
    <section className="bg-blanc-teinte p-6 md:p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-bleu-nuit mb-6 pb-3 border-b-4 border-indigo-violet">
        Estimation du coût
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-3">
          <span className="font-medium text-gray-700">Sous-total (coût de base)</span>
          <span className="font-semibold text-lg text-bleu-nuit">
            {formatCurrency(results.coutBase)}
          </span>
        </div>

        {results.hasMaquettage && (
          <div className="flex justify-between items-center py-3">
            <span className="font-medium text-gray-700">Montant Maquettage</span>
            <span className="font-semibold text-lg text-bleu-nuit">
              {formatCurrency(results.montantMaquettage)}
            </span>
          </div>
        )}

        {results.hasOptions && (
          <div className="flex justify-between items-center py-3">
            <span className="font-medium text-gray-700">Options fixes</span>
            <span className="font-semibold text-lg text-bleu-nuit">
              {formatCurrency(results.montantOptions)}
            </span>
          </div>
        )}

        <div className="border-t border-gray-200 my-2"></div>

        <div className="flex justify-between items-center py-3">
          <span className="font-medium text-gray-700">Sous-total avant TVA</span>
          <span className="font-semibold text-lg text-bleu-nuit">
            {formatCurrency(results.soustotalAvantTva)}
          </span>
        </div>

        <div className="flex justify-between items-center py-3">
          <span className="font-medium text-gray-700">TVA (20%)</span>
          <span className="font-semibold text-lg text-bleu-nuit">
            {formatCurrency(results.montantTva)}
          </span>
        </div>

        <div className="border-t-2 border-gray-300 my-2"></div>

        <div className="flex justify-between items-center py-4 px-4 bg-bleu-nuit text-white rounded-lg">
          <span className="font-bold text-xl">Total TTC</span>
          <span className="font-bold text-2xl">
            {formatCurrency(results.totalTtc)}
          </span>
        </div>

        <button
          onClick={onPayment}
          className="w-full mt-6 bg-indigo-violet text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-bleu-nuit transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Procéder au paiement
        </button>
      </div>
    </section>
  );
};

export default function CostSimulator() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const calculateQuote = (formData, silent = false) => {
    if (formData.duration < 1) {
      setError("La durée doit être d'au moins 1 heure.");
      return;
    }

    if (formData.participants < 1) {
      setError("Le nombre de participants doit être d'au moins 1.");
      return;
    }

    if (formData.duration > 1000) {
      setError("La durée semble irréaliste (maximum 1000 heures).");
      return;
    }

    if (formData.participants > 1000) {
      setError("Le nombre de participants semble irréaliste (maximum 1000).");
      return;
    }

    setError('');

    const coutBase = formData.duration * formData.participants * TARIF_BASE;
    const montantMaquettage = formData.maquettage ? coutBase * TAUX_MAQUETTAGE : 0;

    let montantOptions = 0;
    if (formData.visite) montantOptions += OPTIONS_FIXES.visite;
    if (formData.expert) montantOptions += OPTIONS_FIXES.expert;
    if (formData.materiel) montantOptions += OPTIONS_FIXES.materiel;

    const soustotalAvantTva = coutBase + montantMaquettage + montantOptions;
    const montantTva = soustotalAvantTva * TAUX_TVA;
    const totalTtc = soustotalAvantTva + montantTva;

    setResults({
      coutBase,
      montantMaquettage,
      montantOptions,
      soustotalAvantTva,
      montantTva,
      totalTtc,
      hasMaquettage: formData.maquettage,
      hasOptions: montantOptions > 0
    });
  };

  return (
    <section className="py-12">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-bleu-nuit mb-4">
          Calculer le coût de votre challenge
        </h2>
        <p className="text-xl text-gray-600">
          Estimez le prix de votre project pédagogique en quelques clics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SimulatorForm onCalculate={calculateQuote} error={error} />
        <div id="results-section">
          <ResultsDisplay
            results={results}
            onPayment={() => {}}
          />
        </div>
      </div>
    </section>
  );
}
