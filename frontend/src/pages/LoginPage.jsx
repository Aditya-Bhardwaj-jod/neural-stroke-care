import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { RiShieldCrossLine, RiEyeLine, RiEyeOffLine, RiUserLine, RiStethoscopeLine } from "react-icons/ri";

export default function LoginPage() {
  const [role, setRole] = useState("patient");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      navigate(data.user.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard");
    } catch (err) {
      setError(err.response && err.response.data ? err.response.data.error : "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen neural-grid-bg flex items-center justify-center px-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--cyber-primary)]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--cyber-primary)] to-[var(--cyber-secondary)] flex items-center justify-center">
            <RiShieldCrossLine className="text-[#040d1a]" size={20} />
          </div>
          <span className="font-display font-bold text-white text-2xl">NeuroCare</span>
        </Link>

        <div className="glass rounded-2xl border border-[var(--neural-border)] p-8">
          <h1 className="font-display font-bold text-2xl text-white mb-2">Welcome back</h1>
          <p className="text-[var(--text-secondary)] text-sm mb-8">Sign in to your NeuroCare account</p>

          <div className="flex gap-2 p-1 glass rounded-xl border border-[var(--neural-border)] mb-8">
            {[
              { value: "patient", icon: RiUserLine, label: "Patient" },
              { value: "doctor", icon: RiStethoscopeLine, label: "Doctor" },
            ].map(({ value, icon: Icon, label }) => (
              <button key={value} type="button" onClick={() => setRole(value)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-display font-medium transition-all ${
                  role === value ? "bg-[var(--cyber-primary)] text-[#040d1a]" : "text-[var(--text-secondary)] hover:text-white"
                }`}>
                <Icon size={16} />{label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-display font-medium text-[var(--text-secondary)] mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-cyber"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-display font-medium text-[var(--text-secondary)] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-cyber pr-12"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  {showPw ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="btn-cyber w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[var(--cyber-primary)] hover:underline">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
