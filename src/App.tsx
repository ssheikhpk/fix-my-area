import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { DirectReportPage } from './pages/DirectReportPage';
import { KarachiMapPage } from './pages/KarachiMapPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { SlaClocksPage } from './pages/SlaClocksPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { AuthorityDashboard } from './pages/AuthorityDashboard';
import { LiveTrackingPage } from './pages/LiveTrackingPage';
import { Auth } from './pages/Auth';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing / Head Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Citizen Home Page */}
          <Route path="/home" element={<HomePage />} />

          {/* Dedicated pages for each citizen feature */}
          <Route path="/report" element={<DirectReportPage />} />
          <Route path="/chat" element={<ChatbotPage />} />
          <Route path="/tracking" element={<LiveTrackingPage />} />

          {/* Map & SLA pages */}
          <Route path="/map" element={<KarachiMapPage />} />
          <Route path="/sla" element={<SlaClocksPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />

          {/* Authority Portal */}
          <Route path="/authority" element={<AuthorityDashboard />} />

          {/* Authentication */}
          <Route path="/login" element={<Auth />} />

          {/* Citizen route alias */}
          <Route path="/citizen" element={<Navigate to="/home" replace />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
