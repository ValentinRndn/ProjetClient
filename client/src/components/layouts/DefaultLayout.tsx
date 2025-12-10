import { Link, NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/shared/Dropdown";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/shared/Navbar";
import {
  ChevronDownIcon,
  Mail,
  Phone,
  PlusIcon,
  TargetIcon,
  UserIcon,
} from "lucide-react";
import { PropsWithChildren } from "react";

export default function DefaultLayout({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const unAuthenticatedButtons = [
    <Button
      key="register-btn"
      onClick={() => navigate("/register")}
      className="btn-primary"
    >
      Créer un compte
    </Button>,
    <Button
      key="login-btn"
      onClick={() => navigate("/login")}
      variant="outline"
    >
      Se connecter
    </Button>,
  ];
  const authenticatedButtons = [
    <Button
      key="dashboard-btn"
      onClick={() => navigate("/dashboard")}
      variant="primary"
    >
      Mon Dashboard
    </Button>,
  ];

  const footerSections = [
    {
      title: "Présentation",
      links: ["Trouver un intervenant", "Dashboard École"],
    },
    {
      title: "Présentation",
      links: ["Voir les challenges", "Simuler un coût"],
    },
    {
      title: "Présentation",
      links: [
        "Devenir Intervenant",
        "Dashboard Intervenant",
        "Mur des missions",
      ],
    },
  ];
  return (
    <>
      <header>
        <Navbar
          navStart={[
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Logo" width={40} height={40} />

              <span className="font-semibold text-sm sm:text-base text-gray-900">
                Vizion
                <br />
                Academy
              </span>
            </Link>,
          ]}
          navCenter={[
            <Dropdown
              className="dropdown-hover"
              trigger={
                <NavLink to="/ecoles" className="flex items-center gap-2">
                  <span className="font-medium">Espace Écoles</span>{" "}
                  <ChevronDownIcon className="w-4 h-4" />
                </NavLink>
              }
              items={[
                <NavLink
                  to="/nouvelle-mission"
                  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md"
                >
                  <PlusIcon className="w-4 h-4" /> Proposer une mission
                </NavLink>,
                <NavLink
                  to="/intervenants"
                  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md"
                >
                  <UserIcon className="w-4 h-4" /> Trouver un intervenant
                </NavLink>,
              ]}
            />,
            <Dropdown
              className="dropdown-hover"
              items={[
                <NavLink
                  to="/devenir-intervenant"
                  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md"
                >
                  <UserIcon className="w-4 h-4" /> Devenir intervenant
                </NavLink>,
                <NavLink to="/missions" className="flex items-center gap-2">
                  <TargetIcon className="w-4 h-4" /> Mur des missions
                </NavLink>,
              ]}
              trigger={
                <NavLink to="/intervenants" className="flex items-center gap-2">
                  <span className="font-medium">Espace Intervenants</span>{" "}
                  <ChevronDownIcon className="w-4 h-4" />
                </NavLink>
              }
            />,
            <Dropdown
              className="dropdown-hover"
              items={[
                <NavLink
                  to="/voir-challenges"
                  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md"
                >
                  <span className="font-medium">Voir les challenges</span>
                </NavLink>,
              ]}
              trigger={
                <NavLink to="/challenges" className="flex items-center gap-2">
                  <span className="font-medium">Challenges</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </NavLink>
              }
            />,
            <NavLink to="contact">
              <span className="font-medium">Contact</span>
            </NavLink>,
          ]}
          navEnd={
            isAuthenticated ? authenticatedButtons : unAuthenticatedButtons
          }
        />
      </header>
      {/* Page Enfante */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#1B263B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="/light-logo.svg"
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                />{" "}
                <span className="text-xl font-bold">Vizion Academy</span>
              </div>
              <p className="text-[#E0E3FF] text-sm mb-6">
                Mise en relation entre experts et établissements d'enseignement.
              </p>
              <div className="space-y-2 text-sm">
                <a
                  href="mailto:secretariat@vizionacademy.fr"
                  className="flex items-center space-x-2 text-[#D7C49E] hover:text-white transition-colors"
                >
                  <Mail size={16} />
                  <span>secretariat@vizionacademy.fr</span>
                </a>
                <a
                  href="tel:0659196550"
                  className="flex items-center space-x-2 text-[#D7C49E] hover:text-white transition-colors"
                >
                  <Phone size={16} />
                  <span>06 59 19 65 50</span>
                </a>
              </div>
            </div>

            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-[#D7C49E] mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link
                        to={link}
                        className="text-sm text-[#E0E3FF] hover:text-white transition-colors"
                      >
                        {link}
                      </Link>
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
                <Link
                  to="/intervenants"
                  className="hover:text-white transition-colors"
                >
                  Mentions légales
                </Link>
                <span className="text-[#1E3A8A]">•</span>
                <Link to="/cgu" className="hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </div>
              <p className="text-sm text-[#E0E3FF]">© 2025 Vizion Academy.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
