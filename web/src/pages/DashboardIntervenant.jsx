import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  X,
  Briefcase,
  TrendingUp,
  FileText,
  CheckCircle,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

// Components
import MainNav from '../components/MainNav';
import Sidebar from '../components/dashboard/Sidebar';
import StatCard from '../components/dashboard/StatCard';
import MissionCard from '../components/dashboard/MissionCard';
import ContactCard from '../components/dashboard/ContactCard';
import ModalDeclare from '../components/dashboard/ModalDeclare';

// Data
import dashboardData from '../data/dashboardData.json';

/**
 * DashboardIntervenant - Page principale du dashboard intervenant
 * Interface complète pour gérer missions, facturation et contacts
 */
export default function DashboardIntervenant() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { stats, missions, contacts, partnerOffer, invoices } = dashboardData;

  // Stats pour les cartes
  const statsCards = [
    {
      icon: <Briefcase size={28} className="text-indigo-violet" />,
      value: stats.totalMissions,
      label: 'Missions totales',
      color: 'indigo-violet'
    },
    {
      icon: <TrendingUp size={28} className="text-blue-600" />,
      value: stats.activeMissions,
      label: 'En cours',
      color: 'blue-600'
    },
    {
      icon: <TrendingUp size={28} className="text-green-600" />,
      value: `${stats.revenue.toFixed(2)}€`,
      label: 'Chiffre d\'affaires',
      color: 'green-600'
    },
    {
      icon: <FileText size={28} className="text-purple-600" />,
      value: stats.invoices,
      label: 'Factures émises',
      color: 'purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-blanc-teinte">
      {/* Header avec navigation principale */}
      <header className="bg-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">V</span>
              </div>
              <div>
                <h1 className="text-bleu-nuit font-bold text-lg sm:text-xl">Vizion Academy</h1>
                <p className="text-indigo-violet text-xs hidden sm:block">Dashboard Intervenant</p>
              </div>
            </div>

            {/* Navigation principale (desktop) */}
            <div className="hidden lg:block">
              <MainNav />
            </div>

            {/* Burger menu (mobile) */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Ouvrir le menu"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Layout principal avec sidebar */}
      <div className="flex">
        {/* Sidebar navigation */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onDeclareClick={() => {
            setModalOpen(true);
            setSidebarOpen(false);
          }}
        />

        {/* Contenu principal */}
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {/* En-tête de page */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-2">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-bleu-nuit mb-2">
                  Intervenant
                </h1>
                <p className="text-base sm:text-lg text-gray-600">
                  Gérez vos missions et votre facturation
                </p>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-beige-elegant text-bleu-nuit rounded-lg font-bold hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base w-full lg:w-auto"
              >
                Déclarer une collaboration
              </button>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <p className="text-sm text-bleu-nuit">
                <strong>ℹ️ Info :</strong> Dès que vous validez une mission avec l'école, pensez à la déclarer ici pour générer automatiquement votre facturation.
              </p>
            </div>
          </div>

          {/* Cartes statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {statsCards.map((stat, index) => (
              <StatCard key={index} {...stat} index={index} />
            ))}
          </div>

          {/* Offre partenaire */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-beige-elegant to-yellow-300 rounded-2xl p-8 shadow-xl border-4 border-yellow-400">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-bleu-nuit mb-3">
                    {partnerOffer.title}
                  </h2>
                  <p className="text-bleu-nuit mb-4 leading-relaxed">
                    {partnerOffer.description}
                  </p>
                  <a
                    href={partnerOffer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-bleu-nuit text-white rounded-lg font-semibold hover:bg-bleu-nuit transition-all shadow-lg hover:shadow-xl"
                  >
                    {partnerOffer.buttonText}
                    <ExternalLink size={18} />
                  </a>
                </div>
                <div className="hidden lg:block">
                  <img
                    src="/mnt/data/2ad243b8-19b3-4f8e-8214-84dc4701e1b9.png"
                    alt="Offre partenaire"
                    className="w-48 h-48 object-cover rounded-xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mes Missions */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-bleu-nuit">Mes Missions</h2>
              <Link
                to="/mur-missions"
                className="flex items-center gap-2 text-indigo-violet hover:text-bleu-nuit font-semibold transition-colors"
              >
                Voir le Mur des missions
                <ArrowRight size={18} />
              </Link>
            </div>

            {missions && missions.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {missions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                <Briefcase size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-bleu-nuit mb-2">
                  Aucune mission pour le moment
                </h3>
                <p className="text-gray-600 mb-6">
                  Consultez le mur des missions pour découvrir les opportunités disponibles
                </p>
                <Link
                  to="/mur-missions"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-violet text-white rounded-lg font-semibold hover:bg-bleu-nuit transition-all shadow-md"
                >
                  Voir les missions disponibles
                  <ArrowRight size={18} />
                </Link>
              </div>
            )}
          </section>

          {/* Facturation */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-bleu-nuit mb-6">Facturation</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Résumé CA */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <p className="text-sm font-medium text-gray-600 mb-2">Chiffre d'affaires total</p>
                <p className="text-3xl font-bold text-bleu-nuit mb-4">{stats.revenue.toFixed(2)}€</p>
                <button className="text-indigo-violet hover:text-bleu-nuit font-semibold text-sm flex items-center gap-1">
                  Voir détails
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Factures en attente */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                <p className="text-sm font-medium text-gray-600 mb-2">Factures en attente</p>
                <p className="text-3xl font-bold text-bleu-nuit mb-4">0</p>
                <button className="text-indigo-violet hover:text-bleu-nuit font-semibold text-sm flex items-center gap-1">
                  Voir factures
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Générer facture */}
              <div className="bg-gradient-to-br from-indigo-violet to-bleu-nuit rounded-xl shadow-md p-6 text-white">
                <p className="text-sm font-medium mb-2 text-white opacity-90">Besoin d'une facture ?</p>
                <p className="text-2xl font-bold mb-4 text-white">Génération automatique</p>
                <button className="bg-beige-elegant text-bleu-nuit px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-all text-sm">
                  Générer une facture
                </button>
              </div>
            </div>
          </section>

          {/* Contacts Vizion Academy */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-bleu-nuit mb-6">
              Contacts Vizion Academy
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {contacts.map((contact, index) => (
                <ContactCard key={index} contact={contact} />
              ))}
            </div>
          </section>

          {/* Logo & Baseline */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-md p-8 text-center border-2 border-gray-200">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">V</span>
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-bleu-nuit">Vizion Academy</h3>
                  <p className="text-sm text-gray-600">
                    Mise en relation entre experts et établissements d'enseignement
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-bleu-nuit text-white rounded-xl p-8">
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
                  <li><Link to="/voir-challenges" className="hover:text-beige-elegant transition">Voir les challenges</Link></li>
                  <li><Link to="/simuler-cout" className="hover:text-beige-elegant transition">Simuler un coût</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3 text-beige-elegant">Intervenants</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/devenir-vizionner" className="hover:text-beige-elegant transition">Devenir Intervenant</Link></li>
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
          </footer>
        </main>
      </div>

      {/* Modal de déclaration */}
      <ModalDeclare
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
