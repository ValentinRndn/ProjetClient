import { useState, useEffect } from 'react';
import CostSimulator from '../components/CostSimulator';

// ============================================
// DONNÉES
// ============================================

const challenges = [
  {
    id: 1,
    title: 'Paperasse Poursuite',
    category: 'Entrepreneuriat',
    level: 'Intermédiaire',
    description: 'Là où la créativité rencontre les formalités. Un challenge unique où l\'entrepreneuriat rencontre la créativité.'
  },
  {
    id: 2,
    title: 'Cinem-IA',
    category: 'Intelligence Artificielle',
    level: 'Avancé',
    description: 'Créez votre film à l\'aide de l\'intelligence artificielle générative ! Une expérience immersive dans le monde du cinéma et de l\'IA.'
  },
  {
    id: 3,
    title: 'AI Magination',
    category: 'Intelligence Artificielle',
    level: 'Intermédiaire',
    description: 'Réalisez votre propre court métrage et boostez-le à l\'IA ! Mélangez créativité artistique et intelligence artificielle.'
  },
  {
    id: 4,
    title: 'Bizz L\'éclair',
    category: 'Entrepreneuriat',
    level: 'Intermédiaire',
    description: 'Vers l\'entrepreneuriat et au-delà ! Un challenge stimulant qui vous propulse dans l\'univers de la startup.'
  },
  {
    id: 5,
    title: 'Pro Player Manager',
    category: 'Innovation',
    level: 'Intermédiaire',
    description: 'Stratégie, Gestion, Victoire !!! Devenez le manager d\'une équipe e-sport et menez-la vers le sommet.'
  },
  {
    id: 6,
    title: 'Masterpiece Market',
    category: 'Art & Créativité',
    level: 'Débutant',
    description: 'Créez, valorisez et vendez de l\'art ! Plongez dans le monde du marketing artistique et apprenez à promouvoir vos créations.'
  },
  {
    id: 7,
    title: 'AccessTech',
    category: 'Accessibilité',
    level: 'Intermédiaire',
    description: 'Un Avenir Numérique Inclusif commence ici ! Concevez des solutions technologiques accessibles à tous.'
  },
  {
    id: 8,
    title: 'IA-cquisition',
    category: 'Intelligence Artificielle',
    level: 'Intermédiaire',
    description: 'L\'Avenir des campagnes marketing avec ChatGPT. Maîtrisez les outils d\'IA pour révolutionner vos stratégies marketing.'
  },
  {
    id: 9,
    title: 'CRE-AI',
    category: 'Intelligence Artificielle',
    level: 'Avancé',
    description: 'Suite Adobe VS Outils d\'Intelligence Artificielle. Comparez et maîtrisez les outils de création classiques et l\'IA.'
  },
  {
    id: 10,
    title: 'Fais Ton Fest',
    category: 'Innovation',
    level: 'Avancé',
    description: 'De l\'idée à la scène. Organisez votre propre festival de A à Z et développez vos compétences en événementiel.'
  }
];

const domains = [
  'Tous les domaines',
  'Entrepreneuriat',
  'Intelligence Artificielle',
  'Innovation',
  'Art & Créativité',
  'Accessibilité'
];

const levels = [
  'Tous les niveaux',
  'Débutant',
  'Intermédiaire',
  'Avancé'
];

// ============================================
// COMPOSANT HEADER
// ============================================

import MainNav from '../components/MainNav';

const Header = () => (
  <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16 sm:h-20">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#4F46E5] to-[#1E3A8A] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg sm:text-xl">V</span>
          </div>
          <span className="text-black font-bold text-lg sm:text-xl">Vizion Academy</span>
        </div>
        <div className="hidden md:block">
          <MainNav />
        </div>
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </header>
);

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#272757] via-[#505081] to-[#0F0E47] text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')`
        }}
      ></div>
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in px-4">
          Challenges Pédagogiques Clés en Main
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-3xl mx-auto px-4">
          Dynamisez l'apprentissage avec des projets engageants sur des thématiques actuelles.
        </p>
      </div>
    </section>
  );
};

// ============================================
// COMPOSANT FILTERS
// ============================================

