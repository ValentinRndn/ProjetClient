import React from 'react';
import { Mail, Phone } from 'lucide-react';
import logo from '../assets/logo.png';

/**
 * Footer component with two variants:
 * - "blue" (default): Blue gradient background for most pages
 * - "gray": Gray background for the challenges page
 */
const Footer = ({ variant = 'blue' }) => {
  const isGray = variant === 'gray';

  const footerSections = [
    {
      title: 'Présentation',
      links: [
        { label: 'Trouver un intervenant', href: '/trouver-intervenant' },
        { label: 'Dashboard École', href: '/dashboard-ecole' }
      ]
    },
    {
      title: 'Challenges',
      links: [
        { label: 'Voir les challenges', href: '/challenges' },
        { label: 'Simuler un coût', href: '/simulation' }
      ]
    },
    {
      title: 'Intervenants',
      links: [
        { label: 'Devenir Intervenant', href: '/devenir-intervenant' },
        { label: 'Dashboard Intervenant', href: '/dashboard-intervenant' },
        { label: 'Mur des missions', href: '/missions' }
      ]
    }
  ];

  // Styles based on variant
  const styles = isGray
    ? {
        footer: 'bg-[#1B263B] text-white',
        logoContainer: 'bg-gradient-to-br from-[#4F46E5] to-[#1E3A8A]',
        description: 'text-[#E0E3FF]',
        sectionTitle: 'text-[#D7C49E]',
        link: 'text-[#E0E3FF] hover:text-white',
        contactLink: 'text-[#D7C49E] hover:text-white',
        border: 'border-[#1E3A8A]',
        copyright: 'text-[#E0E3FF]',
        accent: 'text-[#D7C49E]'
      }
    : {
        footer: 'bg-gradient-to-br from-bleu-nuit to-bleu-intense text-white',
        logoContainer: 'bg-gradient-to-br from-indigo-violet to-bleu-intense shadow-lg',
        description: 'text-bleu-pastel',
        sectionTitle: 'text-beige-elegant',
        link: 'text-bleu-pastel hover:text-beige-elegant',
        contactLink: 'text-bleu-pastel hover:text-beige-elegant',
        border: 'border-bleu-intense/30',
        copyright: 'text-bleu-pastel',
        accent: 'text-beige-elegant'
      };

  return (
    <footer className={`${styles.footer} py-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ${styles.logoContainer}`}>
                <img src={logo} alt="Logo Vizion Academy" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-xl">Vizion<br/>Academy</span>
            </div>
            <p className={`${styles.description} leading-relaxed mb-6`}>
              Mise en relation entre experts et établissements d'enseignement.
            </p>
            <div className="space-y-3">
              <a href="mailto:secretariat@vizionacademy.fr" className={`flex items-center space-x-2 ${styles.contactLink} transition`}>
                <Mail size={16} />
                <span>secretariat@vizionacademy.fr</span>
              </a>
              <a href="tel:0552198550" className={`flex items-center space-x-2 ${styles.contactLink} transition`}>
                <Phone size={16} />
                <span>05 52 19 85 50</span>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className={`font-bold text-lg mb-6 ${styles.sectionTitle}`}>{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className={`${styles.link} transition flex items-center gap-2`}>
                      <span>→</span> {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className={`border-t ${styles.border} pt-8 flex flex-col md:flex-row justify-between items-center text-sm`}>
          <p className={styles.copyright}>© 2025 Vizion Academy. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/mentions-legales" className={`${styles.link} transition`}>Mentions légales</a>
            <a href="/politique-confidentialite" className={`${styles.link} transition`}>Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
