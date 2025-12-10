import { Route, Routes } from "react-router";
import HomePage from "@/pages/HomePage";

import LoggedOutRoute from "@/components/LoggedOutRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LogoutPage from "./pages/LogoutPage";
import SchoolPage from "./pages/SchoolPage";
import IntervenantsPage from "./pages/IntervenantsPage";
import DashboardAdminPage from "./pages/DashboardAdminPage";
import AdminIntervenantsPage from "./pages/AdminIntervenantsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import DashboardIntervenantPage from "./pages/DashboardIntervenantPage";
import DashboardRouter from "./pages/DashboardRouter";
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
