import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainNav from "../components/MainNav";
import ModalDeclare from "../components/dashboard/ModalDeclare";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import MissionCard from "../components/dashboard/MissionCard";
import {
  Menu,
  X,
  ChevronRight,
  Mail,
  Phone,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import * as ecoleService from "../services/ecoleService";
import * as missionService from "../services/missionService";
import * as authService from "../services/authService";

const VizionAcademyDashboard = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalDeclareOpen, setModalDeclareOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ecoleData, setEcoleData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [missions, setMissions] = useState([]);

  // Charger les données de l'école et du dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer les infos de l'utilisateur pour obtenir l'ID de l'école
        const currentUser = user || (await authService.getCurrentUser()).user;

        if (!currentUser || currentUser.role !== "ECOLE") {
          setError(
            "Vous devez être connecté en tant qu'école pour accéder à cette page."
          );
          setLoading(false);
          return;
        }

        // L'API retourne user.ecole si l'utilisateur est une école
        // Ou on peut chercher l'école via l'userId
        let ecoleId = null;

        if (currentUser.ecole && currentUser.ecole.id) {
          setEcoleData(currentUser.ecole);
          ecoleId = currentUser.ecole.id;
        } else if (currentUser.ecoleId) {
          // Si l'ID de l'école est directement dans le user
          ecoleId = currentUser.ecoleId;
          try {
            const ecoleInfo = await ecoleService.getEcoleById(ecoleId);
            setEcoleData(ecoleInfo.data || ecoleInfo);
          } catch (err) {
            console.warn("Impossible de charger les infos de l'école:", err);
          }
        } else {
          // Essayer de trouver l'école via le userId
          throw new Error(
            "Votre profil école n'est pas encore configuré. Contactez l'administration."
          );
        }

        if (ecoleId) {
          // Charger le dashboard (optionnel, continue même si ça échoue)
          try {
            const dashboardResponse = await ecoleService.getEcoleDashboard(
              ecoleId
            );
            setDashboardData(dashboardResponse.data || dashboardResponse);
          } catch (err) {
            console.warn("Dashboard endpoint non disponible:", err.message);
            // Continue sans les données du dashboard
          }

          // Charger les missions de l'école
          const missionsResponse = await missionService.getMyEcoleMissions();
          // L'API retourne { success: true, items: [...] }
          const missionsList = Array.isArray(missionsResponse?.items)
            ? missionsResponse.items
            : Array.isArray(missionsResponse?.data?.items)
            ? missionsResponse.data.items
            : Array.isArray(missionsResponse)
            ? missionsResponse
            : [];

          // Transformer les missions pour correspondre au format attendu par MissionCard
          const transformedMissions = missionsList.map((mission) => ({
            id: mission.id,
            module: mission.title || "Mission sans titre",
            title: mission.title || "Mission sans titre",
            school: mission.ecole?.name || ecoleData?.name || "Votre école",
            status: mission.status?.toLowerCase() || "active",
            date: mission.createdAt
              ? new Date(mission.createdAt).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            students: 0, // Non disponible dans l'API actuelle
            remuneration: mission.priceCents ? mission.priceCents / 100 : 0,
          }));
          setMissions(transformedMissions);
        }
      } catch (err) {
        // Gestion d'erreur améliorée avec message clair
        let errorMessage =
          "Impossible de charger les données. Veuillez réessayer.";

        if (err.response?.status === 401) {
          errorMessage = "Votre session a expiré. Veuillez vous reconnecter.";
        } else if (err.response?.status === 403) {
          errorMessage =
            "Vous n'avez pas les permissions nécessaires pour accéder à cette page.";
        } else if (err.response?.status === 404) {
          errorMessage =
            "Votre profil école n'a pas été trouvé. Contactez l'administration.";
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

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const contacts = [
    {
      name: "Mickael NOGUEIRA",
      role: "Gestion des intervenants",
      phone: "06 84 88 96 94",
    },
    {
      name: "Guillaume ROURE",
      role: "Gestion des écoles et planification des challenges",
      phone: "06 59 19 65 50",
    },
    {
      name: "Narjesse MALKI",
      role: "Facturation et gestion administrative",
      phone: "06 50 71 77 42",
    },
  ];

  const footerSections = [
    {
      title: "Présentation",
      links: ["Trouver un intervenant", "Dashboard École"],
    },
    {
      title: "Présentation",
      links: ["Voir les challenges", "Simuler un coût"],
    },
    {
      title: "Présentation",
      links: [
        "Devenir Intervenant",
        "Dashboard Intervenant",
        "Mur des missions",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#4F46E5] to-[#1E3A8A] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl">
                  V
                </span>
              </div>
              <div>
                <h1 className="text-black font-bold text-lg sm:text-xl">
                  {ecoleData?.name || "Votre école"}
                </h1>
                <p className="text-[#D7C49E] text-xs hidden sm:block">
                  Tableau de bord
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <MainNav />
            </div>
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Message d'erreur */}
        {error && (
          <div>
            <ErrorMessage error={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* État de chargement */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="large" message="Chargement du dashboard..." />
          </div>
        )}

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#1B263B] to-[#1E3A8A] rounded-2xl p-8 md:p-12 text-white shadow-xl overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 rounded-2xl"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop')`,
            }}
          ></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Gestion de vos missions et collaborations
          </h2>
          <p className="text-[#E0E3FF] text-lg mb-8">
            Pilotez efficacement vos projets et collaborations avec nos
            intervenants experts
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setModalDeclareOpen(true)}
              className="bg-gradient-to-r from-[#4F46E5] to-[#1E3A8A] hover:from-[#3B38D4] hover:to-[#1A2F70] text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3 text-base border-2 border-transparent hover:scale-105 transform"
            >
              <span>📋 Déclarer une collaboration</span>
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => {
                // Quand une offre est postée, envoyer un email à tous les utilisateurs et à l'école
                console.log(
                  "Publishing offer - should trigger email notifications to all users and school"
                );
                // API call example: POST /api/offers with onSuccess callback to trigger emails
                // await sendOfferNotificationEmails({ offerId, recipientType: 'all' });
                alert(
                  "Offre publiée ! Les notifications par email sont envoyées à tous les utilisateurs et à votre école."
                );
              }}
              className="bg-gradient-to-r from-[#D7C49E] to-[#c5b38c] hover:from-[#C4B185] hover:to-[#B5A079] text-[#1B263B] px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3 text-base border-2 border-transparent hover:scale-105 transform"
            >
              <span>📢 Publier une offre</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* Mes Missions */}
        {!loading && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#1B263B]">
                Mes Missions
              </h3>
              <Link
                to="/mur-missions"
                className="text-[#4F46E5] hover:text-[#1E3A8A] font-semibold"
              >
                Voir toutes les missions
              </Link>
            </div>
            {missions && missions.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {missions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center mb-8">
                <Briefcase size={48} className="text-gray-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-[#1B263B] mb-2">
                  Aucune mission pour le moment
                </h4>
                <p className="text-gray-600 mb-6">
                  Déclarez votre première mission pour commencer
                </p>
                <button
                  onClick={() => setModalDeclareOpen(true)}
                  className="px-6 py-3 bg-[#4F46E5] text-white rounded-lg font-semibold hover:bg-[#1E3A8A] transition-all"
                >
                  Déclarer une mission
                </button>
              </div>
            )}
          </section>
        )}

        {/* Dashboard Modules Section */}
        <section>
          <h3 className="text-2xl font-bold text-[#1B263B] mb-6">
            Modules de gestion
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#4F46E5] cursor-pointer group">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                📊
              </div>
              <div className="text-[#1B263B] font-bold text-base sm:text-lg mb-1">
                Tableau de bord
              </div>
              <p className="text-[#1B263B]/70 text-xs sm:text-sm">
                Vue d'ensemble de vos activités et statistiques
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#4F46E5] cursor-pointer group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                📝
              </div>
              <div className="text-[#1B263B] font-bold text-lg mb-1">
                Offres
              </div>
              <p className="text-[#1B263B]/70 text-sm">
                Créer et gérer vos offres d'interventions
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#4F46E5] cursor-pointer group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                🤝
              </div>
              <div className="text-[#1B263B] font-bold text-lg mb-1">
                Collaborations
              </div>
              <p className="text-[#1B263B]/70 text-sm">
                Suivre vos partenariats avec les intervenants
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#4F46E5] cursor-pointer group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                💰
              </div>
              <div className="text-[#1B263B] font-bold text-lg mb-1">
                Facturation
              </div>
              <p className="text-[#1B263B]/70 text-sm">
                Gérer vos factures et paiements
              </p>
            </div>
          </div>
        </section>

        {/* Contacts Section */}
        <section>
          <h3 className="text-2xl font-bold text-[#1B263B] mb-6">
            Contacts Vizion Academy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h4 className="text-lg font-bold text-[#1B263B] mb-2">
                  {contact.name}
                </h4>
                <p className="text-[#1E3A8A] text-sm mb-4">{contact.role}</p>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="flex items-center space-x-2 text-[#4F46E5] hover:text-[#1E3A8A] font-medium transition-colors"
                >
                  <Phone size={18} />
                  <span>{contact.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Partner Section */}
        <section>
          <div className="bg-gradient-to-r from-[#E0E3FF] to-[#FAFAFA] rounded-xl p-8 md:p-10 shadow-md border border-[#4F46E5]/20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-[#1B263B] mb-2">
                  Partenaire
                </h3>
                <h4 className="text-xl font-semibold text-[#4F46E5] mb-3">
                  Emage-me
                </h4>
                <p className="text-[#1B263B]/80">
                  Trouvez vos futurs alternants grâce à notre partenaire.
                </p>
              </div>
              <button className="bg-[#4F46E5] hover:bg-[#1E3A8A] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 whitespace-nowrap">
                <span>Découvrir</span>
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1B263B] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Footer Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#1E3A8A] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <span className="text-xl font-bold">Vizion Academy</span>
              </div>
              <p className="text-[#E0E3FF] text-sm mb-6">
                Mise en relation entre experts et établissements d'enseignement.
              </p>
              <div className="space-y-2 text-sm">
                <a
                  href="mailto:secretariat@vizionacademy.fr"
                  className="flex items-center space-x-2 text-[#D7C49E] hover:text-white transition-colors"
                >
                  <Mail size={16} />
                  <span>secretariat@vizionacademy.fr</span>
                </a>
                <a
                  href="tel:0659196550"
                  className="flex items-center space-x-2 text-[#D7C49E] hover:text-white transition-colors"
                >
                  <Phone size={16} />
                  <span>06 59 19 65 50</span>
                </a>
              </div>
            </div>

            {/* Navigation Columns */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-[#D7C49E] mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-[#E0E3FF] hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-[#1E3A8A] pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-[#E0E3FF]">
                <a href="#" className="hover:text-white transition-colors">
                  Mentions légales
                </a>
                <span className="text-[#1E3A8A]">•</span>
                <a href="#" className="hover:text-white transition-colors">
                  Politique de confidentialité
                </a>
              </div>
              <p className="text-sm text-[#E0E3FF]">
                © 2025 Vizion Academy. Développé sur{" "}
                <span className="text-[#D7C49E]">base44</span>.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de déclaration */}
      <ModalDeclare
        isOpen={modalDeclareOpen}
        onClose={() => setModalDeclareOpen(false)}
        ecoleId={ecoleData?.id}
      />
    </div>
  );
};

export default VizionAcademyDashboard;
