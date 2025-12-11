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
import DashboardAdminPage from "./pages/DashboardAdminPage";
import AdminIntervenantsPage from "./pages/AdminIntervenantsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import DashboardIntervenantPage from "./pages/DashboardIntervenantPage";
import DashboardRouter from "./pages/DashboardRouter";
import MissionsPage from "./pages/MissionsPage";
import MesMissionsPage from "./pages/MesMissionsPage";
import NouvelleMissionPage from "./pages/NouvelleMissionPage";
import DashboardEcolePage from "./pages/DashboardEcolePage";
import ContactPage from "./pages/ContactPage";
import DevenirIntervenantPage from "./pages/DevenirIntervenantPage";
import MentionsLegalesPage from "./pages/MentionsLegalesPage";
import CGUPage from "./pages/CGUPage";
import ChallengesPage from "./pages/ChallengesPage";
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
        path="/missions"
        element={
          <ProtectedRoute>
            <NavLayout>
              <MissionsPage />
            </NavLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/mes-missions"
        element={
          <ProtectedRoute requiredRole={["ECOLE", "ADMIN"]}>
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
