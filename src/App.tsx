import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MatchRecorder from './pages/MatchRecorder';
import Players from './pages/Players';

function App() {
  const [view, setView] = useState<'dashboard' | 'match' | 'players'>('dashboard');

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
