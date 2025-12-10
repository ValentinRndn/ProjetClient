import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  Mail, 
  Phone, 
  Play,
  MapPin,
  Gift,
  Users,
  MessageSquare,
  FileText,
  Camera,
  Video,
  Star,
  CheckCircle2
} from 'lucide-react';
import MainNav from '../components/MainNav';

const VizionChallengesPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = ['Présentation', 'Challenges', 'Intervenants', 'Contact'];

  const processSteps = [
    {
      number: '01',
      title: 'Choisissez votre challenge',
      description: 'Parcourez notre catalogue et sélectionnez le challenge adapté à vos objectifs pédagogiques.'
    },
    {
      number: '02',
      title: 'Configurez vos paramètres',
      description: 'Nombre d\'étudiants, durée, options... Adaptez le challenge à votre contexte.'
    },
    {
      number: '03',
      title: 'Obtenez votre devis',
      description: 'Estimation instantanée avec tous les détails : coûts, planning, ressources.'
    },
    {
      number: '04',
      title: 'Lancez l\'expérience',
      description: 'Déployez le challenge avec l\'accompagnement de nos experts pédagogiques.'
    }
  ];

  const studentFeatures = [
    'Visualisation en temps réel des rendus et projets',
    'Accès aux informations de l\'équipe',
    'Consultation des consignes et ressources',
    'Système de feedback intégré'
  ];

  const intervenantFeatures = [
    'Accès à tout le contenu du challenge',
    'Messagerie pour répondre aux questions',
    'Publication d\'annonces en temps réel',
    'Suivi de la progression des équipes'
  ];

  const schoolFeatures = [
    'Récupération de tous les projets étudiants',
    'Export des notes et évaluations',
    'Accès aux documents de cadrage',
    'Bibliothèque photos et vidéos du challenge',
    'Compilation des feedbacks pour évaluation'
  ];

  const testimonials = [
    {
      name: 'Laura M.',
      challenge: 'Challenge IA, ESCP',
      text: 'Le challenge IA m\'a permis de comprendre concrètement les enjeux de l\'intelligence artificielle. C\'était beaucoup plus enrichissant qu\'un cours classique !'
    },
    {
      name: 'Pierre D.',
      challenge: 'Challenge Entrepreneuriat, HEC',
      text: 'Travailler sur un projet concret d\'entrepreneuriat nous a vraiment mis dans la peau d\'un créateur d\'entreprise. Une expérience immersive incroyable !'
    },
    {
      name: 'Emma R.',
      challenge: 'Challenge Communication, ESSEC',
      text: 'Les intervenants étaient vraiment pros et les lots à gagner nous ont super motivés ! On a appris en s\'amusant, c\'était génial.'
    }
  ];

  const footerSections = [
    {
      title: 'Présentation',
      links: ['Trouver un intervenant', 'Dashboard École']
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
    <div className="min-h-screen bg-[#FAFAFA]">
          {/* Header */}
          <header className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#1E3A8A] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">V</span>
                  </div>
                  <div>
                    <h1 className="text-black font-bold text-xl">NOM DE L'ÉCOLE</h1>
                    <p className="text-[#D7C49E] text-xs">Dashboard École</p>
                  </div>
                </div>
                <MainNav />
              </div>
            </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#E0E3FF] px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="block px-4 py-2 text-[#1B263B] hover:bg-[#E0E3FF] rounded-lg transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1B263B] to-[#1E3A8A] rounded-2xl p-6 sm:p-8 lg:p-16 text-white shadow-xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Vous voulez challenger vos étudiants ?
          </h1>
          <div className="space-y-4 text-[#E0E3FF] text-lg mb-8 max-w-3xl">
            <p className="flex items-start space-x-3">
              <CheckCircle2 className="flex-shrink-0 mt-1 text-[#D7C49E]" size={24} />
              <span>Alternance entre phases théoriques et pratiques</span>
            </p>
            <p className="flex items-start space-x-3">
              <CheckCircle2 className="flex-shrink-0 mt-1 text-[#D7C49E]" size={24} />
              <span>Méthodologie d'apprentissage par la pratique: "Learning By Doing"</span>
            </p>
            <p className="flex items-start space-x-3">
              <CheckCircle2 className="flex-shrink-0 mt-1 text-[#D7C49E]" size={24} />
              <span>Gestion et coordination de vos étudiants et des intervenants pendant la durée du challenge</span>
            </p>
            <p className="flex items-start space-x-3">
              <CheckCircle2 className="flex-shrink-0 mt-1 text-[#D7C49E]" size={24} />
              <span>Livrables et notations à la clé par un jury</span>
            </p>
            <p className="flex items-start space-x-3">
              <CheckCircle2 className="flex-shrink-0 mt-1 text-[#D7C49E]" size={24} />
              <span>Utilisez un de nos lieux au besoin</span>
            </p>
          </div>
          <button className="bg-[#4F46E5] hover:bg-[#D7C49E] hover:text-[#1B263B] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 text-lg">
            <span>Découvrir le catalogue</span>
            <ChevronRight size={24} />
          </button>
        </section>

        {/* Process Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B263B] mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-[#1E3A8A] text-lg max-w-2xl mx-auto">
              Un processus simple pour intégrer les challenges dans vos formations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full border-t-4 border-[#4F46E5]">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#E0E3FF] mb-3 sm:mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1B263B] mb-2 sm:mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#1E3A8A] text-sm sm:text-base">
                    {step.description}
                  </p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="text-[#4F46E5]" size={32} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Video Section */}
        <section className="bg-gradient-to-r from-[#E0E3FF] to-[#FAFAFA] rounded-xl p-8 md:p-12 border border-[#4F46E5]/20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[#1B263B] mb-4">
                Découvrez nos challenges en vidéo
              </h2>
              <p className="text-[#1E3A8A] mb-6">
                Plongez dans l'univers de nos challenges pédagogiques et découvrez comment nous révolutionnons l'apprentissage.
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <button className="w-32 h-32 bg-[#4F46E5] hover:bg-[#1E3A8A] rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110">
                <Play className="text-white ml-2" size={48} />
              </button>
            </div>
          </div>
        </section>

        {/* Venue Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="h-48 overflow-hidden">
              <img 
                src="/mnt/data/2ad243b8-19b3-4f8e-8214-84dc4701e1b9.png"
                alt="Lieu événementiel H7 Lyon"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <MapPin className="text-[#4F46E5]" size={32} />
                <h3 className="text-2xl font-bold text-[#1B263B]">Lieu événementiel</h3>
              </div>
              <h4 className="text-xl font-semibold text-[#4F46E5] mb-4">
                Chez toi ou chez moi ?
              </h4>
              <p className="text-[#1B263B] mb-4">
                Qui dit nouvelle pédagogie dit nouveau cadre !
              </p>
              <p className="text-[#1E3A8A]">
                Venez au <span className="font-bold text-[#4F46E5]">H7</span>, lieu totem du digital et de l'événementiel sur Lyon pouvant accueillir jusqu'à <span className="font-bold">400 personnes</span> !
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="h-48 overflow-hidden">
              <img 
                src="/mnt/data/2ad243b8-19b3-4f8e-8214-84dc4701e1b9.png"
                alt="Lots accessoires et sorties"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-gradient-to-br from-[#4F46E5] to-[#1E3A8A] p-8 text-white">
              <div className="flex items-center space-x-3 mb-6">
                <Gift className="text-[#D7C49E]" size={32} />
                <h3 className="text-2xl font-bold">Lots, accessoires et sorties !</h3>
              </div>
              <p className="text-[#E0E3FF] text-lg">
                VIZION ACADEMY fait en sorte que vos étudiants vivent une vraie expérience pédagogique en fournissant des lots à gagner, des accessoires et même des excursions possibles dans des musées et bien plus encore !
              </p>
            </div>
          </div>
        </section>

        {/* Challenge Manager Platform */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-block bg-[#4F46E5] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Expérience étudiante
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B263B] mb-4">
              Vizion Challenge Manager
            </h2>
            <p className="text-[#1E3A8A] text-lg max-w-3xl mx-auto mb-2">
              Gérez l'intégralité de votre challenge sur une seule plateforme
            </p>
            <p className="text-[#1E3A8A] max-w-3xl mx-auto">
              Un outil complet pour suivre et coordonner toutes les étapes du challenge en temps réel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Students */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-[#4F46E5] rounded-lg flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#1B263B]">Pour les étudiants</h3>
              </div>
              <ul className="space-y-3">
                {studentFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle2 className="text-[#4F46E5] flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-[#1E3A8A]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Intervenants */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-[#1E3A8A] rounded-lg flex items-center justify-center">
                  <MessageSquare className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#1B263B]">Pour les intervenants</h3>
              </div>
              <ul className="space-y-3">
                {intervenantFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle2 className="text-[#1E3A8A] flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-[#1E3A8A]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* School */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-[#D7C49E] rounded-lg flex items-center justify-center">
                  <FileText className="text-[#1B263B]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#1B263B]">Pour l'école</h3>
              </div>
              <ul className="space-y-3">
                {schoolFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle2 className="text-[#D7C49E] flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-[#1E3A8A]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[#1E3A8A] text-lg font-medium">
              Un outil intuitif pour une gestion optimale du challenge de A à Z
            </p>
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B263B] mb-4">
              Feedbacks étudiants sur le challenge
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-[#D7C49E] fill-current" size={20} />
                  ))}
                </div>
                <p className="text-[#1E3A8A] mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t border-[#E0E3FF] pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#1E3A8A] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-[#1B263B]">{testimonial.name}</div>
                      <div className="text-sm text-[#1E3A8A]">Étudiant</div>
                      <div className="text-sm text-[#4F46E5]">{testimonial.challenge}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-[#E0E3FF] to-[#FAFAFA] rounded-2xl p-8 md:p-12 text-center border border-[#4F46E5]/20">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B263B] mb-4">
            Prêt à révolutionner vos formations ?
          </h2>
          <p className="text-[#1E3A8A] text-lg mb-8 max-w-2xl mx-auto">
            Découvrez notre catalogue de challenges et trouvez celui qui correspond parfaitement à vos objectifs pédagogiques.
          </p>
          <button className="bg-[#4F46E5] hover:bg-[#1E3A8A] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2 text-lg">
            <span>Découvrir le catalogue</span>
            <ChevronRight size={24} />
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1B263B] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                <a href="mailto:secretariat@vizionacademy.fr" className="flex items-center space-x-2 text-[#D7C49E] hover:text-white transition-colors">
                  <Mail size={16} />
                  <span>secretariat@vizionacademy.fr</span>
                </a>
                <a href="tel:0659196550" className="flex items-center space-x-2 text-[#D7C49E] hover:text-white transition-colors">
                  <Phone size={16} />
                  <span>06 59 19 65 50</span>
                </a>
              </div>
            </div>

            {/* Navigation Columns */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-[#D7C49E] mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-[#E0E3FF] hover:text-white transition-colors">
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
                <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
                <span className="text-[#1E3A8A]">•</span>
                <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
              </div>
              <p className="text-sm text-[#E0E3FF]">
                © 2025 Vizion Academy. Développé sur <span className="text-[#D7C49E]">base44</span>.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VizionChallengesPage;