import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  RefreshCw,
  Grid,
  Plus
} from 'lucide-react';

/**
 * Sidebar - Navigation latérale du dashboard
 * Contient les liens de navigation et le bouton d'action rapide
 *
 * @param {boolean} isOpen - État d'ouverture (pour mobile)
 * @param {Function} onClose - Callback pour fermer (mobile)
 * @param {Function} onDeclareClick - Callback pour ouvrir modal déclaration
 */
export default function Sidebar({ isOpen, onClose, onDeclareClick }) {
  const location = useLocation();

  const navItems = [
    {
      icon: <RefreshCw size={20} />,
      label: 'Actualisation',
      path: '/dashboard-intervenant',
      badge: null
    },
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Tableau de bord',
      path: '/dashboard-intervenant',
      badge: null
    },
    {
      icon: <Briefcase size={20} />,
      label: 'Mes Missions',
      path: '/dashboard-intervenant/missions',
      badge: null
    },
    {
      icon: <Grid size={20} />,
      label: 'Mur des missions',
      path: '/mur-missions',
      badge: 'Nouveau'
    },
    {
      icon: <FileText size={20} />,
      label: 'Facturation',
      path: '/dashboard-intervenant/facturation',
      badge: null
    }
  ];

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header du sidebar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <h2 className="text-bleu-nuit font-bold text-lg">Vizion Academy</h2>
                <p className="text-xs text-bleu-pastel">Dashboard Intervenant</p>
              </div>
            </div>

            {/* Bouton CTA principal */}
            <button
              onClick={onDeclareClick}
              className="w-full bg-bleu-nuit text-white px-4 py-3 rounded-lg font-semibold hover:bg-bleu-nuit transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Déclarer une collaboration
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-indigo-violet text-white shadow-md'
                        : 'text-bleu-nuit hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-1 bg-beige-elegant text-bleu-nuit text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer du sidebar */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-br from-indigo-violet/10 to-bleu-pastel/10 rounded-lg p-4">
              <p className="text-xs text-bleu-nuit mb-2">
                <strong>Besoin d'aide ?</strong>
              </p>
              <p className="text-xs text-gray-600 mb-3">
                Contactez notre équipe support
              </p>
              <a
                href="mailto:secretariat@vizionacademy.fr"
                className="text-xs text-indigo-violet hover:text-bleu-nuit font-semibold underline"
              >
                secretariat@vizionacademy.fr
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
