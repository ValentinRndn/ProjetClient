import React, { useState } from 'react';
import MainNav from '../components/MainNav';
import IntervenantModal from '../components/IntervenantModal';
import { 
  Search, MapPin, BookOpen, Monitor, Mail, Phone, 
  Users, FileText, Mic, GraduationCap, Zap, Calendar,
  User, Filter, Receipt, Shield, CheckCircle, MessageCircle
} from 'lucide-react';
import banner from '../assets/banner.jpg';

export default function TrouverIntervenantPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedIntervenant, setSelectedIntervenant] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleIntervenantClick = (intervenant) => {
    setSelectedIntervenant(intervenant);
    setModalOpen(true);
  };

  const intervenants = [
    {
      id: 1,
      name: "Sophie Martin",
      displayName: "Sophie",
      format: "Distanciel",
      cities: ["Paris", "Île-de-France", "Lyon"],
      themes: ["Intelligence Artificielle", "Data Science", "Innovation"],
      languages: ["Français", "Anglais", "Espagnol"],
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Alexandre Dubois",
      displayName: "Alexandre",
      format: "Présentiel",
      cities: ["Lyon", "Rhône-Alpes", "Marseille"],
      themes: ["Entrepreneuriat", "Leadership", "Stratégie"],
      languages: ["Français", "Anglais"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Maria Garcia",
      displayName: "Maria",
      format: "Hybride",
      cities: ["Toulouse", "Occitanie", "Bordeaux"],
      themes: ["Design", "Innovation", "Communication"],
      languages: ["Français", "Espagnol", "Portugais"],
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
    },
    {
      id: 4,
      name: "Thomas Leroy",
      displayName: "Thomas",
      format: "Présentiel",
      cities: ["Nantes", "Pays de la Loire", "Rennes"],
      themes: ["Marketing", "Communication", "Vente"],
      languages: ["Français", "Anglais", "Allemand"],
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    },
    {
      id: 5,
      name: "Camille Rousseau",
      displayName: "Camille",
      format: "Distanciel",
      cities: ["Bordeaux", "Nouvelle-Aquitaine", "Toulouse"],
      themes: ["Finance", "Gestion de Projet", "Management"],
      languages: ["Français", "Anglais"],
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
    },
    {
      id: 6,
      name: "Guillaume ROURE",
      displayName: "Guillaume",
      format: "Hybride",
      cities: ["Lyon"],
      themes: ["Intelligence Artificielle", "Communication"],
      languages: ["Français", "Anglais", "Italien"],
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl">VA</span>
              </div>
              <div>
                <span className="font-bold text-lg sm:text-2xl text-gray-900">Vizion Academy</span>
                <p className="text-xs text-gray-500 hidden sm:block">Mise en relation entre experts et établissements d'enseignement</p>
              </div>
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={banner} alt="Background" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/60 via-purple-600/60 to-pink-500/60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block bg-yellow-400 text-gray-900 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-full text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 shadow-xl">
              🎉 100% GRATUIT !
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 px-4">
              Vous cherchez des intervenants<br className="hidden sm:block" />compétents et passionnés ?
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-indigo-100 max-w-4xl mx-auto mb-8 sm:mb-12 px-4">
              Tous les intervenants de la plateforme sont des professionnels de leur secteur d'activité.
            </p>
          </div>

          {/* Key Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 mx-auto">
                <Receipt className="w-6 h-6" />
              </div>
              <p className="text-center text-sm">
                Prise en charge de leur facturation pour faciliter votre gestion administrative.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 mx-auto">
                <Zap className="w-6 h-6" />
              </div>
              <p className="text-center text-sm">
                Un système d'urgence pour remplacer vos intervenants en cas de besoin.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-center text-sm">
                Pour les écoles partenaires, réservez un créneau de rencontre en moins de 2 minutes.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button className="bg-white text-indigo-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-indigo-50 transition shadow-2xl hover:shadow-3xl transform hover:scale-105">
              Voir les intervenants →
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filters - Simplified */}
      <section className="py-8 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Search Input */}
              <div className="md:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="🔍 Rechercher un intervenant..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Theme Filter */}
              <div className="relative">
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none bg-white cursor-pointer"
                >
                  <option value="all">📚 Toutes les thématiques</option>
                  {allThemes.map(theme => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none bg-white cursor-pointer"
                >
                  <option value="all">📍 Toutes les villes</option>
                  {allCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-center">
              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full font-semibold text-sm">
                ✨ {filteredIntervenants.length} intervenant(s) disponible(s)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Intervenants Grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredIntervenants.map((intervenant) => (
              <div
                key={intervenant.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
              >
                {/* Image Header */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
                  <img
                    src={intervenant.image}
                    alt={intervenant.name}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-semibold rounded-full">
                      <Monitor className="w-3 h-3 mr-1" />
                      {intervenant.format}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{intervenant.displayName}</h3>
                  
                  {/* Themes */}
                  <div className="mb-4">
                    <div className="flex items-start space-x-2 mb-2">
                      <BookOpen className="w-4 h-4 text-indigo-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Thématiques</p>
                        <div className="flex flex-wrap gap-1">
                          {intervenant.themes.map((theme, index) => (
                            <span key={index} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <div className="flex items-start space-x-2 mb-2">
                      <Users className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Langues parlées</p>
                        <div className="flex flex-wrap gap-1">
                          {intervenant.languages.map((language, index) => (
                            <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cities */}
                  <div className="mb-6">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Villes</p>
                        <p className="text-sm text-gray-700">{intervenant.cities.join(', ')}</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button 
                    onClick={() => handleIntervenantClick(intervenant)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-xl"
                  >
                    Voir le profil →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
            Que cherchez-vous ?
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Découvrez les différents formats d'intervention disponibles
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl group"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-md mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
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
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4 text-indigo-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Schools Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
            Écoles <span className="text-indigo-600">partenaires</span>
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Ils nous font confiance pour enrichir leurs formations
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {schools.map((school, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 flex items-center justify-center border border-indigo-100 hover:border-indigo-300 transition-all hover:shadow-md"
              >
                <span className="font-semibold text-indigo-700 text-sm text-center">{school}</span>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à enrichir vos formations ?
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            Découvrez notre réseau d'experts et trouvez l'intervenant idéal pour vos projets pédagogiques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-indigo-50 transition shadow-2xl hover:shadow-3xl transform hover:scale-105">
              Trouver un Intervenant →
            </button>
            <button className="bg-indigo-500/30 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-full text-lg font-bold hover:bg-indigo-500/40 transition shadow-xl">
              Nous Contacter
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-600">Une question ? N'hésitez pas à nous contacter</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6 mx-auto">
                <Mail className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">Email</h3>
              <a
                href="mailto:secretariat@vizionacademy.fr"
                className="text-indigo-600 hover:text-indigo-700 font-medium text-center block transition"
              >
                secretariat@vizionacademy.fr
              </a>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100">
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6 mx-auto">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">Téléphone</h3>
              <a
                href="tel:+33659196550"
                className="text-purple-600 hover:text-purple-700 font-medium text-center block transition"
              >
                06 59 19 65 50
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">VA</span>
              </div>
              <span className="font-bold text-xl">Vizion Academy</span>
            </div>

            <div className="flex space-x-8 text-sm">
              <a href="#" className="hover:text-indigo-400 transition">Mentions légales</a>
              <a href="#" className="hover:text-indigo-400 transition">Politique de confidentialité</a>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Vizion Academy. Développé sur <span className="text-indigo-400 font-semibold">base44</span>.</p>
          </div>
        </div>
      </footer>

      {/* Modal Intervenant */}
      <IntervenantModal 
        intervenant={selectedIntervenant}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}