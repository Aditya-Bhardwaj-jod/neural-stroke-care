import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../utils/api";
import { RiSearchLine, RiArrowRightLine } from "react-icons/ri";

const RISK_CONFIG = {
  Low: { color: "#00f5a0" },
  Medium: { color: "#f5a623" },
  High: { color: "#f53d3d" },
};

export default function HistoryPage() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    api.get("/history").then(({ data }) => setAssessments(data.assessments)).finally(() => setLoading(false));
  }, []);

  const filtered = assessments.filter(a => {
    const matchFilter = filter === "All" || a.risk_level === filter;
    const matchSearch = !search || a.risk_level.toLowerCase().includes(search.toLowerCase()) ||
      new Date(a.created_at).toLocaleDateString().includes(search);
    return matchFilter && matchSearch;
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white mb-2">Assessment History</h1>
          <p className="text-[var(--text-secondary)] text-sm">All your previous stroke risk assessments</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by date or risk..." className="input-cyber pl-9" />
          </div>
          <div className="flex gap-2">
            {["All", "Low", "Medium", "High"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-display font-medium border transition-all ${
                  filter === f ? "bg-[var(--cyber-primary)] text-[#040d1a] border-[var(--cyber-primary)]" : "glass border-[var(--neural-border)] text-[var(--text-secondary)]"
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-muted)]">
            <p className="text-lg mb-3">No assessments found</p>
            <Link to="/patient/assessment" className="btn-cyber text-sm py-2 px-6">Run First Assessment</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((a, i) => {
              const cfg = RISK_CONFIG[a.risk_level] || { color: "var(--text-muted)" };
              return (
                <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/patient/results/${a.id}`}
                    className="flex items-center justify-between p-5 glass glass-hover rounded-2xl border border-[var(--neural-border)] group">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-display font-semibold text-white">{a.risk_level} Risk</span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: `${cfg.color}15`, color: cfg.color }}>
                            {a.risk_score}%
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · BMI {a.bmi} · Glucose {a.avg_glucose_level}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-[var(--text-muted)]">Confidence</p>
                        <p className="text-sm font-mono font-bold text-white">{a.confidence}%</p>
                      </div>
                      <RiArrowRightLine className="text-[var(--text-muted)] group-hover:text-[var(--cyber-primary)] transition-colors" size={18} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
