import React, { useState } from 'react';
import MainNav from '../components/MainNav';
import { 
  Search, MapPin, BookOpen, Monitor, Mail, Phone, 
  Users, FileText, Mic, GraduationCap, Zap, Calendar,
  User, Filter, Receipt, Shield, MessageCircle,
  LayoutDashboard, Plus, FileCheck, UserCheck, DollarSign,
  TrendingUp, Eye, Edit, Trash2, Download
} from 'lucide-react';

export default function VizionAcademyPlatform() {
  const [currentView, setCurrentView] = useState('public'); // 'public' or 'dashboard'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');

  const intervenants = [
    {
      id: 1,
      name: "Sophie Martin",
      displayName: "Sophie",
      format: "Présentiel",
      cities: ["Paris", "Île-de-France", "Lyon"],
      themes: ["Intelligence Artificielle", "Data Science", "Innovation"],
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Alexandre Dubois",
      displayName: "Alexandre",
      format: "Présentiel",
      cities: ["Lyon", "Rhône-Alpes", "Marseille"],
      themes: ["Entrepreneuriat", "Leadership", "Stratégie"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Maria Garcia",
      displayName: "Maria",
      format: "Présentiel",
      cities: ["Toulouse", "Occitanie", "Bordeaux"],
      themes: ["Design", "Innovation", "Communication"],
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
    },
    {
      id: 4,
      name: "Thomas Leroy",
      displayName: "Thomas",
      format: "Présentiel",
      cities: ["Nantes", "Pays de la Loire", "Rennes"],
      themes: ["Marketing", "Communication", "Vente"],
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    },
    {
      id: 5,
      name: "Camille Rousseau",
      displayName: "Camille",
      format: "Présentiel",
      cities: ["Bordeaux", "Nouvelle-Aquitaine", "Toulouse"],
      themes: ["Finance", "Gestion de Projet", "Management"],
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
    },
    {
      id: 6,
      name: "Guillaume ROURE",
      displayName: "Guillaume",
      format: "Présentiel",
      cities: ["Lyon"],
      themes: ["Intelligence Artificielle", "Communication"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    }
  ];

  const filteredIntervenants = intervenants.filter(intervenant => {
    const matchesSearch = intervenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         intervenant.themes.some(theme => theme.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCity = selectedCity === 'all' || intervenant.cities.includes(selectedCity);
    const matchesTheme = selectedTheme === 'all' || intervenant.themes.includes(selectedTheme);
    const matchesFormat = selectedFormat === 'all' || intervenant.format === selectedFormat;
    
    return matchesSearch && matchesCity && matchesTheme && matchesFormat;
  });

  const allCities = [...new Set(intervenants.flatMap(i => i.cities))].sort();
  const allThemes = [...new Set(intervenants.flatMap(i => i.themes))].sort();
  const allFormats = [...new Set(intervenants.map(i => i.format))].sort();

  const useCases = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Discussion équipe",
      description: "Échanges collaboratifs avec vos équipes"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Modules de cours",
      description: "Les intervenants ont construit des modules de cours adaptables à vos objectifs pédagogiques"
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Conférences",
      description: "Des formats conférences à réserver directement auprès des intervenants"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Jurys d'examens",
      description: "Des profils aux compétences variées pour noter au mieux vos étudiants"
    }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Urgence intervizion",
      description: "Solution pour trouver un intervenant au dernier moment"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Réservation en ligne",
      description: "Rendez-vous depuis l'emploi du temps de l'intervenant"
    },
    {
      icon: <User className="w-6 h-6" />,
      title: "Pages personnalisées",
      description: "Profil, compétences, expérience, disponibilités"
    },
    {
      icon: <Filter className="w-6 h-6" />,
      title: "Système de filtre",
      description: "Simplifie la recherche"
    },
    {
      icon: <Receipt className="w-6 h-6" />,
      title: "Prise en charge de la facturation",
      description: "Gestion administrative prise en charge"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Intervenants de confiance",
      description: "Sélectionnés pour leur expertise et passion"
    }
  ];

  const schools = [
    "ISFJ", "Maestris", "ENGDE", "Momart", "PPA", "Icon", "ESAM", "ESIS",
    "eemi", "INSEEC", "ISCPA", "NEXA", "ICART", "MyDigitalSchool", "AMOS", "ECAM"
  ];

  const themes = [
    "Marketing", "Intelligences artificielles", "RSE", "Communication",
    "Entrepreneuriat", "Digital", "Créativité", "Art",
    "Langues étrangères", "Finance"
  ];

  const contacts = [
    {
      name: "Mickael NOGUEIRA",
      role: "Gestion des intervenants",
      phone: "06 84 88 96 94"
    },
    {
      name: "Guillaume ROURE",
      role: "Gestion écoles & planif challenges",
      phone: "06 59 19 65 50"
    },
    {
      name: "Narjesse MALKI",
      role: "Facturation & admin",
      phone: "06 50 71 77 42"
    }
  ];

  const dashboardKPIs = [
    { label: "Total de missions", value: "1", icon: <TrendingUp className="w-6 h-6" />, color: "bg-[#1B263B]" },
    { label: "Offres Publiées", value: "2", icon: <FileCheck className="w-6 h-6" />, color: "bg-[#1E3A8A]" },
    { label: "Collaborations", value: "3", icon: <UserCheck className="w-6 h-6" />, color: "bg-[#4F46E5]" },
    { label: "Factures émises", value: "1", icon: <DollarSign className="w-6 h-6" />, color: "bg-[#D7C49E]" }
  ];

  const mockOffers = [
    { id: 1, title: "Intervention Marketing Digital", status: "Active", date: "2025-01-15", applicants: 5 },
    { id: 2, title: "Conférence IA", status: "Active", date: "2025-02-01", applicants: 3 }
  ];

  const mockCollaborations = [
    { id: 1, intervenant: "Sophie Martin", mission: "Module Data Science", status: "En cours", startDate: "2025-01-10" },
    { id: 2, intervenant: "Alexandre Dubois", mission: "Formation Leadership", status: "Planifié", startDate: "2025-02-05" },
    { id: 3, intervenant: "Thomas Leroy", mission: "Atelier Marketing", status: "Terminé", startDate: "2024-12-15" }
  ];

  const mockInvoices = [
    { id: 1, number: "FACT-2025-001", intervenant: "Sophie Martin", amount: "1,200€", status: "Payée", date: "2025-01-15" }
  ];

  // DASHBOARD VIEW
  const renderDashboardView = () => (
    <>
      {/* Dashboard Hero */}
      <section className="bg-gradient-to-br from-[#1B263B] to-[#1E3A8A] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard École</h1>
          <p className="text-gray-200">Gérez vos missions et collaborations avec les intervenants</p>
        </div>
      </section>

      {/* KPIs */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardKPIs.map((kpi, index) => (
              <div key={index} className={`${kpi.color} text-white rounded-2xl p-6 shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    {kpi.icon}
                  </div>
                  <span className="text-4xl font-bold">{kpi.value}</span>
                </div>
                <p className="text-sm font-medium opacity-90">{kpi.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mes Offres */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">Mes Offres de Mission</h2>
            <button className="flex items-center space-x-2 bg-[#272757] text-white px-6 py-3 rounded-xl hover:bg-[#0F0E47] transition shadow-md">
              <Plus className="w-5 h-5" />
              <span>Nouvelle offre</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Titre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Candidats</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockOffers.map((offer) => (
                  <tr key={offer.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-black font-medium">{offer.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {offer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{offer.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {offer.applicants} candidats
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="p-2 text-[#505081] hover:bg-[#8686AC]/10 rounded-lg transition">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Mes Collaborations */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-black">Mes Collaborations</h2>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Intervenant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mission</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Début</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockCollaborations.map((collab) => (
                  <tr key={collab.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-black font-medium">{collab.intervenant}</td>
                    <td className="px-6 py-4 text-gray-700">{collab.mission}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        collab.status === 'En cours' ? 'bg-blue-100 text-blue-700' :
                        collab.status === 'Planifié' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {collab.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{collab.startDate}</td>
                    <td className="px-6 py-4">
                      <button className="p-2 text-[#505081] hover:bg-[#8686AC]/10 rounded-lg transition">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Mes Factures */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-black">Mes Factures</h2>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Numéro</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Intervenant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Montant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-black font-medium">{invoice.number}</td>
                    <td className="px-6 py-4 text-gray-700">{invoice.intervenant}</td>
                    <td className="px-6 py-4 text-black font-bold">{invoice.amount}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{invoice.date}</td>
                    <td className="px-6 py-4">
                      <button className="p-2 text-[#505081] hover:bg-[#8686AC]/10 rounded-lg transition">
                        <Download className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Contacts Vizion Academy */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-black">Contacts Vizion Academy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contacts.map((contact, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-center w-12 h-12 bg-[#8686AC]/20 rounded-full mb-4 mx-auto">
                  <User className="w-6 h-6 text-[#272757]" />
                </div>
                <h3 className="text-lg font-bold text-black text-center mb-2">{contact.name}</h3>
                <p className="text-sm text-gray-600 text-center mb-3">{contact.role}</p>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="block text-[#505081] hover:text-[#272757] font-medium text-center transition"
                >
                  {contact.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partenaire Alternance */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#272757] to-[#505081] text-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Partenaire Alternance : Emage-me</h2>
            <p className="text-gray-200 mb-6">
              Trouvez vos futurs alternants grâce à notre partenaire.
            </p>
            <button className="bg-white text-[#272757] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
              Découvrir →
            </button>
          </div>
        </div>
      </section>
    </>
  );

  // PUBLIC PAGE VIEW
  const renderPublicView = () => (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1B263B] via-[#1E3A8A] to-[#4F46E5] text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')`
          }}
        ></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-full text-2xl font-bold mb-6 shadow-xl">
              🎉 100% GRATUIT !
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Vous cherchez des intervenants<br />compétents et passionnés ?
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-12">
              Tous les intervenants de la plateforme sont des professionnels de leur secteur d'activité.
            </p>
          </div>

          {/* Key Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 mx-auto">
                <Receipt className="w-6 h-6" />
              </div>
              <p className="text-center text-sm text-white">
                Prise en charge de leur facturation pour faciliter votre gestion administrative.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 mx-auto">
                <Zap className="w-6 h-6" />
              </div>
              <p className="text-center text-sm text-white">
                Un système d'urgence pour remplacer vos intervenants en cas de besoin.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-center text-sm text-white">
                Pour les écoles partenaires, réservez un créneau de rencontre en moins de 2 minutes.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button className="bg-white text-[#272757] px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition shadow-2xl transform hover:scale-105">
              Voir les intervenants →
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="lg:col-span-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#505081] focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#505081] focus:border-transparent transition appearance-none bg-white cursor-pointer"
                >
                  <option value="all">Toutes les villes</option>
                  {allCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#505081] focus:border-transparent transition appearance-none bg-white cursor-pointer"
                >
                  <option value="all">Toutes les thématiques</option>
                  {allThemes.map(theme => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Monitor className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#505081] focus:border-transparent transition appearance-none bg-white cursor-pointer"
                >
                  <option value="all">Tous les formats</option>
                  {allFormats.map(format => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center">
              <span className="inline-flex items-center px-6 py-2 bg-[#8686AC]/20 text-[#272757] rounded-full font-semibold">
                {filteredIntervenants.length} intervenant(s) trouvé(s)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Intervenants Grid */}
      <section className="py-20 px-4" style={{backgroundColor: '#E0E3FF'}}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredIntervenants.map((intervenant) => (
              <div
                key={intervenant.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="relative h-48 bg-gradient-to-br from-[#272757] to-[#505081] overflow-hidden">
                  <img
                    src={intervenant.image}
                    alt={intervenant.name}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 bg-white/90 backdrop-blur-sm text-[#272757] text-xs font-semibold rounded-full">
                      <Monitor className="w-3 h-3 mr-1" />
                      {intervenant.format}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-black mb-1">{intervenant.name}</h3>
                    <p className="text-sm text-gray-600">Prénom affiché : {intervenant.displayName}</p>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-start mb-2">
                      <MapPin className="w-4 h-4 text-[#505081] mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex flex-wrap gap-2">
                        {intervenant.cities.map((city, index) => (
                          <span key={index} className="text-sm text-black">
                            {city}{index < intervenant.cities.length - 1 ? ',' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-start mb-2">
                      <BookOpen className="w-4 h-4 text-[#505081] mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2">
                          {intervenant.themes.map((theme, index) => (
                            <span
                              key={index}
                              className="inline-block px-3 py-1 bg-[#8686AC]/20 text-[#272757] text-xs font-medium rounded-full"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-[#272757] text-white font-semibold py-3 rounded-xl hover:bg-[#0F0E47] transition-all duration-300 shadow-md hover:shadow-xl">
                    Voir le profil →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4" style={{backgroundColor: '#FAFAFA'}}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-black">
            Que cherchez-vous ?
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Découvrez les différents formats d'intervention disponibles
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-[#8686AC]/10 rounded-2xl p-8 border-2 border-[#8686AC]/30 hover:border-[#505081] transition-all duration-300 hover:shadow-xl group"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-md mb-6 text-[#272757] group-hover:scale-110 transition-transform">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{useCase.title}</h3>
                <p className="text-gray-700">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-black">
            Pourquoi nous rejoindre ?
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Des fonctionnalités pensées pour simplifier votre quotidien
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-[#8686AC]/20 rounded-xl mb-4 text-[#272757]">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-700 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Schools Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-black">
            Écoles <span className="text-[#505081]">partenaires</span>
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Ils nous font confiance pour enrichir leurs formations
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {schools.map((school, index) => (
              <div
                key={index}
                className="bg-[#8686AC]/10 rounded-xl p-4 flex items-center justify-center border border-[#8686AC]/20 hover:border-[#505081] transition-all hover:shadow-md"
              >
                <span className="font-semibold text-[#272757] text-sm text-center">{school}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-black">
            Nos <span className="text-[#505081]">thématiques</span>
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Des experts dans tous les domaines clés
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {themes.map((theme, index) => (
              <span
                key={index}
                className="px-6 py-3 bg-white text-gray-700 rounded-full font-medium shadow-md hover:shadow-lg transition-all hover:scale-105 border border-gray-100 cursor-pointer"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#1B263B] via-[#1E3A8A] to-[#4F46E5] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à enrichir vos formations ?
          </h2>
          <p className="text-xl text-gray-200 mb-10">
            Découvrez notre réseau d'experts et trouvez l'intervenant idéal pour vos projets pédagogiques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#272757] px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition shadow-2xl transform hover:scale-105">
              Trouver un Intervenant →
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/30 transition shadow-xl">
              Nous Contacter
            </button>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <div className="w-12 h-12 bg-gradient-to-br from-[#272757] to-[#505081] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">VA</span>
                </div>
                <span className="font-bold text-2xl text-black">Vizion Academy</span>
              </div>
              <p className="text-xs text-gray-600 ml-[60px]">Mise en relation entre experts et établissements d'enseignement</p>
            </div>
            <MainNav />
          </div>
        </div>
      </header>

      {/* Dynamic Content */}
      {currentView === 'public' ? renderPublicView() : renderDashboardView()}

      {/* Contact Section (Global) */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4">Contact</h2>
            <p className="text-gray-600">Une question ? N'hésitez pas à nous contacter</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#8686AC]/10 rounded-2xl p-8 border border-[#8686AC]/30">
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6 mx-auto">
                <Mail className="w-8 h-8 text-[#272757]" />
              </div>
              <h3 className="text-xl font-semibold text-black text-center mb-3">Email</h3>
              <a
                href="mailto:secretariat@vizionacademy.fr"
                className="text-[#505081] hover:text-[#272757] font-medium text-center block transition"
              >
                secretariat@vizionacademy.fr
              </a>
            </div>

            <div className="bg-[#8686AC]/10 rounded-2xl p-8 border border-[#8686AC]/30">
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6 mx-auto">
                <Phone className="w-8 h-8 text-[#272757]" />
              </div>
              <h3 className="text-xl font-semibold text-black text-center mb-3">Téléphone</h3>
              <a
                href="tel:+33659196550"
                className="text-[#505081] hover:text-[#272757] font-medium text-center block transition"
              >
                06 59 19 65 50
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#272757] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#272757] font-bold text-lg">VA</span>
              </div>
              <span className="font-bold text-xl">Vizion Academy</span>
            </div>

            <div className="flex space-x-8 text-sm">
              <a href="#" className="hover:text-[#8686AC] transition">Mentions légales</a>
              <a href="#" className="hover:text-[#8686AC] transition">Politique de confidentialité</a>
            </div>
          </div>

          <div className="border-t border-[#505081] mt-8 pt-8 text-center text-sm text-gray-300">
            <p>© 2025 Vizion Academy. Développé sur <span className="text-[#8686AC] font-semibold">base44</span>.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}