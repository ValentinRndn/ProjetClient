import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

// Components
import MainNav from '../components/MainNav';
import ContactForm from '../components/contact/ContactForm';
import ContactInfo from '../components/contact/ContactInfo';
import TeamCard from '../components/contact/TeamCard';

/**
 * ContactPage - Page complète "Nous Contacter"
 * Layout 2 colonnes : formulaire à gauche, infos + équipe à droite
 */
export default function ContactPage() {
  const teamMembers = [
    {
      initial: 'M',
      name: 'Mickael NOGUEIRA',
      role: 'Gestion des intervenants',
      phone: '06 84 88 96 94',
      email: 'mickael.nogueira@vizionacademy.fr'
    },
    {
      initial: 'G',
      name: 'Guillaume ROURE',
      role: 'Gestion des écoles et planification des challenges',
      phone: '06 59 19 65 50',
      email: 'guillaume.roure@vizionacademy.fr'
    },
    {
      initial: 'N',
      name: 'Narjesse MALKI',
      role: 'Facturation et gestion administrative',
      phone: '06 50 71 77 42',
      email: 'narjesse.malki@vizionacademy.fr'
    }
  ];

  return (
    <div className="min-h-screen bg-blanc-teinte">
      {/* Header avec navigation principale */}
      <header className="bg-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <div>
                <h1 className="text-bleu-nuit font-bold text-xl">Vizion Academy</h1>
                <p className="text-indigo-violet text-xs">Nous Contacter</p>
              </div>
            </Link>

            {/* Navigation principale */}
            <MainNav />
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-violet/10 text-indigo-violet px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <MessageCircle size={18} />
            Contact
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-bleu-nuit mb-6">
            NOUS CONTACTER
          </h1>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-bleu-nuit mb-3">
              Vous avez des questions ?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Que vous ayez une question, une suggestion ou que vous souhaitiez simplement nous dire bonjour,
              nous sommes là pour vous aider. N'hésitez pas à nous contacter.
            </p>
          </div>
        </div>

        {/* Layout 2 colonnes : formulaire + infos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Colonne gauche : Formulaire */}
          <div>
            <ContactForm />
          </div>

          {/* Colonne droite : Infos + Équipe */}
          <div className="space-y-8">
            {/* Informations contact */}
            <ContactInfo />

            {/* Notre équipe */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-bleu-nuit mb-6">
                Notre équipe à votre service
              </h3>
              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <TeamCard key={index} member={member} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bloc logo & baseline */}
        <div className="bg-white rounded-2xl shadow-md p-8 text-center border-2 border-gray-200">
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
      <footer className="bg-bleu-nuit text-white mt-12">
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
    </div>
  );
}
