from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate
from ..utils.validators import validate_email, validate_password
from ...models.user import User
from ...extensions import db

bp = Blueprint('auth', __name__)

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))

class SignupSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=2))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    userType = fields.Str(validate=validate.OneOf(['customer', 'provider']))

@bp.route('/login', methods=['POST'])
def login():
    schema = LoginSchema()
    try:
        data = schema.load(request.get_json())
    except Exception as e:
        return jsonify({'message': str(e)}), 400

    user = User.find_by_email(data['email'])
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401

    if not user.is_active:
        return jsonify({'message': 'Account is deactivated'}), 403

    user.update_last_login()
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    }), 200

@bp.route('/signup', methods=['POST'])
def signup():
    schema = SignupSchema()
    try:
        data = schema.load(request.get_json())
    except Exception as e:
        return jsonify({'message': str(e)}), 400

    if User.find_by_email(data['email']):
        return jsonify({'message': 'Email already exists'}), 409

    user = User(
        name=data['name'],
        email=data['email'],
        role=data.get('userType', 'customer')
    )
    user.set_password(data['password'])

    try:
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error creating user'}), 500

    access_token = create_access_token(identity=user.id)
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    }), 201

@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    return jsonify(user.to_dict()), 200

@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # JWT tokens are stateless, so we just return a success message
    return jsonify({'message': 'Successfully logged out'}), 200

@bp.route('/verify-email', methods=['POST'])
@jwt_required()
def verify_email():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    user.verify_email()
    return jsonify({'message': 'Email verified successfully'}), 200 