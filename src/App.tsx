import { useState, lazy, Suspense, useEffect } from 'react';
import Layout from './components/Layout';
import { useThemeStore } from './store/themeStore';
// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MatchRecorder = lazy(() => import('./pages/MatchRecorder'));
const Players = lazy(() => import('./pages/Players'));

function App() {
  const [view, setView] = useState<'dashboard' | 'match' | 'players'>('dashboard');
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Loading spinner component
  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-full w-full min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-neon-blue)]"></div>
    </div>
  );

  return (
    <Layout currentView={view} onNavigate={setView}>
      <Suspense fallback={<LoadingFallback />}>
        {view === 'dashboard' ? (
          <Dashboard />
        ) : view === 'players' ? (
          <Players />
        ) : (
          <MatchRecorder />
        )}
      </Suspense>
    </Layout>
  );
}

export default App;
