import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { JoinPage } from './pages/JoinPage';
import { LobbyPage } from './pages/LobbyPage';
import { GamePage } from './pages/GamePage';
import { ResultsPage } from './pages/ResultsPage';
import { CreateQuizPage } from './pages/CreateQuizPage';
import { AIGeneratorPage } from './pages/AIGeneratorPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AdminLayout } from './admin/AdminLayout';
import { TeacherLayout } from './teacher/TeacherLayout';
import { StudentLayout } from './student/StudentLayout';
import { useGameStore } from './store/useGameStore';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import socket from './services/socket';

const AnimatedRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { syncWithRoom } = useGameStore();

  useEffect(() => {
    socket.on('room_update', (roomData) => {
      syncWithRoom(roomData);
      if (roomData?.status === 'finished' && (location.pathname.startsWith('/game') || location.pathname.startsWith('/lobby'))) {
        navigate('/results');
      }
    });

    return () => {
      socket.off('room_update');
    };
  }, [syncWithRoom, navigate, location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />


        {/* Student Portal Route */}
        <Route path="/student/*" element={<StudentLayout />} />

        {/* Admin Portal Route */}
        <Route path="/admin/*" element={<AdminLayout />} />

        {/* Teacher Portal Route */}
        <Route path="/teacher/*" element={<TeacherLayout />} />

        {/* Game routes - can be public or require auth based on your needs */}
        <Route path="/join" element={<JoinPage />} />
        <Route path="/lobby/:code" element={<LobbyPage />} />
        <Route path="/game/:code" element={<GamePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/create" element={<CreateQuizPage />} />
        <Route path="/ai-generate" element={<AIGeneratorPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}
