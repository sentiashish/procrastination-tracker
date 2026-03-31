import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto mt-6 grid max-w-5xl overflow-hidden rounded-2xl border border-slate-800 bg-dashboardDarkAlt shadow-glass lg:grid-cols-[1.1fr_0.9fr]">
      <aside className="relative hidden border-r border-slate-800 p-8 lg:block">
        <div className="pointer-events-none absolute -left-10 top-10 h-44 w-44 rounded-full bg-primary/20 blur-2xl" />
        <p className="text-xs uppercase tracking-[0.14em] text-secondary">Behavior Analytics</p>
        <h2 className="mt-3 font-heading text-3xl text-white">Work like a high-performance operator.</h2>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Convert daily work into measurable execution intelligence. Track delays, distractions, and efficiency to
          build a system that improves every week.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-slate-300">
          <li>1. Plan tasks with clear time blocks</li>
          <li>2. Track start and end behavior in real time</li>
          <li>3. Review efficiency and distraction insights</li>
        </ul>
      </aside>

      <div className="p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-2xl text-white">{isRegister ? "Create account" : "Welcome back"}</h3>
            <p className="mt-1 text-sm text-slate-400">
              {isRegister ? "Start your first performance week in under 2 minutes." : "Sign in to continue your streak."}
            </p>
          </div>
          <Link to="/" className="text-sm font-semibold text-slate-300 hover:text-white">
            Back to Home
          </Link>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-primary placeholder:text-slate-500 focus:ring-2"
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-primary placeholder:text-slate-500 focus:ring-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-primary placeholder:text-slate-500 focus:ring-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

          <button
            disabled={submitting}
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white hover:brightness-110 disabled:opacity-70"
            type="submit"
          >
            {submitting ? "Please wait..." : isRegister ? "Create account" : "Login"}
          </button>
        </form>

        <button
          onClick={() => setIsRegister((prev) => !prev)}
          className="mt-5 text-sm font-medium text-secondary hover:underline"
        >
          {isRegister ? "Already have an account? Login" : "Need an account? Register"}
        </button>
      </div>
    </section>
  );
};

export default LoginPage;
