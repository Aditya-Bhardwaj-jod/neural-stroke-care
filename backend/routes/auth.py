from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import db, User, Patient, Doctor

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    role = data.get("role")  # 'patient' or 'doctor'
    email = data.get("email")
    password = data.get("password")

    if not email or not password or not role:
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.flush()

    if role == "patient":
        profile = Patient(
            user_id=user.id,
            full_name=data.get("full_name", ""),
            age=data.get("age"),
            gender=data.get("gender"),
            phone=data.get("phone", ""),
            blood_group=data.get("blood_group", "")
        )
        db.session.add(profile)
    elif role == "doctor":
        profile = Doctor(
            user_id=user.id,
            full_name=data.get("full_name", ""),
            specialization=data.get("specialization", ""),
            license_number=data.get("license_number", ""),
            hospital=data.get("hospital", ""),
            phone=data.get("phone", "")
        )
        db.session.add(profile)
    else:
        return jsonify({"error": "Invalid role"}), 400

    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        "message": "Account created successfully",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict()
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    profile = None
    if user.role == "patient" and user.patient:
        profile = user.patient.to_dict()
    elif user.role == "doctor" and user.doctor:
        profile = user.doctor.to_dict()

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict(),
        "profile": profile
    }), 200


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify({"access_token": access_token}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = None
    if user.role == "patient" and user.patient:
        profile = user.patient.to_dict()
    elif user.role == "doctor" and user.doctor:
        profile = user.doctor.to_dict()

    return jsonify({"user": user.to_dict(), "profile": profile}), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    # JWT is stateless; client deletes token
    return jsonify({"message": "Logged out successfully"}), 200
