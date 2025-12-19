import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { School, Users, Target, FileText, Award, HeadphonesIcon, CheckCircle } from 'lucide-react';
import logo from '../assets/logo.png';
import { ChevronDown } from 'lucide-react';
import MainNav from '../components/MainNav';
import banner from '../assets/banner.jpg';
import IntervenantModal from '../components/IntervenantModal';
import Footer from '../components/Footer';

export default function VizionAcademy() {
    const [dropdownOpen, setDropdownOpen] = React.useState(null);
    const [selectedIntervenant, setSelectedIntervenant] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Exemple d'intervenant pour le modal
    const exampleIntervenant = {
      id: 1,
      name: "Dr. Marie Dubois",
      expertise: "Intelligence Artificielle & Machine Learning",
      experience: "Senior (10+ ans)",
      location: "Paris",
      cities: ["Paris", "Lyon", "Remote"],
      rate: "650€/jour",
      rating: 4.9,
      reviews: 47,
      description: "Experte en IA avec plus de 10 ans d'expérience dans la recherche et l'industrie. Spécialisée dans le machine learning, deep learning et les applications pratiques de l'IA.",
      themes: ["Intelligence Artificielle", "Machine Learning", "Deep Learning", "Data Science", "Python", "TensorFlow"],
      languages: ["Français", "Anglais"],
      availability: "Disponible",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b742?w=400&h=400&fit=crop"
    };

    const handleOpenModal = () => {
      setSelectedIntervenant(exampleIntervenant);
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedIntervenant(null);
    };
    React.useEffect(() => {
      if (!dropdownOpen) return;
      const handleClick = (e) => {
        const nav = document.getElementById('main-nav');
        if (nav && !nav.contains(e.target)) {
          setDropdownOpen(null);
        }
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [dropdownOpen]);
  const benefits = [
    {
      icon: <Users className="w-6 h-6 text-bleu-intense" />,
      title: "Accès à un réseau d'experts vérifiés et qualifiés",
      description: "Des intervenants sélectionnés pour leur expertise et leur pédagogie"
    },
    {
      icon: <Target className="w-6 h-6 text-bleu-intense" />,
      title: "Processus de mise en relation simplifié et efficace",
      description: "Trouvez le bon expert en quelques clics"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-bleu-intense" />,
      title: "Challenges pédagogiques innovants clés en main",
      description: "Projets étudiants prêts à lancer pour vos programmes"
    },
    {
      icon: <FileText className="w-6 h-6 text-bleu-intense" />,
      title: "Prise en charge de la facturation des intervenants",
      description: "Simplifiez votre gestion administrative"
    },
    {
      icon: <Award className="w-6 h-6 text-bleu-intense" />,
      title: "Mandats de facturation pour tous les intervenants",
      description: "0 facture à faire"
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6 text-bleu-intense" />,
      title: "Support dédié tout au long de vos projets",
      description: "Une équipe à vos écoutes pour vous accompagner"
    }
  ];

  const themes = [
    "Marketing", "Intelligences artificielles", "RSE", "Communication",
    "Entrepreneuriat", "Digital", "Créativité", "Art",
    "Langues étrangères", "Finance"
  ];

  const schools = [
    "ESCP", "EM Lyon", "EDHEC", "CentraleSupélec", "Polytechnique", "ESSEC"
  ];

  const testimonials = [
    {
      text: "Vizion Academy nous a permis d'enrichir nos cours avec des intervenants de qualité exceptionnelle. Le processus est simple et efficace.",
      author: "Marie Dubois",
      position: "Directrice pédagogique, HEC Paris"
    },
    {
      text: "Les challenges proposés sont innovants et parfaitement adaptés à nos besoins pédagogiques. Nos étudiants sont très engagés.",
      author: "Thomas Martin",
      position: "Responsable formation, ESSEC"
    },
    {
      text: "Une plateforme qui facilite vraiment la mise en relation. Nous avons trouvé des experts de grande qualité pour nos programmes.",
      author: "Shopie Leroy",
      position: "Directrice, Scienca Po"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center overflow-hidden bg-white">
                <img src={logo} alt="Logo Vizion Academy" className="w-full h-full object-contain" />
              </div>
              <span className="font-semibold text-sm sm:text-base text-gray-900">Vizion<br/>Academy</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <MainNav />
            </nav>
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-bleu-nuit via-bleu-intense to-indigo-violet text-white py-28 overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <div className="absolute inset-0">
          <img src={banner} alt="Landing page background" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-br from-bleu-nuit/60 via-bleu-intense/50 to-indigo-violet/60"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 border border-white/30 shadow-lg">
              <span className="text-xs sm:text-sm font-semibold">🎓 Plateforme de mise en relation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 sm:mb-8 leading-tight px-4 relative">
              Entre <span className="text-yellow-400">immersion</span> et <span className="text-yellow-400">pédagogie</span>,<br className="hidden sm:block"/>
              <span className="relative inline-block">
                il y a Vizion Academy !
                <svg className="absolute -bottom-1 left-0 w-full h-3" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 10 Q150 3 300 10" stroke="#FCD34D" strokeWidth="4" fill="none" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-bleu-pastel mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Vous cherchez des intervenants compétents et passionnés ?<br className="hidden sm:block"/>
              Rejoignez notre communauté d'experts et d'établissements !
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
              <button 
                onClick={handleOpenModal}
                className="bg-white text-bleu-intense px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-bleu-pastel transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl text-sm sm:text-base"
              >
                Trouver un intervenant →
              </button>
              <button className="bg-indigo-violet backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-bleu-intense transition-all transform hover:scale-105 shadow-2xl border border-white/20 text-sm sm:text-base">
                Découvrir nos Challenges ✨
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto px-4">
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 sm:p-8 text-center border border-white/30 shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-3 text-beige-elegant">35+</div>
              <div className="text-bleu-pastel font-medium text-sm sm:text-base">Écoles partenaires</div>
            </div>
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 sm:p-8 text-center border border-white/30 shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-3 text-beige-elegant">10</div>
              <div className="text-bleu-pastel font-medium text-sm sm:text-base">Thématiques</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Why Choose Section */}
      <motion.section
        className="py-24 bg-gradient-to-b from-blanc-teinte to-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-bleu-pastel text-bleu-intense px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Nos avantages
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
              Pourquoi choisir <span className="bg-gradient-to-r from-bleu-intense to-indigo-violet bg-clip-text text-transparent">Vizion Academy</span> ?
            </h2>
            <p className="text-center text-bleu-nuit text-lg max-w-2xl mx-auto">
              Une plateforme pensée pour faciliter la collaboration entre écoles et experts
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all border border-bleu-pastel hover:border-indigo-violet transform hover:-translate-y-2 group">
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-br from-bleu-pastel to-blanc-teinte rounded-xl inline-block group-hover:scale-110 transition-transform">{benefit.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-bleu-nuit">{benefit.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Themes Section */}
      <motion.section
        className="py-24 bg-gradient-to-br from-bleu-pastel via-blanc-teinte to-beige-elegant/20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-beige-elegant/30 text-bleu-nuit px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Expertise
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
              Nos <span className="bg-gradient-to-r from-bleu-intense to-indigo-violet bg-clip-text text-transparent">thématiques</span> d'enseignement
            </h2>
            <p className="text-center text-bleu-nuit text-lg max-w-2xl mx-auto">
              Des experts dans tous les domaines clés de l'enseignement supérieur
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4">
            {themes.map((theme, index) => (
              <span key={index} className="bg-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full text-bleu-nuit font-semibold shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-bleu-pastel hover:border-indigo-violet transform hover:scale-110 text-xs sm:text-sm lg:text-base">
                {theme}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Partner Schools */}
      <motion.section
        className="py-24 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-bleu-pastel text-bleu-intense px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Partenaires
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
              Les <span className="bg-gradient-to-r from-bleu-intense to-indigo-violet bg-clip-text text-transparent">35 écoles</span> qui nous font confiance
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4">
            {schools.map((school, index) => (
              <div key={index} className="bg-gradient-to-br from-bleu-pastel to-blanc-teinte px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full text-bleu-intense font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-bleu-pastel hover:border-indigo-violet text-xs sm:text-sm lg:text-base">
                {school}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="py-24 bg-gradient-to-b from-blanc-teinte to-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-beige-elegant/30 text-bleu-nuit px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Témoignages
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
              Ils nous font <span className="bg-gradient-to-r from-bleu-intense to-indigo-violet bg-clip-text text-transparent">confiance</span>
            </h2>
            <p className="text-center text-bleu-nuit text-lg max-w-2xl mx-auto">
              Découvrez les témoignages de nos écoles partenaires
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border-l-4 border-indigo-violet transform hover:-translate-y-2">
                <div className="text-6xl text-bleu-pastel mb-4 font-serif">"</div>
                <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">{testimonial.text}</p>
                <div className="border-t border-bleu-pastel pt-4">
                  <div className="font-bold text-bleu-nuit text-lg">{testimonial.author}</div>
                  <div className="text-sm text-bleu-intense">{testimonial.position}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-28 bg-gradient-to-br from-bleu-nuit via-bleu-intense to-indigo-violet text-white relative overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
              Prêt à démarrer ?
            </h2>
            <p className="text-xl text-bleu-pastel max-w-2xl mx-auto">
              Rejoignez notre communauté d'écoles et d'experts
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-white/30 hover:bg-white/20 transition-all transform hover:scale-105 shadow-2xl">
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white/20 rounded-2xl inline-block">
                <School className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-3 sm:mb-4">Pour les écoles</h3>
              <p className="text-bleu-pastel mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                Accédez à notre réseau d'experts qualifiés et explorez vos projets innovants clés en main
              </p>
              <button 
                onClick={handleOpenModal}
                className="bg-white text-bleu-intense px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-beige-elegant transition-all w-full shadow-xl hover:shadow-2xl transform hover:scale-105 text-sm sm:text-base"
              >
                Trouver un intervenant →
              </button>
            </div>

            <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-white/30 hover:bg-white/20 transition-all transform hover:scale-105 shadow-2xl">
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white/20 rounded-2xl inline-block">
                <Users className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-3 sm:mb-4">Pour les intervenants</h3>
              <p className="text-bleu-pastel mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                Rejoignez notre communauté d'experts et partagez votre passion avec les étudiants
              </p>
              <button className="bg-beige-elegant text-bleu-nuit px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-blanc-teinte transition-all w-full shadow-xl hover:shadow-2xl transform hover:scale-105 text-sm sm:text-base">
                Créer un profil →
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer variant="blue" />

      {/* Modal Intervenant */}
      {isModalOpen && selectedIntervenant && (
        <IntervenantModal 
          intervenant={selectedIntervenant} 
          isOpen={isModalOpen}
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}
