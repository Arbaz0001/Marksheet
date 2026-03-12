import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReportCardLayout from '../components/ReportCardLayout';
import { getMarksheets } from '../api';

function History() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');

  const fetchHistory = async (searchQuery = '') => {
    try {
      setLoading(true);
      setError('');
      const res = await getMarksheets(searchQuery);
      setItems(res.data);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Backend server is not reachable. Please try again later.');
      } else {
        setError(err.response?.data?.message || err.message || 'Unable to load history.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory('');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHistory(query);
  };

  if (selected) {
    return <ReportCardLayout reportData={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <section className="rounded-xl border border-slate-300 bg-white p-6 shadow-md sm:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Marksheet History</h1>
        <Link to="/" className="text-sm font-semibold text-slate-700 underline">
          Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by student name, roll number, or class"
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
        <button
          type="submit"
          className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Search
        </button>
      </form>

      {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-slate-400 text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-400 px-2 py-2 text-left">Student Name</th>
              <th className="border border-slate-400 px-2 py-2 text-left">Roll No.</th>
              <th className="border border-slate-400 px-2 py-2 text-left">Class & Section</th>
              <th className="border border-slate-400 px-2 py-2 text-left">School</th>
              <th className="border border-slate-400 px-2 py-2 text-left">Session</th>
              <th className="border border-slate-400 px-2 py-2 text-center">%</th>
              <th className="border border-slate-400 px-2 py-2 text-center">Result</th>
              <th className="border border-slate-400 px-2 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="border border-slate-400 px-2 py-3 text-center" colSpan={8}>
                  No marksheets found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id}>
                  <td className="border border-slate-400 px-2 py-1">{item.studentName}</td>
                  <td className="border border-slate-400 px-2 py-1">{item.rollNumber}</td>
                  <td className="border border-slate-400 px-2 py-1">{item.classSection}</td>
                  <td className="border border-slate-400 px-2 py-1">{item.schoolName}</td>
                  <td className="border border-slate-400 px-2 py-1">{item.session}</td>
                  <td className="border border-slate-400 px-2 py-1 text-center">
                    {item.overallResult?.percentage ?? '-'}%
                  </td>
                  <td
                    className={`border border-slate-400 px-2 py-1 text-center font-semibold ${
                      item.overallResult?.result === 'Pass'
                        ? 'text-green-700'
                        : 'text-red-600'
                    }`}
                  >
                    {item.overallResult?.result ?? '-'}
                  </td>
                  <td className="border border-slate-400 px-2 py-1 text-center">
                    <button
                      type="button"
                      onClick={() => setSelected(item)}
                      className="rounded border border-slate-500 px-3 py-1 text-xs font-semibold hover:bg-slate-100"
                    >
                      Open / Reprint
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default History;
