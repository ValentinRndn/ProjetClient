import { useState, useEffect } from 'react';
import MainNav from '../components/MainNav';

// ============================================
// CONSTANTES
// ============================================

const TARIF_BASE = 70; // €/heure/participant
const TAUX_MAQUETTAGE = 0.20; // 20%
const TAUX_TVA = 0.20; // 20%

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

// ============================================
// UTILITAIRES
// ============================================

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// ============================================
// HEADER AVEC NAVIGATION UNIFORME
// ============================================

const Header = () => (
  <header className="bg-blanc-teinte sticky top-0 z-50 shadow-lg">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="text-xl md:text-2xl font-bold text-bleu-nuit">Vizion Academy Logo</div>
      <MainNav />
    </div>
  </header>
);

// ============================================
// COMPOSANT HERO
// ============================================

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-bleu-nuit via-bleu-intense to-indigo-violet text-blanc-teinte py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
          Simulateur de Coût
        </h1>
        <p className="text-lg md:text-xl text-gray-200">
          Estimez le coût de votre challenge pédagogique en quelques clics.
        </p>
      </div>
    </section>
  );
};

// ============================================
// COMPOSANT FORMULAIRE
// ============================================

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

  // Calcul en temps réel
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
      }, true); // true = silent (pas de scroll)
    }
  }, [duration, participants, maquettage, visite, expert, materiel]);

  return (
    <section className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-bleu-nuit mb-6 pb-3 border-b-4 border-indigo-violet">
        Configuration du challenge
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sélection du challenge */}
        <div className="space-y-2">
          <label htmlFor="challenge" className="block font-semibold text-[#272757]">
            Challenge sélectionné
          </label>
          <select
            id="challenge"
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8686AC] focus:ring-2 focus:ring-[#8686AC] focus:ring-opacity-20 transition-colors"
          >
            {challenges.map((ch) => (
              <option key={ch.value} value={ch.value}>
                {ch.label}
              </option>
            ))}
          </select>
        </div>

        {/* Durée */}
        <div className="space-y-2">
          <label htmlFor="duration" className="block font-semibold text-[#272757]">
            Durée (heures)
          </label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            step="1"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8686AC] focus:ring-2 focus:ring-[#8686AC] focus:ring-opacity-20 transition-colors"
            aria-describedby="duration-help"
          />
          <small id="duration-help" className="text-sm text-gray-600">
            Minimum 1 heure
          </small>
        </div>

        {/* Nombre de participants */}
        <div className="space-y-2">
          <label htmlFor="participants" className="block font-semibold text-[#272757]">
            Nombre de participants
          </label>
          <input
            type="number"
            id="participants"
            value={participants}
            onChange={(e) => setParticipants(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            step="1"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8686AC] focus:ring-2 focus:ring-[#8686AC] focus:ring-opacity-20 transition-colors"
            aria-describedby="participants-help"
          />
          <small id="participants-help" className="text-sm text-gray-600">
            Minimum 1 participant
          </small>
        </div>

        {/* Options supplémentaires */}
        <fieldset className="space-y-3">
          <legend className="font-semibold text-[#272757] mb-3">Options supplémentaires</legend>

          <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={maquettage}
              onChange={(e) => setMaquettage(e.target.checked)}
              className="w-5 h-5 text-[#272757] border-gray-300 rounded focus:ring-[#8686AC] focus:ring-2 cursor-pointer"
            />
            <span className="flex-1">Maquettage (+20% du coût de base)</span>
          </label>

          <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={visite}
              onChange={(e) => setVisite(e.target.checked)}
              className="w-5 h-5 text-[#272757] border-gray-300 rounded focus:ring-[#8686AC] focus:ring-2 cursor-pointer"
            />
            <span className="flex-1">Visite d'entreprise (+500€)</span>
          </label>

          <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={expert}
              onChange={(e) => setExpert(e.target.checked)}
              className="w-5 h-5 text-[#272757] border-gray-300 rounded focus:ring-[#8686AC] focus:ring-2 cursor-pointer"
            />
            <span className="flex-1">Intervenant expert spécialisé (+300€)</span>
          </label>

          <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={materiel}
              onChange={(e) => setMateriel(e.target.checked)}
              className="w-5 h-5 text-[#272757] border-gray-300 rounded focus:ring-[#8686AC] focus:ring-2 cursor-pointer"
            />
            <span className="flex-1">Matériel spécifique requis (+200€)</span>
          </label>
        </fieldset>

        {/* Message d'erreur */}
        {error && (
          <div
            className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm animate-slide-down"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Bouton de calcul */}
        <button
          type="submit"
          className="w-full bg-[#272757] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#505081] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#8686AC] focus:ring-opacity-50"
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
        <h2 className="text-2xl font-bold text-[#272757] mb-6 pb-3 border-b-4 border-[#8686AC]">
          Estimation du coût
        </h2>
        <div className="text-center py-12 text-gray-500 text-lg">
          Configurez votre challenge pour voir l'estimation
        </div>
        <PricingInfo />
      </section>
    );
  }

  return (
    <section className="bg-blanc-teinte p-6 md:p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-[#272757] mb-6 pb-3 border-b-4 border-[#8686AC]">
        Estimation du coût
      </h2>

      <div className="space-y-3 animate-fade-in">
        {/* Coût de base */}
        <div className="flex justify-between items-center py-3">
          <span className="font-medium text-gray-700">Sous-total (coût de base)</span>
          <span className="font-semibold text-lg text-[#272757]">
            {formatCurrency(results.coutBase)}
          </span>
        </div>

        {/* Maquettage */}
        {results.hasMaquettage && (
          <div className="flex justify-between items-center py-3">
            <span className="font-medium text-gray-700">Montant Maquettage</span>
            <span className="font-semibold text-lg text-[#272757]">
              {formatCurrency(results.montantMaquettage)}
            </span>
          </div>
        )}

        {/* Options fixes */}
        {results.hasOptions && (
          <div className="flex justify-between items-center py-3">
            <span className="font-medium text-gray-700">Options fixes</span>
            <span className="font-semibold text-lg text-[#272757]">
              {formatCurrency(results.montantOptions)}
            </span>
          </div>
        )}

        <div className="border-t border-gray-200 my-2"></div>

        {/* Sous-total avant TVA */}
        <div className="flex justify-between items-center py-3">
          <span className="font-medium text-gray-700">Sous-total avant TVA</span>
          <span className="font-semibold text-lg text-[#272757]">
            {formatCurrency(results.soustotalAvantTva)}
          </span>
        </div>

        {/* TVA */}
        <div className="flex justify-between items-center py-3">
          <span className="font-medium text-gray-700">TVA (20%)</span>
          <span className="font-semibold text-lg text-[#272757]">
            {formatCurrency(results.montantTva)}
          </span>
        </div>

        <div className="border-t-2 border-gray-300 my-2"></div>

        {/* Total TTC */}
        <div className="flex justify-between items-center py-4 px-4 bg-[#272757] text-white rounded-lg animate-pulse-subtle">
          <span className="font-bold text-xl">Total TTC</span>
          <span className="font-bold text-2xl">
            {formatCurrency(results.totalTtc)}
          </span>
        </div>

        {/* Bouton de paiement */}
        <button
          onClick={onPayment}
          className="w-full mt-6 bg-[#8686AC] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#505081] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-[#8686AC] focus:ring-opacity-50"
        >
          Procéder au paiement
        </button>
      </div>

      <PricingInfo />
    </section>
  );
};

// ============================================
// COMPOSANT INFO TARIFICATION
// ============================================

const PricingInfo = () => {
  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg border-l-4 border-[#8686AC]">
      <h3 className="text-xl font-bold text-[#272757] mb-4">
        📋 Tarification Vizion Academy
      </h3>
      <ul className="space-y-2 text-gray-800">
        <li>• Tarif de base : 70€/heure</li>
        <li>• Maquettage : +20% du coût de base</li>
        <li>• TVA : 20% sur le montant total</li>
        <li>• Options : Visites, experts, matériel</li>
        <li>• Paiement : Sécurisé via Stripe</li>
        <li>• Facturation : Automatisée</li>
      </ul>
      <p className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
        <strong>Note :</strong> Le tarif de base est calculé par heure et par participant.
      </p>
    </div>
  );
};

// ============================================
// COMPOSANT FOOTER
// ============================================

const Footer = () => {
  const navigationSections = [
    {
      title: 'Navigation',
      links: [
        { name: 'Présentation', href: '#presentation' },
        { name: 'Trouver un intervenant', href: '#trouver' },
        { name: 'Dashboard École', href: '#dashboard-ecole' }
      ]
    },
    {
      title: 'Présentation',
      links: [
        { name: 'Voir les challenges', href: '#challenges' },
        { name: 'Simuler un coût', href: '#simuler' }
      ]
    },
    {
      title: 'Présentation',
      links: [
        { name: 'Devenir Intervenant', href: '#devenir' },
        { name: 'Dashboard Intervenant', href: '#dashboard-intervenant' },
        { name: 'Mur des missions', href: '#missions' }
      ]
    }
  ];

  return (
    <footer className="bg-[#0F0E47] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Logo et tagline */}
        <div className="text-center mb-10">
          <div className="text-2xl font-bold mb-3">Vizion Academy Logo</div>
          <p className="text-gray-300 text-lg">
            Mise en relation entre experts et établissements d'enseignement.
          </p>
        </div>

        {/* Grille de navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {navigationSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-bold text-lg mb-3 text-[#8686AC]">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-[#8686AC]">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="mailto:secretariat@vizionacademy.fr"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  secretariat@vizionacademy.fr
                </a>
              </li>
              <li>
                <a
                  href="tel:+33659196550"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  06 59 19 65 50
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Section légale */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div>
            <h3 className="font-bold text-[#8686AC] mb-2">Légal</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <a href="#mentions" className="text-gray-300 hover:text-white transition-colors">
                Mentions Légales
              </a>
              <a href="#confidentialite" className="text-gray-300 hover:text-white transition-colors">
                Politique de confidentialité
              </a>
            </div>
          </div>
          <p className="text-gray-400">© 2025 Vizion Academy. Développé sur base44.</p>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// COMPOSANT MODAL DE PAIEMENT
// ============================================

const PaymentModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-2xl font-bold text-[#272757] mb-4">
          Paiement : Sécurisé via Stripe
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Cette fonctionnalité est une simulation. Dans un environnement de production, 
          vous seriez redirigé vers une page de paiement sécurisée Stripe.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-[#272757] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#505081] transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-[#8686AC] focus:ring-opacity-50"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

// ============================================
// COMPOSANT PRINCIPAL APP
// ============================================

function App() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const calculateQuote = (formData, silent = false) => {
    // Validation
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

    // Calcul
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

    // Scroll vers les résultats sur mobile (sauf en mode silent)
    if (!silent && window.innerWidth < 968) {
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SimulatorForm onCalculate={calculateQuote} error={error} />
          <div id="results-section">
            <ResultsDisplay 
              results={results} 
              onPayment={() => setIsPaymentModalOpen(true)} 
            />
          </div>
        </div>
      </main>

      <Footer />
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
      />
    </div>
  );
}

export default App;