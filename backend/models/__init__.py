from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    patient = db.relationship("Patient", backref="user", uselist=False)
    doctor = db.relationship("Doctor", backref="user", uselist=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {"id": self.id, "email": self.email, "role": self.role, "created_at": self.created_at.isoformat()}


class Patient(db.Model):
    __tablename__ = "patients"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    full_name = db.Column(db.String(100))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    phone = db.Column(db.String(20))
    emergency_contact = db.Column(db.String(100))
    blood_group = db.Column(db.String(5))
    avatar_url = db.Column(db.String(256))

    assessments = db.relationship("Assessment", backref="patient", lazy=True)

    def to_dict(self):
        return {
            "id": self.id, "user_id": self.user_id,
            "full_name": self.full_name, "age": self.age,
            "gender": self.gender, "phone": self.phone,
            "blood_group": self.blood_group, "emergency_contact": self.emergency_contact,
            "avatar_url": self.avatar_url,
            "email": self.user.email if self.user else None
        }


class Doctor(db.Model):
    __tablename__ = "doctors"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    full_name = db.Column(db.String(100))
    specialization = db.Column(db.String(100))
    license_number = db.Column(db.String(50))
    hospital = db.Column(db.String(150))
    phone = db.Column(db.String(20))
    is_available = db.Column(db.Boolean, default=True)
    avatar_url = db.Column(db.String(256))

    def to_dict(self):
        return {
            "id": self.id, "user_id": self.user_id,
            "full_name": self.full_name, "specialization": self.specialization,
            "hospital": self.hospital, "phone": self.phone,
            "is_available": self.is_available, "avatar_url": self.avatar_url,
            "email": self.user.email if self.user else None
        }


class Assessment(db.Model):
    __tablename__ = "assessments"
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"), nullable=False)
    age = db.Column(db.Float)
    bmi = db.Column(db.Float)
    avg_glucose_level = db.Column(db.Float)
    hypertension = db.Column(db.Integer)
    heart_disease = db.Column(db.Integer)
    ever_married = db.Column(db.String(5))
    work_type = db.Column(db.String(30))
    residence_type = db.Column(db.String(10))
    smoking_status = db.Column(db.String(30))
    gender = db.Column(db.String(10))
    risk_score = db.Column(db.Float)
    risk_level = db.Column(db.String(20))
    confidence = db.Column(db.Float)
    recommendations = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id, "patient_id": self.patient_id,
            "age": self.age, "bmi": self.bmi,
            "avg_glucose_level": self.avg_glucose_level,
            "hypertension": self.hypertension, "heart_disease": self.heart_disease,
            "ever_married": self.ever_married, "work_type": self.work_type,
            "residence_type": self.residence_type, "smoking_status": self.smoking_status,
            "gender": self.gender, "risk_score": self.risk_score,
            "risk_level": self.risk_level, "confidence": self.confidence,
            "recommendations": self.recommendations,
            "created_at": self.created_at.isoformat()
        }


class Message(db.Model):
    __tablename__ = "messages"
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    content = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    sender = db.relationship("User", foreign_keys=[sender_id])
    receiver = db.relationship("User", foreign_keys=[receiver_id])

    def to_dict(self):
        return {
            "id": self.id, "sender_id": self.sender_id,
            "receiver_id": self.receiver_id, "content": self.content,
            "is_read": self.is_read, "created_at": self.created_at.isoformat()
        }


class Notification(db.Model):
    __tablename__ = "notifications"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(150))
    message = db.Column(db.Text)
    type = db.Column(db.String(30))
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id, "user_id": self.user_id,
            "title": self.title, "message": self.message,
            "type": self.type, "is_read": self.is_read,
            "created_at": self.created_at.isoformat()
        }
