import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MainNav() {
  const [dropdownOpen, setDropdownOpen] = React.useState(null);
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

  return (
    <nav className="hidden md:flex space-x-2 bg-white" id="main-nav">
      <div className="relative">
        <button
          className="text-bleu-nuit hover:text-bleu-intense hover:bg-bleu-pastel px-4 py-2 rounded-lg transition-all focus:outline-none flex items-center gap-2 font-medium"
          onClick={() => setDropdownOpen(dropdownOpen === 'ecole' ? null : 'ecole')}
        >
          Espace Écoles
          <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen === 'ecole' ? 'rotate-180' : ''}`} />
        </button>
        {dropdownOpen === 'ecole' && (
          <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-bleu-pastel z-50 overflow-hidden">
            <Link to="/presentation-ecole" className="block px-5 py-3 text-bleu-nuit hover:bg-gradient-to-r hover:from-bleu-pastel hover:to-blanc-teinte hover:text-bleu-intense transition-all font-medium">→ Présentation</Link>
            <Link to="/trouver-intervenant" className="block px-5 py-3 text-bleu-nuit hover:bg-gradient-to-r hover:from-bleu-pastel hover:to-blanc-teinte hover:text-bleu-intense transition-all font-medium">→ Trouver un intervenant</Link>
            <Link to="/dashboard-ecole" className="block px-5 py-3 text-bleu-nuit hover:bg-gradient-to-r hover:from-bleu-pastel hover:to-blanc-teinte hover:text-bleu-intense transition-all font-medium">→ Dashboard école</Link>
          </div>
        )}
      </div>
      <div className="relative">
        <button
          className="text-bleu-nuit hover:text-indigo-violet hover:bg-bleu-pastel px-4 py-2 rounded-lg transition-all focus:outline-none flex items-center gap-2 font-medium"
          onClick={() => setDropdownOpen(dropdownOpen === 'challenges' ? null : 'challenges')}
        >
          Challenges
          <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen === 'challenges' ? 'rotate-180' : ''}`} />
        </button>
        {dropdownOpen === 'challenges' && (
          <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-bleu-pastel z-50 overflow-hidden">
            <Link to="/presentation-challenge" className="block px-5 py-3 text-bleu-nuit hover:bg-gradient-to-r hover:from-bleu-pastel hover:to-beige-elegant/20 hover:text-indigo-violet transition-all font-medium">→ Présentation</Link>
            <Link to="/voir-challenges" className="block px-5 py-3 text-bleu-nuit hover:bg-gradient-to-r hover:from-bleu-pastel hover:to-beige-elegant/20 hover:text-indigo-violet transition-all font-medium">→ Voir les challenges</Link>
          </div>
        )}
      </div>
      <div className="relative">
        <button
          className="text-bleu-nuit hover:text-indigo-violet hover:bg-beige-elegant/30 px-4 py-2 rounded-lg transition-all focus:outline-none flex items-center gap-2 font-medium"
          onClick={() => setDropdownOpen(dropdownOpen === 'intervenant' ? null : 'intervenant')}
        >
          Espace Intervenant
          <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen === 'intervenant' ? 'rotate-180' : ''}`} />
        </button>
        {dropdownOpen === 'intervenant' && (
          <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-bleu-pastel z-50 overflow-hidden">
            <Link to="/devenir-vizionner" className="block px-5 py-3 text-bleu-nuit hover:bg-gradient-to-r hover:from-beige-elegant/20 hover:to-bleu-pastel hover:text-indigo-violet transition-all font-medium">→ Présentation</Link>
            <Link to="/creer-profil-intervenant" className="block px-5 py-3 text-bleu-nuit hover:bg-gradient-to-r hover:from-beige-elegant/20 hover:to-bleu-pastel hover:text-indigo-violet transition-all font-medium">→ Devenir intervenant</Link>
            <Link to="/dashboard-intervenant" className="block px-5 py-3 text-bleu-nuit hover:bg-gradient-to-r hover:from-beige-elegant/20 hover:to-bleu-pastel hover:text-indigo-violet transition-all font-medium">→ Dashboard intervenant</Link>
            <Link to="/mur-missions" className="block px-5 py-3 text-bleu-nuit hover:bg-gradient-to-r hover:from-beige-elegant/20 hover:to-bleu-pastel hover:text-indigo-violet transition-all font-medium">→ Mur des missions</Link>
          </div>
        )}
      </div>
      <Link to="/contact" className="text-bleu-nuit hover:text-bleu-intense hover:bg-bleu-pastel px-4 py-2 rounded-lg transition-all font-medium">Contact</Link>
    </nav>
  );
}
