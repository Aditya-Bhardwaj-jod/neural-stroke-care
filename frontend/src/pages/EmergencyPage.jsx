import { motion } from "framer-motion";
import DashboardLayout from "../components/layout/DashboardLayout";
import { RiAlertLine, RiPhoneLine, RiHospitalLine, RiHeartPulseLine, RiInformationLine } from "react-icons/ri";

const HOSPITALS = [
  { name: "AIIMS New Delhi", address: "Ansari Nagar, New Delhi", phone: "011-26588500", distance: "Nearest Major" },
  { name: "Apollo Hospital", address: "Sarita Vihar, Delhi", phone: "1860-500-1066", distance: "~5 km" },
  { name: "Fortis Hospital", address: "Vasant Kunj, New Delhi", phone: "1800-1234", distance: "~8 km" },
];

const SYMPTOMS = [
  { icon: "😶", label: "Face drooping on one side" },
  { icon: "💪", label: "Arm weakness or numbness" },
  { icon: "🗣️", label: "Speech difficulty or slurring" },
  { icon: "👁️", label: "Sudden vision loss" },
  { icon: "🤕", label: "Severe sudden headache" },
  { icon: "🚶", label: "Loss of balance or coordination" },
];

export default function EmergencyPage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        {/* Emergency Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl p-8 text-center border border-red-500/40"
          style={{ background: "rgba(245,61,61,0.06)", boxShadow: "0 0 60px rgba(245,61,61,0.1)" }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{ background: "rgba(245,61,61,0.15)", border: "2px solid rgba(245,61,61,0.5)" }}
          >
            <RiAlertLine size={36} className="text-red-400" />
          </motion.div>
          <h1 className="font-display font-bold text-3xl text-white mb-3">Stroke Emergency</h1>
          <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto text-sm leading-relaxed">
            If you or someone nearby is experiencing stroke symptoms, every second counts. Call emergency services immediately.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="tel:112" className="flex items-center gap-3 px-8 py-4 rounded-2xl font-display font-bold text-white text-lg transition-all hover:scale-105"
              style={{ background: "rgba(245,61,61,0.25)", border: "2px solid rgba(245,61,61,0.6)", boxShadow: "0 0 30px rgba(245,61,61,0.3)" }}>
              <RiPhoneLine size={24} /> 112 — National Emergency
            </a>
            <a href="tel:102" className="flex items-center gap-3 px-8 py-4 rounded-2xl font-display font-bold text-white text-lg transition-all hover:scale-105"
              style={{ background: "rgba(245,61,61,0.15)", border: "1px solid rgba(245,61,61,0.4)" }}>
              <RiPhoneLine size={24} /> 102 — Ambulance
            </a>
          </div>
        </motion.div>

        {/* FAST Signs */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass rounded-2xl border border-[var(--neural-border)] p-6">
          <h2 className="font-display font-semibold text-white mb-5 flex items-center gap-2">
            <RiHeartPulseLine className="text-red-400" /> Recognize Stroke Symptoms
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SYMPTOMS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
                className="p-4 rounded-xl border border-red-500/20 text-center"
                style={{ background: "rgba(245,61,61,0.05)" }}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className="text-xs text-[var(--text-secondary)] leading-snug">{s.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 p-4 rounded-xl border border-[var(--cyber-primary)]/20"
            style={{ background: "rgba(0,212,245,0.04)" }}>
            <p className="text-sm text-[var(--cyber-primary)] font-display font-semibold mb-1">Remember: BE-FAST</p>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              <span className="text-white font-medium">B</span>alance · <span className="text-white font-medium">E</span>yes · <span className="text-white font-medium">F</span>ace · <span className="text-white font-medium">A</span>rms · <span className="text-white font-medium">S</span>peech · <span className="text-white font-medium">T</span>ime to call 112
            </p>
          </div>
        </motion.div>

        {/* Nearby Hospitals */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass rounded-2xl border border-[var(--neural-border)] p-6">
          <h2 className="font-display font-semibold text-white mb-5 flex items-center gap-2">
            <RiHospitalLine className="text-[var(--cyber-primary)]" /> Nearby Hospitals
          </h2>
          <div className="space-y-3">
            {HOSPITALS.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-[var(--neural-border)] glass-hover">
                <div>
                  <p className="font-display font-semibold text-white text-sm">{h.name}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{h.address}</p>
                  <span className="text-xs text-[var(--cyber-primary)] font-mono">{h.distance}</span>
                </div>
                <a href={`tel:${h.phone}`} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display font-medium text-[var(--cyber-primary)] border border-[var(--cyber-primary)]/30 hover:bg-[var(--cyber-primary)]/10 transition-all">
                  <RiPhoneLine size={14} /> Call
                </a>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-2xl border border-[var(--neural-border)] p-6">
          <h2 className="font-display font-semibold text-white mb-5 flex items-center gap-2">
            <RiInformationLine className="text-[var(--cyber-primary)]" /> What To Do Right Now
          </h2>
          <div className="space-y-3">
            {[
              "Call 112 immediately — don't wait to see if symptoms improve",
              "Keep the person calm and still — don't give food or water",
              "Note the exact time symptoms started — tell the doctors",
              "Do NOT drive yourself — wait for the ambulance",
              "Stay on the line with emergency services until help arrives",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#040d1a] mt-0.5"
                  style={{ background: "var(--cyber-primary)" }}>{i + 1}</div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
