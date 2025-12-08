import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/ui/Navbar";
import Hero from "@/components/features/Hero";
import WhyChooseUs from "@/components/features/WhyChooseUs";
import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import {
  ChevronDownIcon,
  EyeIcon,
  PlusIcon,
  TargetIcon,
  UserIcon,
} from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const unAuthenticatedButtons = [
    <Button onClick={() => navigate("/register")} className="btn-primary">
      Créer un compte
    </Button>,
    <Button onClick={() => navigate("/login")} variant="outline">
      Se connecter
    </Button>,
  ];
  const authenticatedButtons = [
    <Button onClick={() => navigate("/dashboard")} variant="primary">
      Mon Dashboard
    </Button>,
  ];
  return (
    <>
      <header>
        <Navbar
          navStart={[
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" width={40} height={40} />
              <span className="font-semibold text-sm sm:text-base text-gray-900">
                Vizion
                <br />
                Academy
              </span>
            </div>,
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
          navEnd={[
            isAuthenticated ? authenticatedButtons : unAuthenticatedButtons,
          ]}
        />
      </header>
      <main>
        <Hero />
        <WhyChooseUs />
      </main>
    </>
  );
}
