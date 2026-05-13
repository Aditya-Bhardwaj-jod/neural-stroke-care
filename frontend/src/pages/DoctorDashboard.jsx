import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { RiGroupLine, RiAlertLine, RiToggleLine, RiToggleFill, RiUserLine } from "react-icons/ri";

const RISK_CONFIG = {
  Low: { color: "#00f5a0" },
  Medium: { color: "#f5a623" },
  High: { color: "#f53d3d" },
};

export default function DoctorDashboard() {
  const { profile, fetchProfile } = useAuth();
  const [patients, setPatients] = useState([]);
  const [highRisk, setHighRisk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    Promise.all([api.get("/doctor/patients"), api.get("/doctor/high-risk")])
      .then(([p, h]) => { setPatients(p.data.patients); setHighRisk(h.data.high_risk_patients); })
      .finally(() => setLoading(false));
  }, []);

  const toggleAvailability = async () => {
    setToggling(true);
    try {
      await api.put("/doctor/status");
      await fetchProfile();
    } finally {
      setToggling(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-white">
              Dr. {profile?.full_name?.split(" ")[0] || "Doctor"} 👨‍⚕️
            </h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">{profile?.specialization} · {profile?.hospital}</p>
          </div>
          <button onClick={toggleAvailability} disabled={toggling}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-medium text-sm border transition-all ${
              profile?.is_available
                ? "border-green-500/40 text-green-400 bg-green-500/10 hover:bg-green-500/20"
                : "border-red-500/40 text-red-400 bg-red-500/10 hover:bg-red-500/20"
            }`}>
            {profile?.is_available ? <RiToggleFill size={18} /> : <RiToggleLine size={18} />}
            {profile?.is_available ? "Available" : "Unavailable"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Patients", value: patients.length, icon: RiGroupLine, color: "var(--cyber-primary)" },
            { label: "High Risk Alerts", value: highRisk.length, icon: RiAlertLine, color: "#f53d3d" },
            { label: "Status", value: profile?.is_available ? "Online" : "Offline", icon: RiUserLine, color: profile?.is_available ? "#00f5a0" : "#f53d3d" },
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -3 }}
              className="glass glass-hover rounded-2xl p-5 border border-[var(--neural-border)]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <p className="font-display font-bold text-2xl text-white">{s.value ?? "—"}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* High Risk Patients */}
        {highRisk.length > 0 && (
          <div className="glass rounded-2xl border border-red-500/30 p-6 mb-6"
            style={{ background: "rgba(245,61,61,0.03)" }}>
            <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <RiAlertLine className="text-red-400" /> High Risk Alerts
            </h3>
            <div className="space-y-3">
              {highRisk.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-red-500/20"
                  style={{ background: "rgba(245,61,61,0.05)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">
                      {p.full_name?.[0] || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-display font-semibold text-white">{p.full_name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{p.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-bold text-red-400">{p.risk_score}%</p>
                    <p className="text-xs text-[var(--text-muted)]">{new Date(p.assessment_date).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All patients */}
        <div className="glass rounded-2xl border border-[var(--neural-border)] p-6">
          <h3 className="font-display font-semibold text-white mb-5 flex items-center gap-2">
            <RiGroupLine className="text-[var(--cyber-primary)]" /> All Patients
          </h3>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
          ) : patients.length === 0 ? (
            <p className="text-center py-8 text-[var(--text-muted)] text-sm">No patients registered yet</p>
          ) : (
            <div className="space-y-2">
              {patients.map((p, i) => {
                const cfg = p.latest_risk_level ? RISK_CONFIG[p.latest_risk_level] : { color: "var(--text-muted)" };
                return (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between p-4 rounded-xl border border-[var(--neural-border)] glass-hover">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--cyber-primary)]/20 to-[var(--cyber-secondary)]/20 border border-[var(--neural-border)] flex items-center justify-center font-bold text-sm text-[var(--cyber-primary)]">
                        {p.full_name?.[0] || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-display font-semibold text-white">{p.full_name || "Unknown"}</p>
                        <p className="text-xs text-[var(--text-muted)]">{p.email} · Age {p.age || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs font-mono font-bold" style={{ color: cfg.color }}>
                          {p.latest_risk_level || "No data"}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">{p.total_assessments} assessments</p>
                      </div>
                      {p.latest_risk_score && (
                        <span className="text-xs font-mono px-2 py-1 rounded-lg" style={{ background: `${cfg.color}15`, color: cfg.color }}>
                          {p.latest_risk_score}%
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
