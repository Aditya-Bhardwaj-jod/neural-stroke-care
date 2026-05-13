import os
import joblib
import numpy as np
import pandas as pd

_pipeline = None

# Exact work_type mapping as original app
WORK_TYPE_MAP = {
    "Private": "Private",
    "Self-employed": "Self-employed",
    "Govt_job": "Govt_job",
    "children": "children",
    "Never_worked": "Never_worked",
    # Frontend display values → model values
    "Government job": "Govt_job",
    "Never Worked": "Never_worked",
    "Children": "children",
}


def load_pipeline():
    global _pipeline
    if _pipeline is not None:
        return _pipeline

    # Try multiple paths
    paths = [
        os.getenv("ML_MODEL_PATH", ""),
        "ml/model.joblib",
        "model.joblib",
    ]
    for path in paths:
        if path and os.path.exists(path):
            model_data = joblib.load(path)
            _pipeline = model_data["model"]  # full sklearn pipeline
            print(f"[ML] Model loaded from: {path}")
            return _pipeline

    # Fallback mock
    print("[ML] WARNING: model.joblib not found — using mock model")
    _pipeline = _MockPipeline()
    return _pipeline


class _MockPipeline:
    """Heuristic fallback when model file is missing."""
    def predict_proba(self, df):
        row = df.iloc[0]
        score = 0.05
        try:
            if float(row.get("age", 0)) > 60: score += 0.25
            elif float(row.get("age", 0)) > 45: score += 0.12
            score += int(row.get("hypertension", 0)) * 0.18
            score += int(row.get("heart_disease", 0)) * 0.18
            if float(row.get("bmi", 0)) > 30: score += 0.10
            if float(row.get("avg_glucose_level", 0)) > 150: score += 0.12
            if str(row.get("smoking_status", "")).lower() == "smokes": score += 0.08
            score = min(score, 0.99)
        except Exception:
            pass
        return np.array([[1 - score, score]])


def predict_stroke_risk(data: dict) -> dict:
    """
    Accepts frontend form data and returns risk_score (0-1) and confidence.
    Input keys: age, bmi, avg_glucose_level, hypertension, heart_disease,
                gender, ever_married, work_type, residence_type, smoking_status
    """
    pipeline = load_pipeline()

    # Build DataFrame exactly as original app expects
    features = pd.DataFrame([{
        "gender": data["gender"].lower(),              # "male" / "female"
        "age": float(data["age"]),
        "hypertension": int(data["hypertension"]),
        "heart_disease": int(data["heart_disease"]),
        "ever_married": data["ever_married"].lower(),  # "yes" / "no"
        "work_type": WORK_TYPE_MAP.get(data["work_type"], data["work_type"]),
        "Residence_type": data["residence_type"].lower(),  # capital R, lowercase value
        "avg_glucose_level": float(data["avg_glucose_level"]),
        "bmi": float(data["bmi"]),
        "smoking_status": data["smoking_status"].lower(),
    }])

    proba = pipeline.predict_proba(features)[0]
    risk_score = float(proba[1])       # stroke probability
    confidence = float(max(proba))

    return {"risk_score": risk_score, "confidence": confidence}

