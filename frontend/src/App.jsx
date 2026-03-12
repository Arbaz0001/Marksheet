 
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateReportCard from './pages/CreateReportCard';
import History from './pages/History';

function App() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateReportCard />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
  