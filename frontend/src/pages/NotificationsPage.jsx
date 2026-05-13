import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../utils/api";
import { RiBellLine, RiCheckDoubleLine, RiHeartPulseLine, RiMessage2Line, RiAlertLine, RiSettings3Line } from "react-icons/ri";

const TYPE_CONFIG = {
  assessment: { icon: RiHeartPulseLine, color: "var(--cyber-primary)" },
  message: { icon: RiMessage2Line, color: "#00f5a0" },
  alert: { icon: RiAlertLine, color: "#f53d3d" },
  system: { icon: RiSettings3Line, color: "var(--text-muted)" },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    api.get("/notifications").then(({ data }) => setNotifs(data.notifications)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifs(); }, []);

  const markAllRead = async () => {
    await api.put("/notifications/read-all");
    fetchNotifs();
  };

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const unread = notifs.filter(n => !n.is_read).length;

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-white mb-1">Notifications</h1>
            {unread > 0 && <p className="text-sm text-[var(--cyber-primary)]">{unread} unread</p>}
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} className="btn-ghost py-2 px-4 text-sm flex items-center gap-2">
              <RiCheckDoubleLine /> Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}</div>
        ) : notifs.length === 0 ? (
          <div className="text-center py-20">
            <RiBellLine size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-30" />
            <p className="text-[var(--text-muted)]">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifs.map((n, i) => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => !n.is_read && markRead(n.id)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                    n.is_read
                      ? "glass border-[var(--neural-border)] opacity-60"
                      : "border-[var(--neural-border-hover)] glass-hover"
                  }`}
                  style={{ background: n.is_read ? undefined : `${cfg.color}05` }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}25` }}>
                    <Icon size={18} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-display font-semibold text-white">{n.title}</p>
                      {!n.is_read && <span className="w-2 h-2 rounded-full bg-[var(--cyber-primary)] flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
