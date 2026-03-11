<<<<<<< HEAD
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <section className="mx-auto max-w-4xl rounded-xl border border-slate-300 bg-white p-8 shadow-md">
      <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Manage school report cards from one place.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/create"
          className="rounded-lg border border-slate-300 p-6 transition hover:border-slate-500 hover:bg-slate-50"
        >
          <h2 className="text-xl font-semibold text-slate-900">Create New Report Card</h2>
          <p className="mt-2 text-sm text-slate-600">
            Fill complete details and generate printable report card.
          </p>
        </Link>

        <Link
          to="/history"
          className="rounded-lg border border-slate-300 p-6 transition hover:border-slate-500 hover:bg-slate-50"
        >
          <h2 className="text-xl font-semibold text-slate-900">View Report Card History</h2>
          <p className="mt-2 text-sm text-slate-600">
            Search previous report cards by student name or roll number.
          </p>
        </Link>
      </div>
    </section>
  );
}

export default Dashboard;
=======
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <section className="mx-auto max-w-4xl rounded-xl border border-slate-300 bg-white p-8 shadow-md">
      <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Manage school report cards from one place.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/create"
          className="rounded-lg border border-slate-300 p-6 transition hover:border-slate-500 hover:bg-slate-50"
        >
          <h2 className="text-xl font-semibold text-slate-900">Create New Report Card</h2>
          <p className="mt-2 text-sm text-slate-600">
            Fill complete details and generate printable report card.
          </p>
        </Link>

        <Link
          to="/history"
          className="rounded-lg border border-slate-300 p-6 transition hover:border-slate-500 hover:bg-slate-50"
        >
          <h2 className="text-xl font-semibold text-slate-900">View Report Card History</h2>
          <p className="mt-2 text-sm text-slate-600">
            Search previous report cards by student name or roll number.
          </p>
        </Link>
      </div>
    </section>
  );
}

export default Dashboard;
>>>>>>> ed0cc00c47b55670134b48d0f5650fb644776df4
