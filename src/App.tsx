import { useState, lazy, Suspense, useEffect } from 'react';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import { useFirebaseSync } from './hooks/useFirebaseSync';
import { useMigration } from './hooks/useMigration';
import { ToastProvider } from './contexts/ToastContext';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MatchRecorder = lazy(() => import('./pages/MatchRecorder'));
const Players = lazy(() => import('./pages/Players'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

// Component that handles Firebase sync after authentication
function AuthenticatedApp({
  view,
  setView
}: {
  view: 'dashboard' | 'match' | 'players';
  setView: (view: 'dashboard' | 'match' | 'players') => void;
}) {
  // Initialize Firebase sync (listens to Firestore collections)
  useFirebaseSync();

  // Handle one-time migration from local storage to Firebase
  const { isMigrating } = useMigration();

  // Show migration progress
  if (isMigrating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--color-neon-purple)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text)]">Migration des données vers le cloud...</p>
          <p className="text-[var(--color-text-dim)] text-sm mt-2">Ceci ne se produit qu'une seule fois</p>
        </div>
      </div>
    );
  }

  return (
    <Layout currentView={view} onNavigate={setView}>
      <Suspense fallback={<LoadingSpinner />}>
        {view === 'dashboard' ? (
          <Dashboard onNavigate={setView} />
        ) : view === 'players' ? (
          <Players />
        ) : (
          <MatchRecorder onNavigate={setView} />
        )}
      </Suspense>
    </Layout>
  );
}

function App() {
  const [view, setView] = useState<'dashboard' | 'match' | 'players'>('dashboard');
  const [showLanding, setShowLanding] = useState(true);
  const { theme } = useThemeStore();
  const { user, loading, initialized, initAuth } = useAuthStore();

  // Initialize Firebase auth listener
  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);

  // Apply theme with system preference support
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');

    if (theme === 'system') {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else if (theme === 'high-contrast') {
      root.classList.add('dark', 'high-contrast');
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Show loading while initializing auth
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <LoadingSpinner size="lg" message="Chargement..." />
      </div>
    );
  }

  // Show Landing Page if not authenticated and user hasn't clicked start
  if (!user && showLanding) {
    return (
      <ToastProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <LandingPage onStart={() => setShowLanding(false)} />
        </Suspense>
      </ToastProvider>
    );
  }

  // Show login page if not authenticated and landing passed
  if (!user) {
    return (
      <ToastProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <LoginPage onLoginSuccess={() => setView('dashboard')} />
        </Suspense>
      </ToastProvider>
    );
  }

  // Render authenticated app with Firebase sync
  return (
    <ToastProvider>
      <AuthenticatedApp view={view} setView={setView} />
    </ToastProvider>
  );
}

export default App;
