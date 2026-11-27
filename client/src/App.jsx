import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import DisclaimerFooter from './components/layout/DisclaimerFooter.jsx';
import Navbar from './components/layout/Navbar.jsx';
import { useTheme } from './context/ThemeContext.jsx';
import AiCoachPage from './pages/AiCoachPage.jsx';
import AssessmentPage from './pages/AssessmentPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import HomePage from './pages/HomePage.jsx';
import JobExplorerPage from './pages/JobExplorerPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ResultsDashboardPage from './pages/ResultsDashboardPage.jsx';

export default function App() {
  const { isDark } = useTheme();

  return (
    <div className="flex min-h-screen flex-col text-slate-900 transition-colors duration-200 dark:text-slate-100">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/test"
            element={
              <ProtectedRoute>
                <AssessmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results/:id"
            element={
              <ProtectedRoute>
                <ResultsDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <JobExplorerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:id"
            element={
              <ProtectedRoute>
                <AiCoachPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <DisclaimerFooter />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: isDark
            ? {
                background: 'rgba(15, 23, 42, 0.92)',
                color: '#F1F5F9',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                fontSize: '0.875rem',
              }
            : {
                background: 'rgba(255, 255, 255, 0.96)',
                color: '#0F172A',
                border: '1px solid rgba(148, 163, 184, 0.35)',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.12)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                fontSize: '0.875rem',
              },
        }}
      />
    </div>
  );
}
