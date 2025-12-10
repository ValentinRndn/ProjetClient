import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, TrendingUp } from 'lucide-react';

// Components
import MainNav from '../components/MainNav';
import SearchFilters from '../components/missions/SearchFilters';
import MissionCard from '../components/missions/MissionCard';
import ApplyModal from '../components/missions/ApplyModal';

// Data
import { missionsData, schools, rateRanges } from '../data/missionsData';

/**
 * MurMissions - Page catalogue des missions disponibles
 * Marketplace d'opportunités avec recherche, filtres et cartes missions
 */
export default function MurMissions() {
  // State pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('Toutes les écoles');
  const [rateFilterIndex, setRateFilterIndex] = useState(0);

  // State pour le modal de candidature
  const [selectedMission, setSelectedMission] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filtrage des missions
  const filteredMissions = useMemo(() => {
    return missionsData.filter(mission => {
      // Filtre recherche textuelle (titre, description, école)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        mission.title.toLowerCase().includes(searchLower) ||
        mission.description.toLowerCase().includes(searchLower) ||
        mission.school.toLowerCase().includes(searchLower) ||
        mission.tags.some(tag => tag.toLowerCase().includes(searchLower));

      // Filtre école
      const matchesSchool =
        schoolFilter === 'Toutes les écoles' ||
        mission.school === schoolFilter;

      // Filtre taux horaire
      const rateRange = rateRanges[rateFilterIndex];
      const matchesRate =
        mission.hourlyRate >= rateRange.min &&
        mission.hourlyRate < rateRange.max;

      return matchesSearch && matchesSchool && matchesRate;
    });
  }, [searchTerm, schoolFilter, rateFilterIndex]);

  // Handler pour ouvrir le modal de candidature
  const handleApply = (mission) => {
    setSelectedMission(mission);
    setModalOpen(true);
  };

  // Handler pour clic sur tag (ajoute le tag à la recherche)
  const handleTagClick = (tag) => {
    setSearchTerm(tag);
  };

  return (
    <div className="min-h-screen bg-blanc-teinte">
      {/* Header avec navigation principale */}
      <header className="bg-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <div>
                <h1 className="text-bleu-nuit font-bold text-xl">Vizion Academy</h1>
                <p className="text-indigo-violet text-xs">Mur des Missions</p>
              </div>
            </div>

            {/* Navigation principale */}
            <MainNav />
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section */}
        <div className="text-center mb-12">
          <div className="inline-block bg-beige-elegant/20 text-bleu-nuit px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Opportunités
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-bleu-nuit mb-4">
            Mur des <span className="text-indigo-violet">Missions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les dernières opportunités publiées par nos écoles partenaires.
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          schoolFilter={schoolFilter}
          onSchoolChange={setSchoolFilter}
          rateFilterIndex={rateFilterIndex}
          onRateChange={setRateFilterIndex}
          schools={schools}
          rateRanges={rateRanges}
          resultsCount={filteredMissions.length}
        />

        {/* Grille de missions */}
        {filteredMissions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {filteredMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onApply={() => handleApply(mission)}
                onTagClick={handleTagClick}
              />
            ))}
          </div>
        ) : (
          // État vide
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center mb-12">
            <Briefcase size={64} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-bleu-nuit mb-2">
              Aucune mission trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              Aucune mission ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSchoolFilter('Toutes les écoles');
                setRateFilterIndex(0);
              }}
              className="px-6 py-3 bg-indigo-violet text-white rounded-lg font-semibold hover:bg-bleu-nuit transition-all shadow-md"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* CTA pour devenir intervenant */}
        <div className="bg-gradient-to-r from-bleu-nuit via-indigo-violet to-bleu-nuit rounded-2xl p-8 md:p-12 text-center shadow-2xl mb-12">
          <TrendingUp size={48} className="text-beige-elegant mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Vous n'êtes pas encore intervenant ?
          </h2>
          <p className="text-xl text-gray-200 mb-6">
            Créez votre profil pour accéder à toutes les missions et opportunités
          </p>
          <Link
            to="/creer-profil-intervenant"
            className="inline-block px-8 py-4 bg-beige-elegant text-bleu-nuit rounded-full font-bold hover:bg-yellow-300 transition-all shadow-2xl hover:shadow-3xl"
          >
            Créer mon profil gratuitement →
          </Link>
        </div>

        {/* Bloc logo & baseline */}
        <div className="bg-white rounded-2xl shadow-md p-8 text-center border-2 border-gray-200 mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">V</span>
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-bleu-nuit">Vizion Academy</h3>
              <p className="text-sm text-gray-600">
                Mise en relation entre experts et établissements d'enseignement.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-bleu-nuit text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Navigation footer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <h4 className="font-bold mb-3 text-beige-elegant">Écoles</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/presentation-ecole" className="hover:text-beige-elegant transition">Présentation</Link></li>
                <li><Link to="/trouver-intervenant" className="hover:text-beige-elegant transition">Trouver un intervenant</Link></li>
                <li><Link to="/dashboard-ecole" className="hover:text-beige-elegant transition">Dashboard École</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-beige-elegant">Challenges</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/presentation-challenge" className="hover:text-beige-elegant transition">Présentation</Link></li>
                <li><Link to="/voir-challenges" className="hover:text-beige-elegant transition">Voir les challenges</Link></li>
                <li><Link to="/simuler-cout" className="hover:text-beige-elegant transition">Simuler un coût</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-beige-elegant">Intervenants</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/devenir-vizionner" className="hover:text-beige-elegant transition">Présentation</Link></li>
                <li><Link to="/creer-profil-intervenant" className="hover:text-beige-elegant transition">Devenir Intervenant</Link></li>
                <li><Link to="/dashboard-intervenant" className="hover:text-beige-elegant transition">Dashboard Intervenant</Link></li>
                <li><Link to="/mur-missions" className="hover:text-beige-elegant transition">Mur des missions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-beige-elegant">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:secretariat@vizionacademy.fr" className="hover:text-beige-elegant transition">
                    secretariat@vizionacademy.fr
                  </a>
                </li>
                <li>
                  <a href="tel:0659196550" className="hover:text-beige-elegant transition">
                    06 59 19 65 50
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Mentions légales */}
          <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="flex gap-4">
              <a href="#" className="hover:text-beige-elegant transition">Mentions Légales</a>
              <span className="text-gray-400">—</span>
              <a href="#" className="hover:text-beige-elegant transition">Politique de confidentialité</a>
            </div>
            <div className="text-gray-400">
              © 2025 Vizion Academy. Développé sur <a href="https://base44.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-beige-elegant transition">base44</a>.
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de candidature */}
      {selectedMission && (
        <ApplyModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          mission={selectedMission}
        />
      )}
    </div>
  );
}
