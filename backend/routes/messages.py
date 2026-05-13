from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Message, Notification
from sqlalchemy import or_, and_

messages_bp = Blueprint("messages", __name__)


@messages_bp.route("/messages", methods=["POST"])
@jwt_required()
def send_message():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    receiver_id = data.get("receiver_id")
    content = data.get("content", "").strip()

    if not receiver_id or not content:
        return jsonify({"error": "receiver_id and content are required"}), 400

    receiver = User.query.get(receiver_id)
    if not receiver:
        return jsonify({"error": "Receiver not found"}), 404

    msg = Message(sender_id=user_id, receiver_id=receiver_id, content=content)
    db.session.add(msg)

    sender = User.query.get(user_id)
    sender_name = "Someone"
    if sender.role == "patient" and sender.patient:
        sender_name = sender.patient.full_name or sender.email
    elif sender.role == "doctor" and sender.doctor:
        sender_name = f"Dr. {sender.doctor.full_name or sender.email}"

    notif = Notification(
        user_id=receiver_id,
        title="New Message",
        message=f"You have a new message from {sender_name}.",
        type="message"
    )
    db.session.add(notif)
    db.session.commit()

    return jsonify({"message": "Message sent", "data": msg.to_dict()}), 201


@messages_bp.route("/messages/<int:other_user_id>", methods=["GET"])
@jwt_required()
def get_conversation(other_user_id):
    user_id = int(get_jwt_identity())

    msgs = Message.query.filter(
        or_(
            and_(Message.sender_id == user_id, Message.receiver_id == other_user_id),
            and_(Message.sender_id == other_user_id, Message.receiver_id == user_id)
        )
    ).order_by(Message.created_at.asc()).all()

    # Mark as read
    for m in msgs:
        if m.receiver_id == user_id and not m.is_read:
            m.is_read = True
    db.session.commit()

    return jsonify({"messages": [m.to_dict() for m in msgs]}), 200


@messages_bp.route("/messages/contacts", methods=["GET"])
@jwt_required()
def get_contacts():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    # Return doctors if patient, patients if doctor
    if user.role == "patient":
        from models import Doctor
        contacts = [d.to_dict() for d in Doctor.query.all()]
    else:
        from models import Patient
        contacts = [p.to_dict() for p in Patient.query.all()]

    # Add unread count per contact
    for c in contacts:
        other_id = c["user_id"]
        unread = Message.query.filter_by(sender_id=other_id, receiver_id=user_id, is_read=False).count()
        c["unread_count"] = unread

    return jsonify({"contacts": contacts}), 200
