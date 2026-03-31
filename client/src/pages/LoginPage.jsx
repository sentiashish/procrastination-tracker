import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <section className="relative mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-dashboardDarkAlt p-8 shadow-glass">
      <div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-primary/20 blur-2xl" />
      <h2 className="font-heading text-2xl text-white">{isRegister ? "Create account" : "Welcome back"}</h2>
      <p className="mb-6 mt-2 text-sm text-slate-400">
        Track your planned vs actual behavior and kill procrastination patterns.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {isRegister && (
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm outline-none ring-primary focus:ring-2"
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm outline-none ring-primary focus:ring-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm outline-none ring-primary focus:ring-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          disabled={submitting}
          className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white hover:brightness-110 disabled:opacity-70"
          type="submit"
        >
          {submitting ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>
      </form>

      <button
        onClick={() => setIsRegister((prev) => !prev)}
        className="mt-5 text-sm text-secondary hover:underline"
      >
        {isRegister ? "Already have an account? Login" : "Need an account? Register"}
      </button>
    </section>
  );
};

export default LoginPage;
