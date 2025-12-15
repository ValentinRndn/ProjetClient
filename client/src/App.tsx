import { Route, Routes } from "react-router";
import HomePage from "@/pages/HomePage";

import LoggedOutRoute from "@/components/LoggedOutRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RegisterIntervenantPage from "./pages/RegisterIntervenantPage";
import LogoutPage from "./pages/LogoutPage";
import SchoolPage from "./pages/SchoolPage";
import IntervenantsPage from "./pages/IntervenantsPage";
import IntervenantProfilePage from "./pages/IntervenantProfilePage";
import DashboardAdminPage from "./pages/DashboardAdminPage";
import AdminIntervenantsPage from "./pages/AdminIntervenantsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import DashboardIntervenantPage from "./pages/DashboardIntervenantPage";
import DashboardRouter from "./pages/DashboardRouter";
import MissionsPage from "./pages/MissionsPage";
import MesMissionsPage from "./pages/MesMissionsPage";
import NouvelleMissionPage from "./pages/NouvelleMissionPage";
import DashboardEcolePage from "./pages/DashboardEcolePage";
import HistoriqueCollaborationsPage from "./pages/HistoriqueCollaborationsPage";
import MesFavorisPage from "./pages/MesFavorisPage";
import DeclarationsPage from "./pages/DeclarationsPage";
import MonProfilIntervenantPage from "./pages/MonProfilIntervenantPage";
import OnboardingDocumentsPage from "./pages/OnboardingDocumentsPage";
import FacturesPage from "./pages/FacturesPage";
import DisponibilitesPage from "./pages/DisponibilitesPage";
import CollaborationsPage from "./pages/CollaborationsPage";
import NouvelleCollaborationPage from "./pages/NouvelleCollaborationPage";
import CollaborationDetailPage from "./pages/CollaborationDetailPage";
import ContactPage from "./pages/ContactPage";
import DevenirIntervenantPage from "./pages/DevenirIntervenantPage";
import MentionsLegalesPage from "./pages/MentionsLegalesPage";
import CGUPage from "./pages/CGUPage";
import ChallengesPage from "./pages/ChallengesPage";
import TousLesChallengesPage from "./pages/TousLesChallengesPage";
import EspaceEcolesPage from "./pages/EspaceEcolesPage";
import NavLayout from "./components/layouts/DefaultLayout";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <NavLayout>
            <HomePage />
          </NavLayout>
        }
      />

      <Route
        path="/login"
        element={
          <LoggedOutRoute redirectTo="/dashboard">
            <LoginPage />
          </LoggedOutRoute>
        }
      />
      <Route
        path="/register"
        element={
          <LoggedOutRoute>
            <RegisterPage />
          </LoggedOutRoute>
        }
      />
      <Route
        path="/register/intervenant"
        element={
          <LoggedOutRoute>
            <RegisterIntervenantPage />
          </LoggedOutRoute>
        }
      />

      <Route
        path="/ecoles"
        element={
          <NavLayout>
            <SchoolPage />
          </NavLayout>
        }
      />

      <Route
        path="/intervenants"
        element={
          <NavLayout>
            <IntervenantsPage />
          </NavLayout>
        }
      />
      <Route
        path="/intervenants/:id"
        element={
          <NavLayout>
            <IntervenantProfilePage />
          </NavLayout>
        }
      />

      <Route path="/logout" element={<LogoutPage />} />

      {/* Pages publiques */}
      <Route
        path="/contact"
        element={
          <NavLayout>
            <ContactPage />
          </NavLayout>
        }
      />
      <Route
        path="/devenir-intervenant"
        element={
          <NavLayout>
            <DevenirIntervenantPage />
          </NavLayout>
        }
      />
      <Route
        path="/mentions-legales"
        element={
          <NavLayout>
            <MentionsLegalesPage />
          </NavLayout>
        }
      />
      <Route
        path="/cgu"
        element={
          <NavLayout>
            <CGUPage />
          </NavLayout>
        }
      />
      <Route
        path="/challenges"
        element={
          <NavLayout>
            <ChallengesPage />
          </NavLayout>
        }
      />
      <Route
        path="/espace-ecoles"
        element={
          <NavLayout>
            <EspaceEcolesPage />
          </NavLayout>
        }
      />
      <Route
        path="/tous-les-challenges"
        element={
          <NavLayout>
            <TousLesChallengesPage />
          </NavLayout>
        }
      />

      {/* Route publique - Mur des missions accessible à tous */}
      <Route
        path="/missions"
        element={
          <NavLayout>
            <MissionsPage />
          </NavLayout>
        }
      />

      <Route
        path="/mes-missions"
        element={
          <ProtectedRoute requiredRole={["ECOLE"]}>
            <NavLayout>
              <MesMissionsPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/gestion-missions"
        element={
          <ProtectedRoute requiredRole={["ADMIN"]}>
            <NavLayout>
              <MesMissionsPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/nouvelle-mission"
        element={
          <ProtectedRoute requiredRole={["ECOLE", "ADMIN"]}>
            <NavLayout>
              <NouvelleMissionPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />

      {/* Routes protégées (nécessitent une authentification) */}
      {/* Dashboard Admin */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <NavLayout>
              <DashboardAdminPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/intervenants"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <NavLayout>
              <AdminIntervenantsPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/users"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <NavLayout>
              <AdminUsersPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/factures"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <NavLayout>
              <FacturesPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />

      {/* Dashboard Intervenant */}
      <Route
        path="/dashboard/intervenant"
        element={
          <ProtectedRoute requiredRole="INTERVENANT">
            <NavLayout>
              <DashboardIntervenantPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/intervenant/declarations"
        element={
          <ProtectedRoute requiredRole="INTERVENANT">
            <NavLayout>
              <DeclarationsPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/intervenant/profil"
        element={
          <ProtectedRoute requiredRole="INTERVENANT">
            <NavLayout>
              <MonProfilIntervenantPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/intervenant/documents"
        element={
          <ProtectedRoute requiredRole="INTERVENANT">
            <NavLayout>
              <OnboardingDocumentsPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/intervenant/factures"
        element={
          <ProtectedRoute requiredRole="INTERVENANT">
            <NavLayout>
              <FacturesPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/intervenant/disponibilites"
        element={
          <ProtectedRoute requiredRole="INTERVENANT">
            <NavLayout>
              <DisponibilitesPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />

      {/* Dashboard Ecole */}
      <Route
        path="/dashboard/ecole"
        element={
          <ProtectedRoute requiredRole="ECOLE">
            <NavLayout>
              <DashboardEcolePage />
            </NavLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/ecole/historique"
        element={
          <ProtectedRoute requiredRole="ECOLE">
            <NavLayout>
              <HistoriqueCollaborationsPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/ecole/favoris"
        element={
          <ProtectedRoute requiredRole="ECOLE">
            <NavLayout>
              <MesFavorisPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/ecole/factures"
        element={
          <ProtectedRoute requiredRole="ECOLE">
            <NavLayout>
              <FacturesPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />

      {/* Routes Collaborations (accessibles aux écoles et intervenants) */}
      <Route
        path="/collaborations"
        element={
          <ProtectedRoute requiredRole={["ECOLE", "INTERVENANT"]}>
            <NavLayout>
              <CollaborationsPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/collaborations/nouvelle"
        element={
          <ProtectedRoute requiredRole={["ECOLE", "INTERVENANT"]}>
            <NavLayout>
              <NouvelleCollaborationPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/collaborations/:id"
        element={
          <ProtectedRoute requiredRole={["ECOLE", "INTERVENANT"]}>
            <NavLayout>
              <CollaborationDetailPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />

      {/* Route dashboard générique - redirige selon le rôle */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRouter />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
