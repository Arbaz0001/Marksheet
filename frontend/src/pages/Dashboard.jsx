import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteSchool, getSchools } from '../api';
import { clearAuthSession, getAdminProfile } from '../services/auth';

function Dashboard() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const admin = getAdminProfile();

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getSchools();
      setSchools(res.data);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Backend server is not reachable. Please try again later.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load schools.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleDelete = async (schoolId, schoolName) => {
    const confirmed = window.confirm(`Delete ${schoolName}? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(schoolId);
      setError('');
      await deleteSchool(schoolId);
      setSchools((prev) => prev.filter((school) => school._id !== schoolId));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete school.');
    } finally {
      setDeletingId('');
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  return (
    <section className="mx-auto max-w-6xl space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Admin Panel</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Manage schools, create marksheets, and access history from one secure dashboard.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
              Signed in as <span className="font-semibold text-slate-900">{admin?.email || 'Admin'}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            to="/schools/create"
            className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white"
          >
            <h2 className="text-xl font-semibold text-slate-900">Create School</h2>
            <p className="mt-2 text-sm text-slate-600">
              Register a school with its address, DISE, PSP code, school code, exams, and subjects.
            </p>
          </Link>

          <Link
            to="/create"
            className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white"
          >
            <h2 className="text-xl font-semibold text-slate-900">Create Marksheet</h2>
            <p className="mt-2 text-sm text-slate-600">
              Select a school and fill student marks to generate a report card.
            </p>
          </Link>

          <Link
            to="/history"
            className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white"
          >
            <h2 className="text-xl font-semibold text-slate-900">Marksheet History</h2>
            <p className="mt-2 text-sm text-slate-600">
              Search and reprint previously generated marksheets.
            </p>
          </Link>
        </div>
      </div>

      {/* Schools list */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-slate-900">Registered Schools</h2>
          <Link
            to="/schools/create"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            + New School
          </Link>
        </div>

        {error ? <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : schools.length === 0 ? (
          <p className="text-sm text-slate-500">
            No schools yet.{' '}
            <Link to="/schools/create" className="font-semibold underline">
              Create one to get started.
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-slate-200 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 px-3 py-3 text-left">School Name</th>
                  <th className="border border-slate-200 px-3 py-3 text-left">City</th>
                  <th className="border border-slate-200 px-3 py-3 text-left">DISE Code</th>
                  <th className="border border-slate-200 px-3 py-3 text-left">PSP Code</th>
                  <th className="border border-slate-200 px-3 py-3 text-left">School Code</th>
                  <th className="border border-slate-200 px-3 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((school) => (
                  <tr key={school._id}>
                    <td className="border border-slate-200 px-3 py-2 font-medium text-slate-900">
                      <div>{school.name}</div>
                      <div className="text-xs text-slate-500">{school.state}</div>
                    </td>
                    <td className="border border-slate-200 px-3 py-2">{school.city}</td>
                    <td className="border border-slate-200 px-3 py-2">{school.diseCode}</td>
                    <td className="border border-slate-200 px-3 py-2">{school.pspCode}</td>
                    <td className="border border-slate-200 px-3 py-2">{school.schoolCode}</td>
                    <td className="border border-slate-200 px-3 py-2 text-center">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <Link
                          to={`/schools/${school._id}/edit`}
                          className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(school._id, school.name)}
                          disabled={deletingId === school._id}
                          className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === school._id ? 'Deleting...' : 'Delete'}
                        </button>
                        <Link
                          to="/create"
                          className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          Make Marksheet
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;

 