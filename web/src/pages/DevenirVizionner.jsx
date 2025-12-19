import React, { useState } from 'react';
import { ChevronDown, Check, User, FileText, Calendar, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainNav from '../components/MainNav';
import Footer from '../components/Footer';

// ============================================
// COMPOSANTS RÉUTILISABLES
// ============================================

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-bleu-pastel hover:border-indigo-violet transform hover:-translate-y-1">
    <div className="mb-6 p-4 bg-gradient-to-br from-beige-elegant/30 to-bleu-pastel/20 rounded-xl inline-block">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-bleu-nuit">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const TimelineStep = ({ number, title, description }) => (
  <div className="flex gap-6 items-start">
    <div className="flex-shrink-0">
      <div className="w-12 h-12 rounded-full bg-beige-elegant flex items-center justify-center text-bleu-nuit font-bold text-lg shadow-lg">
        {number}
      </div>
    </div>
    <div className="flex-1">
      <h4 className="text-lg font-bold text-bleu-nuit mb-2">{title}</h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

const FaqItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="bg-white rounded-xl border border-bleu-pastel overflow-hidden shadow-sm hover:shadow-md transition-all">
    <button
      className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-bleu-pastel/20 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-violet focus:ring-inset"
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      <span className="font-semibold text-bleu-nuit pr-4">{question}</span>
      <ChevronDown
        className={`w-5 h-5 text-indigo-violet transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        aria-hidden="true"
      />
    </button>
    <div
      className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
    >
      <div className="px-6 py-4 bg-gray-50 text-gray-700 leading-relaxed">
        {answer}
      </div>
    </div>
  </div>
);

const TestimonialCard = ({ name, role, text, avatar }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-beige-elegant">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-violet to-bleu-intense flex items-center justify-center text-white font-bold shadow-md">
        {avatar || name.charAt(0)}
      </div>
      <div>
        <div className="font-bold text-bleu-nuit">{name}</div>
        <div className="text-sm text-bleu-intense">{role}</div>
      </div>
    </div>
    <p className="text-gray-700 italic leading-relaxed">"{text}"</p>
  </div>
);

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function DevenirVizionner() {
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    {
      icon: <Award className="w-8 h-8 text-bleu-intense" />,
      title: "Valorisez votre expertise",
      description: "Partagez vos connaissances et votre expérience professionnelle avec la prochaine génération de talents."
    },
    {
      icon: <Calendar className="w-8 h-8 text-bleu-intense" />,
      title: "Flexibilité totale",
      description: "Choisissez vos créneaux et interventions selon votre emploi du temps et vos disponibilités."
    },
    {
      icon: <FileText className="w-8 h-8 text-bleu-intense" />,
      title: "Gestion simplifiée",
      description: "Nous prenons en charge toute la partie administrative : facturation, contrats et paiements."
    },
    {
      icon: <User className="w-8 h-8 text-bleu-intense" />,
      title: "Réseau professionnel",
      description: "Rejoignez une communauté d'experts passionnés et développez votre réseau professionnel."
    }
  ];

  const timelineSteps = [
    {
      number: "1",
      title: "Créez votre profil",
      description: "Remplissez votre profil en quelques minutes : domaines d'expertise, expérience, disponibilités."
    },
    {
      number: "2",
      title: "Validation de votre profil",
      description: "Notre équipe vérifie vos qualifications et valide votre profil sous 48h maximum."
    },
    {
      number: "3",
      title: "Recevez des opportunités",
      description: "Les écoles consultent votre profil et vous proposent des missions adaptées à votre expertise."
    },
    {
      number: "4",
      title: "Intervenez et partagez",
      description: "Acceptez les missions qui vous intéressent et transmettez votre savoir aux étudiants."
    }
  ];

  const faqs = [
    {
      question: "Quels sont les prérequis pour devenir Vizionner ?",
      answer: "Vous devez avoir au moins 3 ans d'expérience professionnelle dans votre domaine, une expertise reconnue et la passion de transmettre vos connaissances. Un niveau d'études minimum Bac+3 est recommandé."
    },
    {
      question: "Comment suis-je rémunéré pour mes interventions ?",
      answer: "La rémunération est fixée en accord avec l'école et dépend du type d'intervention, de la durée et de votre niveau d'expertise. Vizion Academy prend en charge toute la facturation et vous verse directement vos honoraires."
    },
    {
      question: "Puis-je choisir mes missions et mes horaires ?",
      answer: "Absolument ! Vous êtes totalement libre de choisir les missions qui vous intéressent et de définir vos disponibilités. Vous n'avez aucune obligation d'accepter toutes les propositions."
    },
    {
      question: "Quel type d'interventions puis-je réaliser ?",
      answer: "Les interventions sont variées : cours magistraux, ateliers pratiques, conférences, jurys d'examen, encadrement de projets étudiants, mentorat, etc. Tout dépend de votre expertise et des besoins des écoles."
    },
    {
      question: "Y a-t-il des frais pour s'inscrire ?",
      answer: "Non, l'inscription sur Vizion Academy est 100% gratuite pour les intervenants. Nous ne prenons aucune commission sur vos honoraires."
    }
  ];

  const testimonials = [
    {
      name: "Sophie Durand",
      role: "Experte Marketing Digital",
      text: "Vizion Academy m'a permis de partager ma passion avec des étudiants motivés. La plateforme simplifie vraiment toute la gestion administrative !"
    },
    {
      name: "Marc Lefebvre",
      role: "Consultant en Innovation",
      text: "Une expérience enrichissante ! J'interviens à mon rythme et je rencontre des jeunes talents pleins d'idées. Je recommande vivement."
    },
    {
      name: "Amina Belkacem",
      role: "Directrice RSE",
      text: "La flexibilité offerte par Vizion Academy est parfaite pour concilier mon activité professionnelle et ma passion pour l'enseignement."
    }
  ];

  return (
    <div className="min-h-screen bg-blanc-teinte">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="font-semibold text-gray-900">Vizion<br/>Academy</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <MainNav />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-bleu-nuit via-bleu-intense to-indigo-violet text-white py-20 lg:py-28 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')`
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texte à gauche */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block bg-beige-elegant text-bleu-nuit px-4 py-1 rounded-full text-sm font-semibold">
                    Rejoignez-nous
                  </span>
                  <span className="inline-block bg-beige-elegant text-bleu-nuit px-4 py-1 rounded-full text-sm font-semibold">
                    100% Gratuit
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                  Devenez<br />
                  <span className="bg-gradient-to-r from-beige-elegant to-bleu-pastel bg-clip-text text-transparent">
                    Vizionner
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-bleu-pastel leading-relaxed">
                  Partagez votre expertise avec la nouvelle génération<br className="hidden lg:block" />
                  et transmettez votre passion aux étudiants !
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/creer-profil-intervenant"
                  className="bg-beige-elegant text-bleu-nuit px-8 py-4 rounded-full font-bold hover:bg-blanc-teinte transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl inline-block"
                >
                  Créer mon profil →
                </Link>
                <button className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all shadow-xl">
                  En savoir plus
                </button>
              </div>
            </div>

            {/* Image à droite */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img
                  src="/mnt/data/2ad243b8-19b3-4f8e-8214-84dc4701e1b9.png"
                  alt="Intervenant Vizion Academy"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Décoration */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-beige-elegant rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-violet rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi devenir Vizionner */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-bleu-pastel text-bleu-intense px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Avantages
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-bleu-nuit mb-4">
              Pourquoi devenir <span className="text-indigo-violet">Vizionner</span> ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rejoignez une communauté d'experts passionnés et profitez de nombreux avantages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Comment rejoindre */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-beige-elegant/30 text-bleu-nuit px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Processus
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-bleu-nuit mb-4">
              Comment rejoindre <span className="text-indigo-violet">Vizion Academy</span> ?
            </h2>
            <p className="text-xl text-gray-600">
              4 étapes simples pour commencer votre aventure
            </p>
          </div>

          <div className="space-y-8">
            {timelineSteps.map((step, index) => (
              <div key={index}>
                <TimelineStep {...step} />
                {index < timelineSteps.length - 1 && (
                  <div className="ml-6 my-4 border-l-2 border-dashed border-bleu-pastel h-8"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-beige-elegant rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-beige-elegant/50">
            <h2 className="text-3xl md:text-4xl font-extrabold text-bleu-nuit mb-8 text-center">
              Conditions pour devenir Vizionner
            </h2>

              <div className="space-y-6 mb-8">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bleu-nuit text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="text-bleu-nuit font-medium">
                    <strong>Expertise professionnelle :</strong> Minimum 3 ans d'expérience dans votre domaine
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bleu-nuit text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="text-bleu-nuit font-medium">
                    <strong>Formation académique :</strong> Diplôme Bac+3 minimum recommandé ou expérience équivalente
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bleu-nuit text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="text-bleu-nuit font-medium">
                    <strong>Langues parlées :</strong> Indiquez les langues que vous maîtrisez pour vos interventions (Français, Anglais, Espagnol, etc.)
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bleu-nuit text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <p className="text-bleu-nuit font-medium">
                    <strong>Modalités d'intervention :</strong> Précisez si vous intervenez en distanciel, présentiel ou les deux
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bleu-nuit text-white flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <p className="text-bleu-nuit font-medium">
                    <strong>Passion pour la transmission :</strong> Envie de partager vos connaissances et d'accompagner les étudiants
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bleu-nuit text-white flex items-center justify-center font-bold">
                  6
                </div>
                <div>
                  <p className="text-bleu-nuit font-medium">
                    <strong>Disponibilité :</strong> Capacité à intervenir régulièrement ou ponctuellement selon vos préférences
                  </p>
                </div>
              </div>
            </div>            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-bleu-nuit">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0">
                  <Check className="w-6 h-6 text-bleu-nuit" />
                </div>
                <div>
                  <h3 className="font-bold text-bleu-nuit mb-2">Important à savoir</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Tous nos intervenants sont vérifiés et sélectionnés avec soin. Nous privilégions la qualité et l'adéquation entre votre profil et les besoins des établissements partenaires.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-bleu-pastel text-bleu-intense px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Questions fréquentes
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-bleu-nuit mb-4">
              Foire aux questions
            </h2>
            <p className="text-xl text-gray-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === index}
                onToggle={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-beige-elegant/30 text-bleu-nuit px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Témoignages
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-bleu-nuit mb-4">
              Ils sont déjà <span className="text-indigo-violet">Vizionners</span>
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les expériences de nos intervenants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-bleu-nuit via-bleu-intense to-indigo-violet">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Prêt à rejoindre l'aventure ?
          </h2>
          <p className="text-xl text-bleu-pastel mb-10 leading-relaxed">
            Créez votre profil dès maintenant et commencez à partager votre expertise<br className="hidden md:block" />
            avec les étudiants de demain !
          </p>
          <Link
            to="/creer-profil-intervenant"
            className="bg-beige-elegant text-bleu-nuit px-10 py-5 rounded-full text-lg font-bold hover:bg-blanc-teinte transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl inline-block"
          >
            Créer mon profil gratuitement →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer variant="blue" />
    </div>
  );
}
