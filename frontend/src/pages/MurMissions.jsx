import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, TrendingUp } from "lucide-react";

// Components
import MainNav from "../components/MainNav";
import SearchFilters from "../components/missions/SearchFilters";
import MissionCard from "../components/missions/MissionCard";
import ApplyModal from "../components/missions/ApplyModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";

// Services
import * as missionService from "../services/missionService";
import * as ecoleService from "../services/ecoleService";

// Data (tranches de taux horaire pour les filtres)
const rateRanges = [
  { label: "Tous les taux", min: 0, max: Infinity },
  { label: "0 - 50€/h", min: 0, max: 50 },
  { label: "50 - 100€/h", min: 50, max: 100 },
  { label: "100 - 500€/h", min: 100, max: 500 },
  { label: "500€/h et +", min: 500, max: Infinity },
];

/**
 * MurMissions - Page catalogue des missions disponibles
 * Marketplace d'opportunités avec recherche, filtres et cartes missions
 */
export default function MurMissions() {
  // State pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("Toutes les écoles");
  const [rateFilterIndex, setRateFilterIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ACTIVE");

  // State pour les données
  const [missions, setMissions] = useState([]);
  const [schools, setSchools] = useState(["Toutes les écoles"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ take: 50, skip: 0 });

  // State pour le modal de candidature
  const [selectedMission, setSelectedMission] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Charger les écoles au démarrage (endpoint public)
  useEffect(() => {
    const loadSchools = async () => {
      try {
        const response = await ecoleService.getPublicEcoles();
        const ecolesList = Array.isArray(response)
          ? response
          : response.data || [];
        const schoolNames = [
          "Toutes les écoles",
          ...ecolesList.map((ecole) => ecole.name),
        ];
        setSchools(schoolNames);
      } catch (err) {
        console.error("Erreur lors du chargement des écoles:", err);
        // En cas d'erreur, on garde au moins "Toutes les écoles"
        setSchools(["Toutes les écoles"]);
      }
    };
    loadSchools();
  }, []);

  // Charger les missions depuis l'API
  useEffect(() => {
    const loadMissions = async () => {
      try {
        setLoading(true);
        setError(null);

        const filters = {
          take: pagination.take,
          skip: pagination.skip,
        };

        // Ajouter le filtre de statut seulement s'il est défini et non vide
        if (statusFilter && statusFilter !== "") {
          filters.status = statusFilter;
        }

        // Ajouter le filtre de recherche textuelle si présent
        if (searchTerm) {
          filters.q = searchTerm;
        }

        // Ajouter le filtre d'école si sélectionné
        if (schoolFilter !== "Toutes les écoles") {
          // Chercher l'ID de l'école par son nom
          try {
            const ecolesResponse = await ecoleService.getAllEcoles();
            const ecolesList = ecolesResponse.data || ecolesResponse;
            const selectedEcole = ecolesList.find(
              (ecole) => (ecole.name || ecole.ecole?.name) === schoolFilter
            );
            if (selectedEcole) {
              filters.ecoleId = selectedEcole.id;
            }
          } catch (err) {
            console.error("Error finding school:", err);
          }
        }

        const response = await missionService.getAllMissions(filters);
        // L'API retourne { success: true, items: [...] }
        const missionsList = Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response?.data?.items)
          ? response.data.items
          : Array.isArray(response)
          ? response
          : [];

        // Transformer les données pour correspondre au format attendu par les composants
        const transformedMissions = missionsList.map((mission) => {
          // Calculer la durée en jours si les dates sont disponibles
          let duration = "Non spécifié";
          let volume = 0;

          if (mission.endDate && mission.startDate) {
            const start = new Date(mission.startDate);
            const end = new Date(mission.endDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            duration =
              days > 0 ? `${days} jour${days > 1 ? "s" : ""}` : "Non spécifié";
            // Estimation du volume : 1 jour = 7h par défaut
            volume = days * 7;
          }

          // Calculer le montant total
          const hourlyRate = mission.priceCents ? mission.priceCents / 100 : 0;
          const totalAmount =
            volume > 0 && hourlyRate > 0
              ? volume * hourlyRate
              : (mission.priceCents || 0) / 100;

          // Déterminer le statut pour l'affichage (mapping API -> UI)
          const statusMapping = {
            active: "open",
            draft: "pending",
            completed: "closed",
          };
          const displayStatus =
            statusMapping[mission.status?.toLowerCase()] || "open";

          return {
            id: mission.id,
            title: mission.title || "Mission sans titre",
            description:
              mission.description || "Aucune description disponible.",
            school: mission.ecole?.name || "École inconnue",
            status: displayStatus,
            hourlyRate: hourlyRate,
            totalAmount: totalAmount,
            volume: volume,
            datePosted: mission.createdAt
              ? new Date(mission.createdAt).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            location: mission.location || "Non spécifié",
            duration: duration,
            level: "Intermédiaire", // Par défaut, peut être enrichi plus tard
            tags: Array.isArray(mission.tags) ? mission.tags : [],
          };
        });

        setMissions(transformedMissions);
      } catch (err) {
        // Gestion d'erreur améliorée avec message clair
        let errorMessage =
          "Impossible de charger les missions. Veuillez réessayer.";

        if (err.response?.status === 401) {
          errorMessage = "Votre session a expiré. Veuillez vous reconnecter.";
        } else if (err.response?.status === 403) {
          errorMessage = "Vous n'avez pas les permissions nécessaires.";
        } else if (err.response?.status === 404) {
          errorMessage = "Aucune mission trouvée avec ces critères.";
        } else if (err.message) {
          errorMessage = err.message;
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }

        setError(errorMessage);
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadMissions();
  }, [searchTerm, schoolFilter, statusFilter, pagination]);

  // Filtrer par taux horaire côté client (car l'API ne le supporte pas directement)
  const filteredMissions = missions.filter((mission) => {
    const rateRange = rateRanges[rateFilterIndex];
    return (
      mission.hourlyRate >= rateRange.min && mission.hourlyRate < rateRange.max
    );
  });

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
                <h1 className="text-bleu-nuit font-bold text-xl">
                  Vizion Academy
                </h1>
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
            Découvrez les dernières opportunités publiées par nos écoles
            partenaires.
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
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          schools={schools}
          rateRanges={rateRanges}
          resultsCount={filteredMissions.length}
        />

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6">
            <ErrorMessage error={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* État de chargement */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="large" message="Chargement des missions..." />
          </div>
        ) : filteredMissions.length > 0 ? (
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
              Aucune mission ne correspond à vos critères de recherche. Essayez
              de modifier vos filtres.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSchoolFilter("Toutes les écoles");
                setRateFilterIndex(0);
                setStatusFilter("ACTIVE");
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
            Créez votre profil pour accéder à toutes les missions et
            opportunités
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
              <h3 className="text-2xl font-bold text-bleu-nuit">
                Vizion Academy
              </h3>
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
                <li>
                  <Link
                    to="/presentation-ecole"
                    className="hover:text-beige-elegant transition"
                  >
                    Présentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/trouver-intervenant"
                    className="hover:text-beige-elegant transition"
                  >
                    Trouver un intervenant
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard-ecole"
                    className="hover:text-beige-elegant transition"
                  >
                    Dashboard École
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-beige-elegant">Challenges</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/presentation-challenge"
                    className="hover:text-beige-elegant transition"
                  >
                    Présentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/voir-challenges"
                    className="hover:text-beige-elegant transition"
                  >
                    Voir les challenges
                  </Link>
                </li>
                <li>
                  <Link
                    to="/simuler-cout"
                    className="hover:text-beige-elegant transition"
                  >
                    Simuler un coût
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-beige-elegant">
                Intervenants
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/devenir-vizionner"
                    className="hover:text-beige-elegant transition"
                  >
                    Présentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/creer-profil-intervenant"
                    className="hover:text-beige-elegant transition"
                  >
                    Devenir Intervenant
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard-intervenant"
                    className="hover:text-beige-elegant transition"
                  >
                    Dashboard Intervenant
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mur-missions"
                    className="hover:text-beige-elegant transition"
                  >
                    Mur des missions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-beige-elegant">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:secretariat@vizionacademy.fr"
                    className="hover:text-beige-elegant transition"
                  >
                    secretariat@vizionacademy.fr
                  </a>
                </li>
                <li>
                  <a
                    href="tel:0659196550"
                    className="hover:text-beige-elegant transition"
                  >
                    06 59 19 65 50
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Mentions légales */}
          <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="flex gap-4">
              <a href="#" className="hover:text-beige-elegant transition">
                Mentions Légales
              </a>
              <span className="text-gray-400">—</span>
              <a href="#" className="hover:text-beige-elegant transition">
                Politique de confidentialité
              </a>
            </div>
            <div className="text-gray-400">
              © 2025 Vizion Academy. Développé sur{" "}
              <a
                href="https://base44.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-beige-elegant transition"
              >
                base44
              </a>
              .
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
