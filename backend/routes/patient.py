from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Patient, Assessment
import json

patient_bp = Blueprint("patient", __name__)


@patient_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = user.patient if user.role == "patient" else user.doctor
    return jsonify({"profile": profile.to_dict() if profile else {}}), 200


@patient_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != "patient":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    patient = user.patient
    if not patient:
        return jsonify({"error": "Patient profile not found"}), 404

    fields = ["full_name", "age", "gender", "phone", "blood_group", "emergency_contact"]
    for f in fields:
        if f in data:
            setattr(patient, f, data[f])

    db.session.commit()
    return jsonify({"message": "Profile updated", "profile": patient.to_dict()}), 200


@patient_bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != "patient":
        return jsonify({"error": "Unauthorized"}), 403

    patient = user.patient
    if not patient:
        return jsonify({"assessments": []}), 200

    assessments = Assessment.query.filter_by(patient_id=patient.id).order_by(Assessment.created_at.desc()).all()
    results = []
    for a in assessments:
        d = a.to_dict()
        try:
            d["recommendations"] = json.loads(a.recommendations) if a.recommendations else []
        except Exception:
            d["recommendations"] = []
        results.append(d)

    return jsonify({"assessments": results}), 200


@patient_bp.route("/assessment/<int:assessment_id>", methods=["GET"])
@jwt_required()
def get_assessment(assessment_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

    # Patient can only view own assessments; doctors can view any
    if user.role == "patient" and (not user.patient or assessment.patient_id != user.patient.id):
        return jsonify({"error": "Unauthorized"}), 403

    d = assessment.to_dict()
    try:
        d["recommendations"] = json.loads(assessment.recommendations) if assessment.recommendations else []
    except Exception:
        d["recommendations"] = []

    return jsonify({"assessment": d}), 200


@patient_bp.route("/analytics", methods=["GET"])
@jwt_required()
def get_analytics():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != "patient":
        return jsonify({"error": "Unauthorized"}), 403

    patient = user.patient
    if not patient:
        return jsonify({"analytics": {}}), 200

    assessments = Assessment.query.filter_by(patient_id=patient.id).order_by(Assessment.created_at.asc()).all()

    risk_trend = [{"date": a.created_at.strftime("%b %d"), "risk": a.risk_score} for a in assessments]
    bmi_trend = [{"date": a.created_at.strftime("%b %d"), "bmi": a.bmi} for a in assessments]
    glucose_trend = [{"date": a.created_at.strftime("%b %d"), "glucose": a.avg_glucose_level} for a in assessments]

    latest = assessments[-1] if assessments else None

    return jsonify({
        "analytics": {
            "total_assessments": len(assessments),
            "latest_risk_score": latest.risk_score if latest else None,
            "latest_risk_level": latest.risk_level if latest else None,
            "risk_trend": risk_trend,
            "bmi_trend": bmi_trend,
            "glucose_trend": glucose_trend,
        }
    }), 200
