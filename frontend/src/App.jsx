import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import CreateSchool from './pages/CreateSchool';
import CreateMarksheet from './pages/CreateMarksheet';
import History from './pages/History';
import Login from './pages/Login';
import { isAuthenticated } from './services/auth';

function App() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated() ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schools/create"
            element={
              <ProtectedRoute>
                <CreateSchool />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schools/:id/edit"
            element={
              <ProtectedRoute>
                <CreateSchool />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateMarksheet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
