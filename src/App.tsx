import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MatchRecorder from './pages/MatchRecorder';
import Players from './pages/Players';
import { useThemeStore } from './store/themeStore';
import { useEffect } from 'react';

function App() {
  const [view, setView] = useState<'dashboard' | 'match' | 'players'>('dashboard');
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <Layout currentView={view} onNavigate={setView}>
      {view === 'dashboard' ? (
        <Dashboard />
      ) : view === 'players' ? (
        <Players />
      ) : (
        <MatchRecorder />
      )}
    </Layout>
  );
}

export default App;
