import { Route, Routes } from "react-router";
import Home from "@/pages/Home";

import LoggedOutRoute from "@/components/LoggedOutRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
// Importez vos pages ici
// import LoginPage from "@/pages/Login";
// import RegisterPage from "@/pages/Register";
// import DashboardEcole from "@/pages/DashboardEcole";
// import DashboardIntervenant from "@/pages/DashboardIntervenant";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

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

      {/* Routes protégées (nécessitent une authentification) */}
      {/* 
      <Route
        path="/dashboard-ecole"
        element={
          <ProtectedRoute requiredRole="ECOLE">
            <DashboardEcole />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard-intervenant"
        element={
          <ProtectedRoute requiredRole="INTERVENANT">
            <DashboardIntervenant />
          </ProtectedRoute>
        }
      />
      */}
    </Routes>
  );
}

export default App;
