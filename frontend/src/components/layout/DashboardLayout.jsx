import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  RiDashboardLine, RiHeartPulseLine, RiHistoryLine, RiMessage2Line,
  RiBellLine, RiSettings3Line, RiAlertLine, RiLogoutBoxLine,
  RiMenuLine, RiCloseLine, RiUserLine, RiStethoscopeLine,
  RiShieldCrossLine, RiGroupLine
} from "react-icons/ri";

export default function DashboardLayout({ children }) {
  const { user, profile, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const isPatient = user?.role === "patient";
  const base = isPatient ? "/patient" : "/doctor";

  const patientLinks = [
    { to: `${base}/dashboard`, icon: RiDashboardLine, label: "Dashboard" },
    { to: `${base}/assessment`, icon: RiHeartPulseLine, label: "Assessment" },
    { to: `${base}/history`, icon: RiHistoryLine, label: "History" },
    { to: `${base}/messages`, icon: RiMessage2Line, label: "Messages" },
    { to: `${base}/notifications`, icon: RiBellLine, label: "Notifications" },
    { to: `${base}/emergency`, icon: RiAlertLine, label: "Emergency" },
    { to: `${base}/settings`, icon: RiSettings3Line, label: "Settings" },
  ];

  const doctorLinks = [
    { to: `${base}/dashboard`, icon: RiDashboardLine, label: "Dashboard" },
    { to: `${base}/messages`, icon: RiMessage2Line, label: "Messages" },
    { to: `${base}/notifications`, icon: RiBellLine, label: "Notifications" },
    { to: `${base}/settings`, icon: RiSettings3Line, label: "Settings" },
  ];

  const links = isPatient ? patientLinks : doctorLinks;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--neural-border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--cyber-primary)] to-[var(--cyber-secondary)] flex items-center justify-center">
            <RiShieldCrossLine className="text-[#040d1a] text-sm" />
          </div>
          <span className="font-display font-bold text-white text-lg">NeuroCare</span>
        </div>
      </div>

      {/* Profile quick view */}
      <div className="p-4 mx-4 mt-4 rounded-xl glass border border-[var(--neural-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--cyber-primary)] to-[var(--cyber-secondary)] flex items-center justify-center text-[#040d1a] font-bold text-sm">
            {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-display font-semibold text-white truncate">
              {isPatient ? profile?.full_name : `Dr. ${profile?.full_name}`}
            </p>
            <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[var(--neural-border)]">
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-400/10">
          <RiLogoutBoxLine size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen neural-grid-bg flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 glass border-r border-[var(--neural-border)] fixed h-full z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 h-full w-64 glass border-r border-[var(--neural-border)] z-50 lg:hidden"
              initial={{ x: -264 }} animate={{ x: 0 }} exit={{ x: -264 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top navbar */}
        <header className="glass border-b border-[var(--neural-border)] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button className="lg:hidden text-[var(--text-secondary)]" onClick={() => setSidebarOpen(true)}>
            <RiMenuLine size={22} />
          </button>
          <div className="hidden lg:block">
            <p className="text-xs text-[var(--text-muted)] font-mono">NEUROCARE / {user?.role?.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-3">
            <NavLink to={`${base}/notifications`} className="w-9 h-9 glass rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--cyber-primary)] transition-colors relative">
              <RiBellLine size={18} />
            </NavLink>
            <NavLink to={`${base}/settings`} className="w-9 h-9 glass rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--cyber-primary)] transition-colors">
              <RiSettings3Line size={18} />
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
