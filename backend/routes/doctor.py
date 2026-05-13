from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Doctor, Patient, Assessment
import json

doctor_bp = Blueprint("doctor", __name__)


@doctor_bp.route("/doctor/profile", methods=["PUT"])
@jwt_required()
def update_doctor_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != "doctor":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    doctor = user.doctor
    if not doctor:
        return jsonify({"error": "Doctor profile not found"}), 404

    fields = ["full_name", "specialization", "license_number", "hospital", "phone"]
    for f in fields:
        if f in data:
            setattr(doctor, f, data[f])

    db.session.commit()
    return jsonify({"message": "Profile updated", "profile": doctor.to_dict()}), 200


@doctor_bp.route("/doctor/status", methods=["PUT"])
@jwt_required()
def toggle_availability():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != "doctor":
        return jsonify({"error": "Unauthorized"}), 403

    doctor = user.doctor
    if not doctor:
        return jsonify({"error": "Doctor profile not found"}), 404

    doctor.is_available = not doctor.is_available
    db.session.commit()
    return jsonify({"is_available": doctor.is_available}), 200


@doctor_bp.route("/doctor/patients", methods=["GET"])
@jwt_required()
def get_all_patients():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != "doctor":
        return jsonify({"error": "Unauthorized"}), 403

    patients = Patient.query.all()
    result = []
    for p in patients:
        data = p.to_dict()
        latest = Assessment.query.filter_by(patient_id=p.id).order_by(Assessment.created_at.desc()).first()
        data["latest_risk_level"] = latest.risk_level if latest else None
        data["latest_risk_score"] = latest.risk_score if latest else None
        data["total_assessments"] = Assessment.query.filter_by(patient_id=p.id).count()
        result.append(data)

    return jsonify({"patients": result}), 200


@doctor_bp.route("/doctor/patients/<int:patient_id>/assessments", methods=["GET"])
@jwt_required()
def get_patient_assessments(patient_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != "doctor":
        return jsonify({"error": "Unauthorized"}), 403

    assessments = Assessment.query.filter_by(patient_id=patient_id).order_by(Assessment.created_at.desc()).all()
    results = []
    for a in assessments:
        d = a.to_dict()
        try:
            d["recommendations"] = json.loads(a.recommendations) if a.recommendations else []
        except Exception:
            d["recommendations"] = []
        results.append(d)

    return jsonify({"assessments": results}), 200


@doctor_bp.route("/doctor/high-risk", methods=["GET"])
@jwt_required()
def high_risk_patients():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != "doctor":
        return jsonify({"error": "Unauthorized"}), 403

    # Get patients whose latest assessment is High
    patients = Patient.query.all()
    high_risk = []
    for p in patients:
        latest = Assessment.query.filter_by(patient_id=p.id).order_by(Assessment.created_at.desc()).first()
        if latest and latest.risk_level == "High":
            d = p.to_dict()
            d["risk_score"] = latest.risk_score
            d["risk_level"] = latest.risk_level
            d["assessment_date"] = latest.created_at.isoformat()
            high_risk.append(d)

    return jsonify({"high_risk_patients": high_risk}), 200


@doctor_bp.route("/doctors", methods=["GET"])
def list_doctors():
    doctors = Doctor.query.filter_by(is_available=True).all()
    return jsonify({"doctors": [d.to_dict() for d in doctors]}), 200
