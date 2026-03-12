import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSchools } from '../api';

function Dashboard() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSchools()
      .then((res) => setSchools(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div className="rounded-xl border border-slate-300 bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-2 text-slate-600">Manage schools and student marksheets from one place.</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            to="/schools/create"
            className="rounded-lg border border-slate-300 p-6 transition hover:border-blue-500 hover:bg-blue-50"
          >
            <h2 className="text-xl font-semibold text-slate-900">Create School</h2>
            <p className="mt-2 text-sm text-slate-600">
              Register a new school with exam structure and subjects.
            </p>
          </Link>

          <Link
            to="/create"
            className="rounded-lg border border-slate-300 p-6 transition hover:border-slate-500 hover:bg-slate-50"
          >
            <h2 className="text-xl font-semibold text-slate-900">Create Marksheet</h2>
            <p className="mt-2 text-sm text-slate-600">
              Select a school and fill student marks to generate a report card.
            </p>
          </Link>

          <Link
            to="/history"
            className="rounded-lg border border-slate-300 p-6 transition hover:border-slate-500 hover:bg-slate-50"
          >
            <h2 className="text-xl font-semibold text-slate-900">Marksheet History</h2>
            <p className="mt-2 text-sm text-slate-600">
              Search and reprint previously generated marksheets.
            </p>
          </Link>
        </div>
      </div>

      {/* Schools list */}
      <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Registered Schools</h2>
          <Link
            to="/schools/create"
            className="rounded border border-slate-400 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            + New School
          </Link>
        </div>

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
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-3 py-2 text-left">School Name</th>
                  <th className="border border-slate-300 px-3 py-2 text-left">Session</th>
                  <th className="border border-slate-300 px-3 py-2 text-left">DISE Code</th>
                  <th className="border border-slate-300 px-3 py-2 text-center">Subjects</th>
                  <th className="border border-slate-300 px-3 py-2 text-center">Exams</th>
                  <th className="border border-slate-300 px-3 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((school) => (
                  <tr key={school._id}>
                    <td className="border border-slate-300 px-3 py-1.5 font-medium">
                      {school.schoolName}
                    </td>
                    <td className="border border-slate-300 px-3 py-1.5">{school.session}</td>
                    <td className="border border-slate-300 px-3 py-1.5">{school.schoolDISECode}</td>
                    <td className="border border-slate-300 px-3 py-1.5 text-center">
                      {school.subjectStructure?.length ?? 0}
                    </td>
                    <td className="border border-slate-300 px-3 py-1.5 text-center">
                      {school.examStructure?.length ?? 0}
                    </td>
                    <td className="border border-slate-300 px-3 py-1.5 text-center">
                      <Link
                        to="/create"
                        className="rounded border border-slate-400 px-2 py-0.5 text-xs font-semibold hover:bg-slate-100"
                      >
                        Make Marksheet
                      </Link>
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

 