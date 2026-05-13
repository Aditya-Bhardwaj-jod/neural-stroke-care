from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Patient, Assessment, Notification
from services.ml_service import predict_stroke_risk
import json

predict_bp = Blueprint("predict", __name__)

RECOMMENDATIONS = {
    "Low": [
        "Maintain your current healthy lifestyle.",
        "Exercise at least 150 minutes per week.",
        "Continue with regular health check-ups annually.",
        "Maintain a balanced diet low in saturated fats.",
        "Keep stress levels in check through mindfulness."
    ],
    "Medium": [
        "Consult your doctor within the next 2 weeks.",
        "Monitor your blood pressure and glucose regularly.",
        "Reduce sodium intake and processed food consumption.",
        "Exercise at least 30 minutes daily.",
        "If smoking, seek a cessation program immediately.",
        "Limit alcohol consumption significantly."
    ],
    "High": [
        "Seek immediate medical consultation — do not delay.",
        "Monitor blood pressure and glucose levels daily.",
        "Emergency contact should be saved and accessible.",
        "Begin prescribed medication as directed by doctor.",
        "Eliminate smoking and alcohol immediately.",
        "Follow a strict low-sodium, low-sugar diet.",
        "Avoid high-stress situations and get adequate sleep."
    ]
}


@predict_bp.route("/predict", methods=["POST"])
@jwt_required()
def predict():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user or user.role != "patient":
        return jsonify({"error": "Only patients can run assessments"}), 403

    patient = user.patient
    if not patient:
        return jsonify({"error": "Patient profile not found"}), 404

    data = request.get_json()
    required = ["age", "bmi", "avg_glucose_level", "hypertension", "heart_disease",
                "ever_married", "work_type", "residence_type", "smoking_status", "gender"]

    for field in required:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        result = predict_stroke_risk(data)
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

    risk_score = result["risk_score"]
    confidence = result["confidence"]

    # Match original model threshold: >= 0.40 = stroke likely
    if risk_score < 0.20:
        risk_level = "Low"
    elif risk_score < 0.40:
        risk_level = "Medium"
    else:
        risk_level = "High"

    recs = RECOMMENDATIONS[risk_level]

    assessment = Assessment(
        patient_id=patient.id,
        age=data["age"], bmi=data["bmi"],
        avg_glucose_level=data["avg_glucose_level"],
        hypertension=data["hypertension"],
        heart_disease=data["heart_disease"],
        ever_married=data["ever_married"],
        work_type=data["work_type"],
        residence_type=data["residence_type"],
        smoking_status=data["smoking_status"],
        gender=data["gender"],
        risk_score=round(risk_score * 100, 2),
        risk_level=risk_level,
        confidence=round(confidence * 100, 2),
        recommendations=json.dumps(recs)
    )
    db.session.add(assessment)

    # Auto notification
    notif = Notification(
        user_id=user_id,
        title="Assessment Complete",
        message=f"Your stroke risk assessment is complete. Risk Level: {risk_level}.",
        type="assessment"
    )
    db.session.add(notif)
    db.session.commit()

    return jsonify({
        "assessment_id": assessment.id,
        "risk_score": assessment.risk_score,
        "risk_level": risk_level,
        "confidence": assessment.confidence,
        "recommendations": recs
    }), 200
