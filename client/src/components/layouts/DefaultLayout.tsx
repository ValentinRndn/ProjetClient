import { Link, NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/shared/Dropdown";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/shared/Navbar";
import {
  ChevronDownIcon,
  LogOutIcon,
  Mail,
  Phone,
  LayoutDashboardIcon,
  MapPin,
  ArrowRight,
  Linkedin,
  GraduationCap,
  Trophy,
  Users,
} from "lucide-react";
import { PropsWithChildren } from "react";

export default function DefaultLayout({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Boutons du header (identiques pour tous)
  const headerButtons = [
    <Button
      key="contact-btn"
      onClick={() => navigate("/contact")}
      variant="primary"
      size="sm"
      className="bg-[#6d74b5] hover:bg-[#5a61a0] text-white"
    >
      Contact
    </Button>,
    ...(isAuthenticated
      ? [
          <Button
            key="dashboard-btn"
            onClick={() => navigate("/dashboard")}
            variant="ghost"
            size="sm"
            className="text-[#1c2942] hover:text-[#6d74b5] hover:bg-[#ebf2fa]"
          >
            <LayoutDashboardIcon className="w-4 h-4" />
            Dashboard
          </Button>,
          <Button
            key="logout-btn"
            onClick={() => navigate("/logout")}
            variant="ghost"
            size="sm"
            className="text-[#1c2942] hover:text-red-500 hover:bg-red-50 p-2"
            title="Déconnexion"
          >
            <LogOutIcon className="w-4 h-4" />
          </Button>,
        ]
      : []),
  ];

  // Navigation principale - identique pour tous (connectés ou non)
  const navItems = [
    <Dropdown
      key="ecole-dropdown"
      className="dropdown-hover"
      trigger={
        <span className="flex items-center gap-1.5 cursor-pointer font-medium text-[#1c2942] hover:text-[#6d74b5] transition-colors">
          <GraduationCap className="w-4 h-4" />
          Je suis une école
          <ChevronDownIcon className="w-4 h-4" />
        </span>
      }
      items={[
        <NavLink
          key="presentation"
          to="/espace-ecoles"
          className="flex flex-col hover:bg-[#ebf2fa] p-3 rounded-xl transition-colors"
        >
          <span className="font-medium text-[#1c2942]">Présentation</span>
          <span className="text-xs text-[#1c2942]/50">Découvrez notre offre pour les écoles</span>
        </NavLink>,
        <NavLink
          key="login-ecole"
          to="/login"
          className="flex flex-col hover:bg-[#ebf2fa] p-3 rounded-xl transition-colors"
        >
          <span className="font-medium text-[#1c2942]">Connexion école</span>
          <span className="text-xs text-[#1c2942]/50">Accédez à votre espace</span>
        </NavLink>,
      ]}
    />,
    <Dropdown
      key="challenges-dropdown"
      className="dropdown-hover"
      trigger={
        <span className="flex items-center gap-1.5 cursor-pointer font-medium text-[#1c2942] hover:text-[#6d74b5] transition-colors">
          <Trophy className="w-4 h-4" />
          Découvrir nos challenges
          <ChevronDownIcon className="w-4 h-4" />
        </span>
      }
      items={[
        <NavLink
          key="presentation-challenges"
          to="/challenges"
          className="flex flex-col hover:bg-[#ebf2fa] p-3 rounded-xl transition-colors"
        >
          <span className="font-medium text-[#1c2942]">Présentation</span>
          <span className="text-xs text-[#1c2942]/50">Découvrez notre offre de challenges</span>
        </NavLink>,
        <NavLink
          key="tous-challenges"
          to="/tous-les-challenges"
          className="flex flex-col hover:bg-[#ebf2fa] p-3 rounded-xl transition-colors"
        >
          <span className="font-medium text-[#1c2942]">Voir tous les challenges</span>
          <span className="text-xs text-[#1c2942]/50">Explorez nos challenges immersifs clé en main</span>
        </NavLink>,
      ]}
    />,
    <Dropdown
      key="intervenant-dropdown"
      className="dropdown-hover"
      trigger={
        <span className="flex items-center gap-1.5 cursor-pointer font-medium text-[#1c2942] hover:text-[#6d74b5] transition-colors">
          <Users className="w-4 h-4" />
          Je suis intervenant
          <ChevronDownIcon className="w-4 h-4" />
        </span>
      }
      items={[
        <NavLink
          key="presentation-intervenants"
          to="/espace-intervenants"
          className="flex flex-col hover:bg-[#ebf2fa] p-3 rounded-xl transition-colors"
        >
          <span className="font-medium text-[#1c2942]">Présentation</span>
          <span className="text-xs text-[#1c2942]/50">Découvrez les avantages de rejoindre notre réseau</span>
        </NavLink>,
        <NavLink
          key="register-intervenant"
          to="/register/intervenant"
          className="flex flex-col hover:bg-[#ebf2fa] p-3 rounded-xl transition-colors"
        >
          <span className="font-medium text-[#1c2942]">Devenir intervenant</span>
          <span className="text-xs text-[#1c2942]/50">Rejoignez notre réseau d'experts</span>
        </NavLink>,
        <NavLink
          key="login-intervenant"
          to="/login"
          className="flex flex-col hover:bg-[#ebf2fa] p-3 rounded-xl transition-colors"
        >
          <span className="font-medium text-[#1c2942]">Connexion intervenant</span>
          <span className="text-xs text-[#1c2942]/50">Accédez à votre espace</span>
        </NavLink>,
      ]}
    />,
  ];

  // Footer sections
  const footerSections = [
    {
      title: "Écoles",
      links: [
        { label: "Trouver un intervenant", to: "/intervenants" },
        { label: "Découvrir nos challenges", to: "/challenges" },
        { label: "Proposer une mission", to: "/nouvelle-mission" },
      ],
    },
    {
      title: "Intervenants",
      links: [
        { label: "Devenir Intervenant", to: "/register/intervenant" },
        { label: "Voir les missions", to: "/missions" },
      ],
    },
    {
      title: "Légal",
      links: [
        { label: "Mentions légales", to: "/mentions-legales" },
        { label: "CGU", to: "/cgu" },
        { label: "Contact", to: "/contact" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header>
        <Navbar
          navStart={[
            <Link
              key="logo"
              to="/"
              className="flex items-center group"
            >
              <img
                src="/logo.svg"
                alt="Vizion Academy"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>,
          ]}
          navCenter={navItems}
          navEnd={headerButtons}
        />
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-[72px] lg:h-[80px]" />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#28303a] text-white">
        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/light-logo.svg"
                  className="w-12 h-12"
                  alt="Vizion Academy"
                />
                <div>
                  <span className="text-xl font-bold block">Vizion Academy</span>
                  <span className="text-sm text-gray-400">Excellence en formation</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                La plateforme de référence pour connecter les établissements
                d'enseignement avec des experts qualifiés.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a
                  href="mailto:secretariat@vizionacademy.fr"
                  className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-[#6d74b5] transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>secretariat@vizionacademy.fr</span>
                </a>
                <a
                  href="tel:0659196550"
                  className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-[#6d74b5] transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>06 59 19 65 50</span>
                </a>
                <div className="flex items-center gap-3 text-white/60">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>Lyon, France</span>
                </div>
              </div>
            </div>

            {/* Links Sections */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-white mb-4 text-lg">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-white/50">
                © 2025 Vizion Academy. Tous droits réservés.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.linkedin.com/company/vizion-academy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/60 hover:bg-[#6d74b5] hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
