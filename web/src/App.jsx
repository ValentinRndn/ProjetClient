import React from 'react';
import VizionAcademy from './pages/VizionAcademy';
import ViewChallenge from './pages/ViewChallenge';
import ChallengePresentation from './pages/ChallengePresentation';
import TrouverIntervenantPage from './pages/TrouverIntervenantPage';
import SchoolDashboard from './pages/SchoolDashboard';
import SchoolPresentation from './pages/SchoolPresentation';
import DevenirVizionner from './pages/DevenirVizionner';
import DashboardIntervenant from './pages/DashboardIntervenant';
import MurMissions from './pages/MurMissions';
import ContactPage from './pages/ContactPage';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<VizionAcademy />} />
      <Route path="/trouver-intervenant" element={<TrouverIntervenantPage />} />
      <Route path="/dashboard-ecole" element={<SchoolDashboard />} />
      <Route path="/presentation-ecole" element={<SchoolPresentation />} />
      <Route path="/presentation-challenge" element={<ChallengePresentation />} />
      <Route path="/voir-challenges" element={<ViewChallenge />} />
      <Route path="/devenir-vizionner" element={<DevenirVizionner />} />
      <Route path="/creer-profil-intervenant" element={<DevenirVizionner />} />
      <Route path="/dashboard-intervenant" element={<DashboardIntervenant />} />
      <Route path="/mur-missions" element={<MurMissions />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
}

export default App;
