import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { RiShieldCrossLine, RiUserLine, RiStethoscopeLine, RiArrowRightLine, RiArrowLeftLine } from "react-icons/ri";

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const SPECIALIZATIONS = ["Neurologist", "Cardiologist", "General Physician", "Internist", "Radiologist", "Other"];

export default function SignupPage() {
  const [role, setRole] = useState("patient");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "", email: "", password: "", confirm_password: "",
    age: "", gender: "Male", phone: "", blood_group: "O+",
    specialization: "Neurologist", license_number: "", hospital: "",
  });

  const upd = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const updDirect = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const payload = { ...form, role };
      const data = await signup(payload);
      navigate(data.user.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard");
    } catch (err) {
      setError(err.response && err.response.data ? err.response.data.error : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 2;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen neural-grid-bg flex items-center justify-center px-4 py-12">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--cyber-primary)]/5 rounded-full blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--cyber-primary)] to-[var(--cyber-secondary)] flex items-center justify-center">
            <RiShieldCrossLine className="text-[#040d1a]" size={20} />
          </div>
          <span className="font-display font-bold text-white text-2xl">NeuroCare</span>
        </Link>

        <div className="glass rounded-2xl border border-[var(--neural-border)] p-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-display font-bold text-2xl text-white">Create Account</h1>
            <span className="text-xs font-mono text-[var(--text-muted)]">Step {step}/{totalSteps}</span>
          </div>

          <div className="w-full h-1 bg-[var(--neural-border)] rounded-full mb-8">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-secondary)]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {step === 1 && (
            <div className="flex gap-2 p-1 glass rounded-xl border border-[var(--neural-border)] mb-6">
              {[
                { value: "patient", icon: RiUserLine, label: "Patient" },
                { value: "doctor", icon: RiStethoscopeLine, label: "Doctor" },
              ].map(({ value, icon: Icon, label }) => (
                <button key={value} type="button" onClick={() => setRole(value)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-display font-medium transition-all ${
                    role === value ? "bg-[var(--cyber-primary)] text-[#040d1a]" : "text-[var(--text-secondary)]"
                  }`}>
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <label className="block text-xs font-display font-medium text-[var(--text-secondary)] mb-2">Full Name</label>
                  <input type="text" value={form.full_name} onChange={upd("full_name")} className="input-cyber" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-display font-medium text-[var(--text-secondary)] mb-2">Email</label>
                  <input type="email" value={form.email} onChange={upd("email")} className="input-cyber" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-display font-medium text-[var(--text-secondary)] mb-2">Password</label>
                  <input type="password" value={form.password} onChange={upd("password")} className="input-cyber" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-xs font-display font-medium text-[var(--text-secondary)] mb-2">Confirm Password</label>
                  <input type="password" value={form.confirm_password} onChange={upd("confirm_password")} className="input-cyber" placeholder="••••••••" />
                </div>
              </motion.div>
            )}

            {step === 2 && role === "patient" && (
              <motion.div key="step2p" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-display font-medium text-[var(--text-secondary)] mb-2">Age</label>
                    <input type="number" value={form.age} onChange={upd("age")} className="input-cyber" placeholder="45" />
                  </div>
                  <div>
                    <label className="block text-xs font-display font-medium text-[var(--text-secondary)] mb-2">Phone</label>
                    <input type="text" value={form.phone} onChange={upd("phone")} className="input-cyber" placeholder="+91..." />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-display font-medium text-[var(--text-secondary)] mb-2">Gender</label>
                  <div className="flex gap-2">
                    {GENDER_OPTIONS.map(g => (
                      <button key={g} type="button" onClick={() => updDirect("gender", g)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-display font-medium border transition-all ${
                          form.gender === g ? "bg-[var(--cyber-primary)] text-[#040d1a] border-[var(--cyber-primary)]" : "glass border-[var(--neural-border)] text-[var(--text-secondary)]"
                        }`}>{g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-display font-medium text-[var(--text-secondary)] mb-2">Blood Group</label>
                  <select value={form.blood_group} onChange={upd("blood_group")} className="input-cyber">
                    {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </motion.div>
            )}

            {step === 2 && role === "doctor" && (
              <motion.div key="step2d" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <label className="block text-xs font-display font-medium text-[var(--text-secondary)] mb-2">Specialization</label>
                  <select value={form.specialization} onChange={upd("specialization")} className="input-cyber">
                    {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-display font-medium text-[var(--text-secondary)] mb-2">Medical License Number</label>
                  <input type="text" value={form.license_number} onChange={upd("license_number")} className="input-cyber" placeholder="MCI-XXXXXX" />
                </div>
                <div>
                  <label className="block text-xs font-display font-medium text-[var(--text-secondary)] mb-2">Hospital / Clinic</label>
                  <input type="text" value={form.hospital} onChange={upd("hospital")} className="input-cyber" placeholder="Apollo Hospital, Delhi" />
                </div>
                <div>
                  <label className="block text-xs font-display font-medium text-[var(--text-secondary)] mb-2">Phone</label>
                  <input type="text" value={form.phone} onChange={upd("phone")} className="input-cyber" placeholder="+91..." />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button type="button" onClick={() => setStep(s => s - 1)} className="btn-ghost flex items-center gap-2 py-3 px-5">
                <RiArrowLeftLine /> Back
              </button>
            )}
            {step < totalSteps ? (
              <button type="button" onClick={() => setStep(s => s + 1)} className="btn-cyber flex-1 flex items-center justify-center gap-2 py-3">
                Continue <RiArrowRightLine />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading} className="btn-cyber flex-1 py-3 disabled:opacity-50">
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            )}
          </div>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[var(--cyber-primary)] hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
