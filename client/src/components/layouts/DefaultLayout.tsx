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
  PlusIcon,
  TargetIcon,
  UserIcon,
  LayoutDashboardIcon,
  BuildingIcon,
  UsersIcon,
  ShieldIcon,
  MapPin,
  ArrowRight,
  Linkedin,
  Twitter,
} from "lucide-react";
import { PropsWithChildren } from "react";

export default function DefaultLayout({ children }: PropsWithChildren) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role;

  // Boutons pour les utilisateurs non connectés
  const unAuthenticatedButtons = [
    <Button
      key="login-btn"
      onClick={() => navigate("/login")}
      variant="ghost"
      size="sm"
    >
      Se connecter
    </Button>,
    <Button
      key="register-btn"
      onClick={() => navigate("/register")}
      variant="primary"
      size="sm"
    >
      Créer un compte
    </Button>,
  ];

  // Boutons pour les utilisateurs connectés
  const authenticatedButtons = [
    <Button
      key="dashboard-btn"
      onClick={() => navigate("/dashboard")}
      variant="primary"
      size="sm"
    >
      <LayoutDashboardIcon className="w-4 h-4" />
      Dashboard
    </Button>,
    <Button
      key="logout-btn"
      onClick={() => navigate("/logout")}
      variant="ghost"
      size="sm"
    >
      <LogOutIcon className="w-4 h-4" />
      Déconnexion
    </Button>,
  ];

  // Navigation pour les visiteurs (non connectés)
  const visitorNavItems = [
    <Dropdown
      key="ecoles-dropdown"
      className="dropdown-hover"
      trigger={
        <span className="flex items-center gap-1.5 cursor-pointer font-medium text-gray-700 hover:text-indigo-600 transition-colors">
          Espace Écoles
          <ChevronDownIcon className="w-4 h-4" />
        </span>
      }
      items={[
        <NavLink
          key="intervenants"
          to="/intervenants"
          className="flex items-center gap-3 hover:bg-indigo-50 p-3 rounded-xl transition-colors"
        >
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-gray-700">Trouver un intervenant</span>
        </NavLink>,
        <NavLink
          key="register-ecole"
          to="/register"
          className="flex items-center gap-3 hover:bg-indigo-50 p-3 rounded-xl transition-colors"
        >
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <BuildingIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-gray-700">Créer un compte école</span>
        </NavLink>,
      ]}
    />,
    <Dropdown
      key="intervenants-dropdown"
      className="dropdown-hover"
      trigger={
        <span className="flex items-center gap-1.5 cursor-pointer font-medium text-gray-700 hover:text-indigo-600 transition-colors">
          Espace Intervenants
          <ChevronDownIcon className="w-4 h-4" />
        </span>
      }
      items={[
        <NavLink
          key="missions"
          to="/missions"
          className="flex items-center gap-3 hover:bg-indigo-50 p-3 rounded-xl transition-colors"
        >
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <TargetIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-gray-700">Voir les missions</span>
        </NavLink>,
        <NavLink
          key="devenir-intervenant"
          to="/register/intervenant"
          className="flex items-center gap-3 hover:bg-indigo-50 p-3 rounded-xl transition-colors"
        >
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-gray-700">Devenir intervenant</span>
        </NavLink>,
      ]}
    />,
    <NavLink
      key="contact"
      to="/contact"
      className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
    >
      Contact
    </NavLink>,
  ];

  // Navigation pour les écoles
  const ecoleNavItems = [
    <NavLink
      key="intervenants"
      to="/intervenants"
      className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
    >
      Trouver un intervenant
    </NavLink>,
    <NavLink
      key="nouvelle-mission"
      to="/nouvelle-mission"
      className="font-medium text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
    >
      <PlusIcon className="w-4 h-4" />
      Nouvelle mission
    </NavLink>,
    <NavLink
      key="mes-missions"
      to="/mes-missions"
      className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
    >
      Mes missions
    </NavLink>,
    <NavLink
      key="contact"
      to="/contact"
      className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
    >
      Contact
    </NavLink>,
  ];

  // Navigation pour les intervenants
  const intervenantNavItems = [
    <NavLink
      key="missions"
      to="/missions"
      className="font-medium text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
    >
      <TargetIcon className="w-4 h-4" />
      Missions
    </NavLink>,
    <NavLink
      key="intervenants"
      to="/intervenants"
      className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
    >
      Annuaire
    </NavLink>,
    <NavLink
      key="contact"
      to="/contact"
      className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
    >
      Contact
    </NavLink>,
  ];

  // Navigation pour les admins
  const adminNavItems = [
    <Dropdown
      key="admin-dropdown"
      className="dropdown-hover"
      trigger={
        <span className="flex items-center gap-1.5 cursor-pointer font-medium text-gray-700 hover:text-indigo-600 transition-colors">
          <ShieldIcon className="w-4 h-4" />
          Administration
          <ChevronDownIcon className="w-4 h-4" />
        </span>
      }
      items={[
        <NavLink
          key="admin-users"
          to="/dashboard/admin/users"
          className="flex items-center gap-3 hover:bg-indigo-50 p-3 rounded-xl transition-colors"
        >
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <UsersIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-gray-700">Utilisateurs</span>
        </NavLink>,
        <NavLink
          key="admin-intervenants"
          to="/dashboard/admin/intervenants"
          className="flex items-center gap-3 hover:bg-indigo-50 p-3 rounded-xl transition-colors"
        >
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-gray-700">Intervenants</span>
        </NavLink>,
      ]}
    />,
    <NavLink
      key="missions"
      to="/missions"
      className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
    >
      Missions
    </NavLink>,
    <NavLink
      key="mes-missions"
      to="/mes-missions"
      className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
    >
      Gérer missions
    </NavLink>,
    <NavLink
      key="intervenants"
      to="/intervenants"
      className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
    >
      Intervenants
    </NavLink>,
  ];

  // Sélection de la navigation selon le rôle
  const getNavItems = () => {
    if (!isAuthenticated) return visitorNavItems;
    switch (role) {
      case "ADMIN":
        return adminNavItems;
      case "ECOLE":
        return ecoleNavItems;
      case "INTERVENANT":
        return intervenantNavItems;
      default:
        return visitorNavItems;
    }
  };

  // Footer sections
  const footerSections = [
    {
      title: "Écoles",
      links: [
        { label: "Trouver un intervenant", to: "/intervenants" },
        { label: "Proposer une mission", to: "/nouvelle-mission" },
        { label: "Créer un compte", to: "/register" },
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
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <img
                  src="/logo.svg"
                  alt="Vizion Academy"
                  className="w-10 h-10 transition-transform group-hover:scale-105"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-gray-900 text-lg leading-tight block">
                  Vizion
                </span>
                <span className="text-xs text-indigo-600 font-medium -mt-1 block">
                  Academy
                </span>
              </div>
            </Link>,
          ]}
          navCenter={getNavItems()}
          navEnd={isAuthenticated ? authenticatedButtons : unAuthenticatedButtons}
        />
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-[72px] lg:h-[80px]" />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        {/* CTA Section */}
        <div className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Prêt à commencer ?
                  </h3>
                  <p className="text-indigo-100">
                    Rejoignez Vizion Academy et connectez-vous avec les meilleurs experts.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/register")}
                  variant="secondary"
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-gray-100 shrink-0"
                >
                  Créer un compte
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

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
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>secretariat@vizionacademy.fr</span>
                </a>
                <a
                  href="tel:0659196550"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>06 59 19 65 50</span>
                </a>
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>Paris, France</span>
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
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
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
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                © 2025 Vizion Academy. Tous droits réservés.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