const Filters = ({ selectedDomain, setSelectedDomain, selectedLevel, setSelectedLevel, resultCount }) => {
  return (
    <section className="bg-white border-b border-gray-200 sticky top-[72px] z-40 shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <div className="w-full sm:w-auto min-w-[200px]">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-2 border-[#272757] rounded-lg text-gray-900 font-medium cursor-pointer hover:border-[#505081] focus:outline-none focus:ring-2 focus:ring-[#8686AC] transition-all duration-300 text-sm sm:text-base"
                aria-label="Filtrer par domaine"
              >
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border-2 border-[#272757] rounded-lg text-gray-900 font-medium cursor-pointer hover:border-[#505081] focus:outline-none focus:ring-2 focus:ring-[#8686AC] transition-all duration-300"
                aria-label="Filtrer par niveau"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-gray-700 font-semibold text-lg">
            {resultCount} challenge{resultCount !== 1 ? 's' : ''} trouvé{resultCount !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// COMPOSANT CHALLENGE CARD
// ============================================

const ChallengeCard = ({ challenge, onSelect }) => {
  const getLevelColor = (level) => {
    switch (level) {
      case 'Débutant':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermédiaire':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Avancé':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Entrepreneuriat': 'bg-orange-100 text-orange-800 border-orange-300',
      'Intelligence Artificielle': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'Innovation': 'bg-teal-100 text-teal-800 border-teal-300',
      'Art & Créativité': 'bg-pink-100 text-pink-800 border-pink-300',
      'Accessibilité': 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-[#8686AC] transform hover:-translate-y-1 flex flex-col">
      <div className="bg-gradient-to-br from-[#272757] to-[#505081] p-6 text-white">
        <h3 className="text-2xl font-bold mb-3">{challenge.title}</h3>
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(challenge.category)} bg-white`}>
            {challenge.category}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getLevelColor(challenge.level)} bg-white`}>
            {challenge.level}
          </span>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <h4 className="text-xl font-semibold text-gray-900 mb-3">
          {challenge.title}
        </h4>
        <p className="text-gray-700 mb-6 flex-grow leading-relaxed">
          {challenge.description}
        </p>

        <button
          onClick={() => onSelect(challenge)}
          className="w-full bg-[#272757] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#505081] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#8686AC] focus:ring-offset-2"
          aria-label={`Voir le challenge ${challenge.title}`}
        >
          Voir le Challenge
        </button>
      </div>
    </article>
  );
};

// ============================================
// COMPOSANT CHALLENGE GRID
// ============================================

const ChallengeGrid = ({ challenges, onSelectChallenge }) => {
  return (
    <main className="container mx-auto px-4 py-12">
      {challenges.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600">Aucun challenge ne correspond à vos critères de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onSelect={onSelectChallenge}
            />
          ))}
        </div>
      )}
    </main>
  );
};

// ============================================
// COMPOSANT MODAL
// ============================================

const Modal = ({ challenge, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-[#272757] to-[#505081] text-white p-8 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-[#8686AC] transition-colors p-2 rounded-full hover:bg-white/10"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 id="modal-title" className="text-3xl font-bold mb-4 pr-8">
            {challenge.title}
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              {challenge.category}
            </span>
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              {challenge.level}
            </span>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            {challenge.title}
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {challenge.description}
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">À propos de ce challenge</h4>
            <p className="text-gray-600">
              Ce challenge pédagogique clé en main vous permet de dynamiser l'apprentissage avec un projet engageant sur une thématique actuelle.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex-1 bg-[#272757] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#505081] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#8686AC] focus:ring-offset-2"
              onClick={onClose}
            >
              Commencer le Challenge
            </button>
            <button
              className="flex-1 bg-white text-[#272757] py-3 px-6 rounded-lg font-semibold border-2 border-[#272757] hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#8686AC] focus:ring-offset-2"
              onClick={onClose}
            >
              Plus d'informations
            </button>
          </div>
        </div>
      </div>
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
      links: ['Présentation', 'Trouver un intervenant', 'Dashboard École']
    },
    {
      title: 'Présentation',
      links: ['Voir les challenges', 'Simuler un coût']
    },
    {
      title: 'Présentation',
      links: ['Devenir Intervenant', 'Dashboard Intervenant', 'Mur des missions']
    }
  ];

  return (
    <footer className="bg-[#0F0E47] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="text-2xl font-bold mb-4">Vizion Academy Logo</div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Mise en relation entre experts et établissements d'enseignement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {navigationSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-bold text-lg mb-4 text-[#8686AC]">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-bold text-lg mb-4 text-[#8686AC]">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="mailto:secretariat@vizionacademy.fr"
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2"
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
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2"
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

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Vizion Academy. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// COMPOSANT PRINCIPAL APP
// ============================================

function ViewChallenge() {
  const [selectedDomain, setSelectedDomain] = useState('Tous les domaines');
  const [selectedLevel, setSelectedLevel] = useState('Tous les niveaux');
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const filteredChallenges = challenges.filter(challenge => {
    const domainMatch = selectedDomain === 'Tous les domaines' || challenge.category === selectedDomain;
    const levelMatch = selectedLevel === 'Tous les niveaux' || challenge.level === selectedLevel;
    return domainMatch && levelMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <Filters
        selectedDomain={selectedDomain}
        setSelectedDomain={setSelectedDomain}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        resultCount={filteredChallenges.length}
      />
      <ChallengeGrid
        challenges={filteredChallenges}
        onSelectChallenge={setSelectedChallenge}
      />

      <section className="container mx-auto px-4 py-16">
        <CostSimulator />
      </section>

      <Footer />
      {selectedChallenge && (
        <Modal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
        />
      )}
    </div>
  );
}

export default ViewChallenge;
