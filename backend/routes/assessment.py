from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Assessment
import json

assessment_bp = Blueprint("assessment", __name__)


@assessment_bp.route("/assessment/<int:assessment_id>/report", methods=["GET"])
@jwt_required()
def get_report(assessment_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    a = Assessment.query.get(assessment_id)

    if not a:
        return jsonify({"error": "Assessment not found"}), 404

    if user.role == "patient" and (not user.patient or a.patient_id != user.patient.id):
        return jsonify({"error": "Unauthorized"}), 403

    d = a.to_dict()
    try:
        d["recommendations"] = json.loads(a.recommendations) if a.recommendations else []
    except Exception:
        d["recommendations"] = []

    patient = a.patient
    d["patient_name"] = patient.full_name if patient else "Unknown"
    d["patient_age"] = patient.age if patient else None
    d["patient_blood_group"] = patient.blood_group if patient else None

    return jsonify({"report": d}), 200
