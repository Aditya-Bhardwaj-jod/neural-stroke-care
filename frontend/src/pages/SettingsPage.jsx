import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { RiUserLine, RiLockLine, RiCheckLine } from "react-icons/ri";

export default function SettingsPage() {
  const { user, profile, fetchProfile } = useAuth();
  const isPatient = user?.role === "patient";

  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    age: profile?.age || "",
    blood_group: profile?.blood_group || "",
    emergency_contact: profile?.emergency_contact || "",
    specialization: profile?.specialization || "",
    hospital: profile?.hospital || "",
    license_number: profile?.license_number || "",
  });

  const [pwForm, setPwForm] = useState({ current: "", new: "", confirm: "" });
  const [profileSaved, setProfileSaved] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const upd = (k, v) => setProfileForm(f => ({ ...f, [k]: v }));

  const saveProfile = async () => {
    setSaving(true);
    try {
      const endpoint = isPatient ? "/profile" : "/doctor/profile";
      await api.put(endpoint, profileForm);
      await fetchProfile();
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, k, type = "text", placeholder }) => (
    <div>
      <label className="block text-xs font-display font-medium text-[var(--text-secondary)] mb-2">{label}</label>
      <input type={type} value={profileForm[k]} onChange={e => upd(k, e.target.value)}
        className="input-cyber" placeholder={placeholder} />
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div className="mb-2">
          <h1 className="font-display font-bold text-3xl text-white">Settings</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-[var(--neural-border)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[var(--cyber-primary)]/10 border border-[var(--cyber-primary)]/20 flex items-center justify-center">
              <RiUserLine size={18} className="text-[var(--cyber-primary)]" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-white">Profile Information</h2>
              <p className="text-xs text-[var(--text-muted)]">Update your personal details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" k="full_name" placeholder="John Doe" />
            <Field label="Phone" k="phone" placeholder="+91 9876543210" />
            {isPatient && <>
              <Field label="Age" k="age" type="number" placeholder="45" />
              <Field label="Blood Group" k="blood_group" placeholder="O+" />
              <div className="sm:col-span-2">
                <Field label="Emergency Contact" k="emergency_contact" placeholder="Name - +91 XXXXXXXXXX" />
              </div>
            </>}
            {!isPatient && <>
              <Field label="Specialization" k="specialization" placeholder="Neurologist" />
              <Field label="Hospital" k="hospital" placeholder="Apollo Hospital" />
              <div className="sm:col-span-2">
                <Field label="License Number" k="license_number" placeholder="MCI-XXXXXX" />
              </div>
            </>}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button onClick={saveProfile} disabled={saving} className="btn-cyber py-2.5 px-6 text-sm flex items-center gap-2 disabled:opacity-50">
              {saving ? "Saving..." : profileSaved ? <><RiCheckLine /> Saved!</> : "Save Changes"}
            </button>
          </div>
        </motion.div>

        {/* Account info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-2xl border border-[var(--neural-border)] p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-[var(--cyber-primary)]/10 border border-[var(--cyber-primary)]/20 flex items-center justify-center">
              <RiLockLine size={18} className="text-[var(--cyber-primary)]" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-white">Account</h2>
              <p className="text-xs text-[var(--text-muted)]">Your login details</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-xs text-[var(--text-muted)]">Email</p>
              <p className="text-sm font-display font-medium text-white mt-1">{user?.email}</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-xs text-[var(--text-muted)]">Role</p>
              <p className="text-sm font-display font-medium text-white mt-1 capitalize">{user?.role}</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-xs text-[var(--text-muted)]">Member Since</p>
              <p className="text-sm font-display font-medium text-white mt-1">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
