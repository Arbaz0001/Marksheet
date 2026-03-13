import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginAdmin } from '../api';
import { saveAuthSession } from '../services/auth';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      const res = await loginAdmin({
        email: form.email.trim(),
        password: form.password,
      });
      saveAuthSession(res.data.token, res.data.admin);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Backend server is not reachable. Please try again later.');
      } else {
        setError(err.response?.data?.message || err.message || 'Unable to sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
      <div className="grid w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#334155_100%)] p-10 text-white lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Report Card Generator</p>
          <h1 className="mt-8 max-w-md text-4xl font-bold leading-tight">Secure admin access for school and marksheet management.</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-200">
            Sign in with the admin credentials from your backend .env file to create schools, generate marksheets, and manage report history.
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Admin Login</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm text-slate-600">Use the email and password configured in the backend environment.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
              </label>

              {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;