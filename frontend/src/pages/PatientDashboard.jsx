import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import {
  RiHeartPulseLine, RiArrowRightLine, RiAlertLine,
  RiHistoryLine, RiBarChartLine, RiAddLine
} from "react-icons/ri";

const RISK_CONFIG = {
  Low: { color: "var(--risk-low)", bg: "risk-low-bg", label: "Low Risk" },
  Medium: { color: "var(--risk-medium)", bg: "risk-medium-bg", label: "Medium Risk" },
  High: { color: "var(--risk-high)", bg: "risk-high-bg", label: "High Risk" },
};

function StatCard({ title, value, sub, icon: Icon, color }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="glass glass-hover rounded-2xl p-6 border border-[var(--neural-border)]">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <p className="font-display font-bold text-3xl text-white mb-1">{value ?? "—"}</p>
      <p className="text-sm font-display font-medium text-white mb-1">{title}</p>
      {sub && <p className="text-xs text-[var(--text-muted)]">{sub}</p>}
    </motion.div>
  );
}

export default function PatientDashboard() {
  const { profile } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/analytics"), api.get("/history")])
      .then(([a, h]) => {
        setAnalytics(a.data.analytics);
        setHistory(h.data.assessments.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  const latest = analytics?.latest_risk_level;
  const riskCfg = latest ? RISK_CONFIG[latest] : null;

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-white">
              Hello, {profile?.full_name?.split(" ")[0] || "Patient"} 👋
            </h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">Here's your neural health overview</p>
          </div>
          <Link to="/patient/assessment" className="btn-cyber flex items-center gap-2 py-2.5 px-5 text-sm">
            <RiAddLine size={16} /> New Assessment
          </Link>
        </div>

        {/* Risk banner */}
        {riskCfg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-5 border mb-8 flex items-center justify-between ${riskCfg.bg}`}
          >
            <div className="flex items-center gap-4">
              <RiAlertLine size={24} style={{ color: riskCfg.color }} />
              <div>
                <p className="font-display font-semibold text-white">Latest Risk Assessment</p>
                <p className="text-sm" style={{ color: riskCfg.color }}>{riskCfg.label} — {analytics?.latest_risk_score?.toFixed(1)}% stroke risk score</p>
              </div>
            </div>
            <Link to="/patient/history" className="text-xs font-display font-medium flex items-center gap-1" style={{ color: riskCfg.color }}>
              View Details <RiArrowRightLine />
            </Link>
          </motion.div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Assessments" value={analytics?.total_assessments} icon={RiBarChartLine} color="var(--cyber-primary)" />
          <StatCard title="Latest Risk Score" value={analytics?.latest_risk_score ? `${analytics.latest_risk_score}%` : null} icon={RiHeartPulseLine} color="var(--risk-medium)" sub="stroke probability" />
          <StatCard title="Risk Level" value={analytics?.latest_risk_level} icon={RiAlertLine} color={riskCfg?.color || "var(--text-muted)"} />
          <StatCard title="Test History" value={history.length} icon={RiHistoryLine} color="var(--risk-low)" sub="recent records shown" />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Risk trend */}
          <div className="glass rounded-2xl border border-[var(--neural-border)] p-6">
            <h3 className="font-display font-semibold text-white mb-4">Risk Score Trend</h3>
            {analytics?.risk_trend?.length > 1 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={analytics.risk_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#071528", border: "1px solid var(--neural-border)", borderRadius: 8, color: "white" }} />
                  <Line type="monotone" dataKey="risk" stroke="var(--cyber-primary)" strokeWidth={2} dot={{ fill: "var(--cyber-primary)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-[var(--text-muted)] text-sm">
                Run multiple assessments to see your trend
              </div>
            )}
          </div>

          {/* Glucose trend */}
          <div className="glass rounded-2xl border border-[var(--neural-border)] p-6">
            <h3 className="font-display font-semibold text-white mb-4">Glucose Level Trend</h3>
            {analytics?.glucose_trend?.length > 1 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={analytics.glucose_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#071528", border: "1px solid var(--neural-border)", borderRadius: 8, color: "white" }} />
                  <Line type="monotone" dataKey="glucose" stroke="var(--risk-medium)" strokeWidth={2} dot={{ fill: "var(--risk-medium)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-[var(--text-muted)] text-sm">
                Not enough data yet
              </div>
            )}
          </div>
        </div>

        {/* Recent assessments */}
        <div className="glass rounded-2xl border border-[var(--neural-border)] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-white">Recent Assessments</h3>
            <Link to="/patient/history" className="text-xs text-[var(--cyber-primary)] flex items-center gap-1 hover:underline">
              View All <RiArrowRightLine size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-muted)] text-sm">
              No assessments yet.{" "}
              <Link to="/patient/assessment" className="text-[var(--cyber-primary)] hover:underline">Run your first one →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((a) => {
                const cfg = RISK_CONFIG[a.risk_level] || {};
                return (
                  <Link key={a.id} to={`/patient/results/${a.id}`} className="flex items-center justify-between p-4 rounded-xl border border-[var(--neural-border)] hover:border-[var(--neural-border-hover)] transition-all glass-hover">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                      <div>
                        <p className="text-sm font-display font-medium text-white">{a.risk_level} Risk</p>
                        <p className="text-xs text-[var(--text-muted)]">{new Date(a.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-bold" style={{ color: cfg.color }}>{a.risk_score}%</p>
                      <p className="text-xs text-[var(--text-muted)]">confidence {a.confidence}%</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
