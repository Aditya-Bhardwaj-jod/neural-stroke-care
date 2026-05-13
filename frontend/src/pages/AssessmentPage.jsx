import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../utils/api";
import { RiArrowRightLine, RiArrowLeftLine, RiBrainLine } from "react-icons/ri";

const STEPS = [
  { title: "Basic Info", desc: "Your age and gender" },
  { title: "Vitals", desc: "BMI, glucose & pressure" },
  { title: "Medical History", desc: "Past conditions" },
  { title: "Lifestyle", desc: "Habits & work" },
];

const DEFAULTS = {
  age: "", gender: "Male", bmi: "", avg_glucose_level: "",
  hypertension: 0, heart_disease: 0,
  ever_married: "Yes", work_type: "Private",
  residence_type: "Urban", smoking_status: "never smoked",
};

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-display font-medium text-[var(--text-secondary)] mb-1">{label}</label>
      {hint && <p className="text-xs text-[var(--text-muted)] mb-2">{hint}</p>}
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <Field label={label}>
      <div className="flex gap-3">
        {["Yes", "No"].map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt === "Yes" ? 1 : 0)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-display font-medium border transition-all ${
              (opt === "Yes" ? 1 : 0) === value
                ? "bg-[var(--cyber-primary)] text-[#040d1a] border-[var(--cyber-primary)]"
                : "glass border-[var(--neural-border)] text-[var(--text-secondary)]"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </Field>
  );
}

export default function AssessmentPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/predict", {
        ...form,
        age: Number(form.age),
        bmi: Number(form.bmi),
        avg_glucose_level: Number(form.avg_glucose_level),
      });
      navigate(`/patient/results/${data.assessment_id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Prediction failed. Please try again.");
      setLoading(false);
    }
  };

  const sel = (k, options) => (
    <select value={form[k]} onChange={e => upd(k, e.target.value)} className="input-cyber">
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );

  const inp = (k, type = "number", placeholder = "") => (
    <input type={type} value={form[k]} onChange={e => upd(k, e.target.value)} className="input-cyber" placeholder={placeholder} />
  );

  const stepContent = [
    // Step 0: Basic Info
    <div key="s0" className="space-y-5">
      <Field label="Age" hint="Your current age in years">
        {inp("age", "number", "55")}
      </Field>
      <Field label="Gender">
        <div className="flex gap-3">
          {["Male", "Female", "Other"].map(g => (
            <button key={g} type="button" onClick={() => upd("gender", g)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-display font-medium border transition-all ${
                form.gender === g ? "bg-[var(--cyber-primary)] text-[#040d1a] border-[var(--cyber-primary)]" : "glass border-[var(--neural-border)] text-[var(--text-secondary)]"
              }`}>
              {g}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Marital Status">
        <div className="flex gap-3">
          {["Yes", "No"].map(v => (
            <button key={v} type="button" onClick={() => upd("ever_married", v)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-display font-medium border transition-all ${
                form.ever_married === v ? "bg-[var(--cyber-primary)] text-[#040d1a] border-[var(--cyber-primary)]" : "glass border-[var(--neural-border)] text-[var(--text-secondary)]"
              }`}>
              {v === "Yes" ? "Married" : "Single"}
            </button>
          ))}
        </div>
      </Field>
    </div>,

    // Step 1: Vitals
    <div key="s1" className="space-y-5">
      <Field label="BMI (Body Mass Index)" hint="Normal range: 18.5 – 24.9">
        {inp("bmi", "number", "24.5")}
      </Field>
      <Field label="Average Glucose Level (mg/dL)" hint="Normal fasting: 70 – 99 mg/dL">
        {inp("avg_glucose_level", "number", "106")}
      </Field>
      <Field label="Residence Type">
        <div className="flex gap-3">
          {["Urban", "Rural"].map(v => (
            <button key={v} type="button" onClick={() => upd("residence_type", v)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-display font-medium border transition-all ${
                form.residence_type === v ? "bg-[var(--cyber-primary)] text-[#040d1a] border-[var(--cyber-primary)]" : "glass border-[var(--neural-border)] text-[var(--text-secondary)]"
              }`}>
              {v}
            </button>
          ))}
        </div>
      </Field>
    </div>,

    // Step 2: Medical History
    <div key="s2" className="space-y-6">
      <Toggle label="Hypertension (High Blood Pressure)" value={form.hypertension} onChange={v => upd("hypertension", v)} />
      <Toggle label="Heart Disease" value={form.heart_disease} onChange={v => upd("heart_disease", v)} />
    </div>,

    // Step 3: Lifestyle
    <div key="s3" className="space-y-5">
      <Field label="Work Type">
        {sel("work_type", ["Private", "Self-employed", "Govt_job", "children", "Never_worked"])}
      </Field>
      <Field label="Smoking Status">
        {sel("smoking_status", ["never smoked", "formerly smoked", "smokes", "Unknown"])}
      </Field>
    </div>,
  ];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white mb-2">Stroke Risk Assessment</h1>
          <p className="text-[var(--text-secondary)] text-sm">Complete all steps for your personalized AI prediction</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-bold border transition-all ${
                i < step ? "bg-[var(--cyber-primary)] border-[var(--cyber-primary)] text-[#040d1a]"
                : i === step ? "border-[var(--cyber-primary)] text-[var(--cyber-primary)]"
                : "border-[var(--neural-border)] text-[var(--text-muted)]"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px transition-all ${i < step ? "bg-[var(--cyber-primary)]" : "bg-[var(--neural-border)]"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl border border-[var(--neural-border)] p-8">
          <div className="mb-6">
            <h2 className="font-display font-semibold text-xl text-white">{STEPS[step].title}</h2>
            <p className="text-sm text-[var(--text-muted)]">{STEPS[step].desc}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {stepContent[step]}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div className="mt-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="btn-ghost flex items-center gap-2 py-3 px-5">
                <RiArrowLeftLine /> Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} className="btn-cyber flex-1 flex items-center justify-center gap-2 py-3">
                Continue <RiArrowRightLine />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-cyber flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#040d1a] border-t-transparent rounded-full animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <><RiBrainLine /> Run AI Analysis</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
