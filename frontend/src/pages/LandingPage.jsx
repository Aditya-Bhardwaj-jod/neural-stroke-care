import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { RiShieldCrossLine, RiBrainLine, RiHeartPulseLine, RiArrowRightLine, RiStarLine, RiAlertLine } from "react-icons/ri";

const STATS = [
  { label: "Patients Monitored", value: "12,400+" },
  { label: "Risk Assessments", value: "48,000+" },
  { label: "Model Accuracy", value: "94.7%" },
  { label: "Lives Impacted", value: "3,200+" },
];

const FEATURES = [
  { icon: RiBrainLine, title: "AI Neural Analysis", desc: "Advanced ML models trained on thousands of clinical cases to predict stroke risk with high accuracy." },
  { icon: RiHeartPulseLine, title: "Real-time Monitoring", desc: "Track your health metrics continuously and receive instant alerts when risk factors change." },
  { icon: RiShieldCrossLine, title: "Clinical Reports", desc: "Download professional PDF reports to share with your doctor or keep in your health records." },
  { icon: RiAlertLine, title: "Emergency Support", desc: "One-tap emergency contact system with nearby hospital finder in case of critical risk detection." },
];

const TESTIMONIALS = [
  { name: "Dr. Priya Mehta", role: "Cardiologist, AIIMS", text: "NeuroCare's prediction model has become an invaluable tool in our clinic. The accuracy is remarkable." },
  { name: "Rahul Sharma", role: "Patient, 58", text: "The app flagged my elevated risk before I even knew something was wrong. My doctor adjusted my treatment immediately." },
  { name: "Dr. Arun Kapoor", role: "Neurologist, Apollo", text: "The dashboard gives me a clear picture of all my high-risk patients. This is the future of preventive care." },
];

function NeuralBrain() {
  return (
    <div className="relative w-80 h-80 mx-auto">
      <motion.div
        className="absolute inset-0 rounded-full border border-[var(--cyber-primary)]/20"
        animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-8 rounded-full border border-[var(--cyber-primary)]/15"
        animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-16 rounded-full border border-[var(--cyber-primary)]/10"
        animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      {/* Orbiting dots */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[var(--cyber-primary)]"
          style={{
            top: "50%", left: "50%",
            x: Math.cos((deg * Math.PI) / 180) * 120 - 4,
            y: Math.sin((deg * Math.PI) / 180) * 120 - 4,
            boxShadow: "0 0 8px var(--cyber-primary)"
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-32 h-32 rounded-full glass border border-[var(--cyber-primary)]/40 flex items-center justify-center"
          style={{ boxShadow: "0 0 40px rgba(0,212,245,0.3)" }}
        >
          <RiBrainLine size={56} className="text-[var(--cyber-primary)]" />
        </motion.div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="neural-grid-bg min-h-screen">
      {/* Navbar */}
      <nav className="glass border-b border-[var(--neural-border)] px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--cyber-primary)] to-[var(--cyber-secondary)] flex items-center justify-center">
            <RiShieldCrossLine className="text-[#040d1a] text-sm" />
          </div>
          <span className="font-display font-bold text-white text-xl">NeuroCare</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="btn-ghost text-sm py-2 px-5">Login</Link>
          <Link to="/signup" className="btn-cyber text-sm py-2 px-5">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-8 pt-24 pb-32 max-w-7xl mx-auto">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[var(--cyber-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[var(--neural-border)] text-xs font-mono text-[var(--cyber-primary)] mb-8">
              <span className="w-2 h-2 rounded-full bg-[var(--cyber-primary)] animate-pulse" />
              AI-POWERED NEURAL HEALTH INTELLIGENCE
            </div>

            <h1 className="font-display font-bold text-5xl lg:text-6xl leading-tight text-white mb-6">
              Predict Stroke Risk <br />
              <span className="gradient-text">Before It Happens</span>
            </h1>

            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-10 max-w-lg">
              NeuroCare uses advanced machine learning to analyze your health data and deliver personalized stroke risk assessments — giving you and your doctor the intelligence to act early.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="btn-cyber text-base py-3 px-8 flex items-center gap-2">
                Start Free Assessment <RiArrowRightLine />
              </Link>
              <Link to="/login" className="btn-ghost text-base py-3 px-8">
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-12">
              {STATS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="glass rounded-xl p-4 border border-[var(--neural-border)]"
                >
                  <p className="font-display font-bold text-2xl text-[var(--cyber-primary)]">{s.value}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <NeuralBrain />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-24 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl text-white mb-4">Powered by Clinical Intelligence</h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">Built for patients who care about prevention and doctors who need reliable predictive tools.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass glass-hover rounded-2xl p-6 border border-[var(--neural-border)]"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--cyber-primary)]/10 border border-[var(--cyber-primary)]/20 flex items-center justify-center mb-4">
                <f.icon size={22} className="text-[var(--cyber-primary)]" />
              </div>
              <h3 className="font-display font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 py-24 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl text-white mb-4">How It Works</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Create Account", desc: "Sign up as a patient or doctor in under a minute." },
            { step: "02", title: "Input Health Data", desc: "Complete the guided health assessment form with your current metrics." },
            { step: "03", title: "Get AI Prediction", desc: "Receive instant stroke risk score with actionable recommendations." },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="relative glass rounded-2xl p-8 border border-[var(--neural-border)] text-center"
            >
              <div className="font-mono text-5xl font-bold text-[var(--cyber-primary)]/20 mb-4">{s.step}</div>
              <h3 className="font-display font-semibold text-xl text-white mb-3">{s.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-8 py-24 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl text-white mb-4">Trusted by Patients & Doctors</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 border border-[var(--neural-border)]"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <RiStarLine key={j} className="text-[var(--cyber-primary)] text-sm" />)}
              </div>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div>
                <p className="font-display font-semibold text-white text-sm">{t.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="px-8 py-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass rounded-3xl border border-red-500/30 p-12 text-center"
          style={{ background: "rgba(245, 61, 61, 0.03)" }}
        >
          <RiAlertLine size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="font-display font-bold text-3xl text-white mb-4">Stroke Emergency?</h2>
          <p className="text-[var(--text-secondary)] mb-6">If you or someone near you is showing stroke symptoms — face drooping, arm weakness, speech difficulty — call emergency services immediately.</p>
          <a href="tel:112" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-display font-semibold text-white" style={{ background: "rgba(245,61,61,0.2)", border: "1px solid rgba(245,61,61,0.4)" }}>
            📞 Call 112 — National Emergency
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-[var(--neural-border)] px-8 py-8 text-center text-sm text-[var(--text-muted)]">
        <p>© 2025 NeuroCare AI. Built with care for preventive healthcare.</p>
      </footer>
    </div>
  );
}
