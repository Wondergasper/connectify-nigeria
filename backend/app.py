from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY',
                                              'your-secret-key')
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Configure CORS to allow requests from frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "https://*.replit.dev", "http://localhost:8080", "http://127.0.0.1:8080"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    location = db.Column(db.String(100))
    role = db.Column(db.String(20), default='customer')
    notifications = db.Column(db.Boolean, default=True)
    password_hash = db.Column(db.String(128), nullable=False)
    paymentMethods = db.Column(db.JSON)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Provider(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    photo = db.Column(db.String(200))
    rating = db.Column(db.Float, default=0.0)
    price = db.Column(db.String(50))
    category = db.Column(db.String(100))
    location = db.Column(db.String(100))
    bio = db.Column(db.Text)
    services = db.Column(db.JSON)
    availability = db.Column(db.JSON)
    reviews = db.Column(db.JSON)


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    provider_id = db.Column(db.Integer,
                            db.ForeignKey('provider.id'),
                            nullable=False)
    service = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    notes = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')
    cost = db.Column(db.Numeric(10, 2))
    is_paid = db.Column(db.Boolean, default=False)


class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer,
                           db.ForeignKey('booking.id'),
                           nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    method = db.Column(db.String(20))
    details = db.Column(db.JSON)
    status = db.Column(db.String(20), default='pending')


class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))


class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# Authentication Endpoints
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'token': access_token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            }
        }), 200
    return jsonify({'message': 'Invalid credentials'}), 401


@app.route('/api/auth/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logged out'}), 200


@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'location': user.location,
        'role': user.role,
        'notifications': user.notifications
    }), 200


@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('userType', 'customer')

    if not name or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 409

    user = User(name=name, email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    # If provider, create Provider profile
    if role == 'provider':
        provider = Provider(user_id=user.id)
        db.session.add(provider)
        db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({
        'token': access_token,
        'user': {'id': user.id, 'name': user.name, 'email': user.email, 'role': user.role}
    }), 200


# User Management Endpoints
@app.route('/api/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'location': user.location,
        'role': user.role
    }), 200


@app.route('/api/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    user.phone = data.get('phone', user.phone)
    user.location = data.get('location', user.location)
    db.session.commit()
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'location': user.location,
        'role': user.role
    }), 200


@app.route('/api/users/<int:user_id>/role', methods=['POST'])
@jwt_required()
def update_role(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    new_role = data.get('role')
    if new_role not in ['customer', 'provider']:
        return jsonify({'message': 'Invalid role'}), 400
    user.role = new_role
    if new_role == 'provider' and not Provider.query.filter_by(
            user_id=user_id).first():
        provider = Provider(user_id=user_id)
        db.session.add(provider)
    db.session.commit()
    return jsonify({'id': user.id, 'role': user.role}), 200


@app.route('/api/users/<int:user_id>/notifications', methods=['PUT'])
@jwt_required()
def toggle_notifications(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    user.notifications = data.get('notifications', user.notifications)
    db.session.commit()
    return jsonify({'id': user.id, 'notifications': user.notifications}), 200


# Provider Management Endpoints
@app.route('/api/providers', methods=['GET'])
def list_providers():
    query = db.session.query(Provider, User).join(User, Provider.user_id == User.id)
    
    if search := request.args.get('q'):
        search_pattern = f"%{search.lower()}%"
        query = query.filter(db.or_(
            db.func.lower(User.name).like(search_pattern),
            db.func.lower(Provider.category).like(search_pattern)
        ))
    if category := request.args.get('category'):
        query = query.filter(Provider.category == category)
    if location := request.args.get('location'):
        query = query.filter(Provider.location == location)
    if sort := request.args.get('sort'):
        if sort == 'rating':
            query = query.order_by(Provider.rating.desc())
    
    results = query.all()
    providers = [{
        'id': p.id, 
        'name': u.name, 
        'photo': p.photo, 
        'rating': p.rating,
        'price': p.price, 
        'category': p.category, 
        'location': p.location
    } for p, u in results]
    
    return jsonify(providers), 200

@app.route('/api/providers/<int:provider_id>', methods=['GET'])
def get_provider(provider_id):
    try:
        provider, user = db.session.query(Provider, User)\
            .join(User, Provider.user_id == User.id)\
            .filter(Provider.id == provider_id)\
            .first_or_404()
            
        reviews = [{
            'id': r.id, 
            'user': r.user.name, 
            'rating': r.rating, 
            'comment': r.comment,
            'date': r.created_at.strftime('%Y-%m-%d')
        } for r in provider.reviews] if provider.reviews else []
        
        return jsonify({
            'id': provider.id, 
            'name': user.name, 
            'photo': provider.photo,
            'rating': provider.rating, 
            'price': provider.price, 
            'category': provider.category,
            'location': provider.location, 
            'bio': provider.bio, 
            'services': provider.services,
            'availability': provider.availability, 
            'reviews': reviews
        }), 200
    except Exception as e:
        app.logger.error(f"Error fetching provider: {str(e)}")
        return jsonify({'error': 'Failed to fetch provider details'}), 500


@app.route('/api/providers/<int:provider_id>', methods=['PUT'])
@jwt_required()
def update_provider(provider_id):
    provider = Provider.query.get_or_404(provider_id)
    user = User.query.get(provider.user_id)
    if user.id != get_jwt_identity():
        return jsonify({'message': 'Unauthorized'}), 403
    data = request.get_json()
    provider.photo = data.get('photo', provider.photo)
    provider.rating = data.get('rating', provider.rating)
    provider.price = data.get('price', provider.price)
    provider.category = data.get('category', provider.category)
    provider.location = data.get('location', provider.location)
    provider.bio = data.get('bio', provider.bio)
    provider.services = data.get('services', provider.services)
    provider.availability = data.get('availability', provider.availability)
    db.session.commit()
    return jsonify({'id': provider.id, 'message': 'Profile updated'}), 200


# Booking Management Endpoints
@app.route('/api/bookings', methods=['GET'])
@jwt_required()
def list_bookings():
    user_id = get_jwt_identity()
    status = request.args.get('status', 'all')
    query = Booking.query.filter_by(user_id=user_id)
    if status == 'upcoming':
        query = query.filter(Booking.status.in_(['pending', 'confirmed']))
    elif status == 'completed':
        query = query.filter(Booking.status == 'completed')
    bookings = query.all()
    return jsonify([{
        'id': b.id,
        'providerId': b.provider_id,
        'providerName': Provider.query.get(b.provider_id).user.name,
        'providerPhoto': Provider.query.get(b.provider_id).photo,
        'service': b.service,
        'date': b.date.strftime('%Y-%m-%d'),
        'time': b.time.strftime('%H:%M'),
        'location': b.location,
        'status': b.status,
        'cost': str(b.cost),
        'isPaid': b.is_paid
    } for b in bookings]), 200


@app.route('/api/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    user_id = get_jwt_identity()
    data = request.get_json()
    provider = Provider.query.get_or_404(data.get('providerId'))
    booking = Booking(
        user_id=user_id,
        provider_id=provider.id,
        service=data.get('service'),
        date=datetime.strptime(data.get('date'), '%Y-%m-%d').date(),
        time=datetime.strptime(data.get('time'), '%H:%M').time(),
        location=data.get('location'),
        notes=data.get('notes'),
        cost=0.00  # Placeholder
    )
    db.session.add(booking)
    db.session.commit()
    # Send notification to provider
    notification = Notification(
        user_id=provider.user_id,
        message=f"New booking from {User.query.get(user_id).name}")
    db.session.add(notification)
    db.session.commit()
    return jsonify({'id': booking.id, 'message': 'Booking created'}), 201


@app.route('/api/bookings/<int:booking_id>', methods=['GET'])
@jwt_required()
def get_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    return jsonify({
        'id':
        booking.id,
        'providerId':
        booking.provider_id,
        'providerName':
        Provider.query.get(booking.provider_id).user.name,
        'providerPhoto':
        Provider.query.get(booking.provider_id).photo,
        'service':
        booking.service,
        'date':
        booking.date.strftime('%Y-%m-%d'),
        'time':
        booking.time.strftime('%H:%M'),
        'location':
        booking.location,
        'status':
        booking.status,
        'cost':
        str(booking.cost),
        'isPaid':
        booking.is_paid
    }), 200


@app.route('/api/bookings/<int:booking_id>/status', methods=['PUT'])
@jwt_required()
def update_booking_status(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    provider = Provider.query.get(booking.provider_id)
    if provider.user_id != get_jwt_identity():
        return jsonify({'message': 'Unauthorized'}), 403
    data = request.get_json()
    new_status = data.get('status')
    if new_status not in ['pending', 'confirmed', 'completed', 'cancelled']:
        return jsonify({'message': 'Invalid status'}), 400
    booking.status = new_status
    db.session.commit()
    # Send notification to customer
    notification = Notification(
        user_id=booking.user_id,
        message=f"Your booking status has been updated to {new_status}")
    db.session.add(notification)
    db.session.commit()
    return jsonify({'id': booking.id, 'status': booking.status}), 200


# Services Management Endpoints
@app.route('/api/services', methods=['GET'])
def list_services():
    services = Service.query.all()
    return jsonify([{
        'id': s.id,
        'name': s.name,
        'description': s.description,
        'category': s.category
    } for s in services]), 200


# Payments Management Endpoints
@app.route('/api/payments', methods=['POST'])
@jwt_required()
def process_payment():
    data = request.get_json()
    booking = Booking.query.get_or_404(data.get('bookingId'))
    payment = Payment(
        booking_id=booking.id,
        amount=booking.cost or 100.00,
        method=data.get('method'),
        details=data.get('details'),
        status='success'  # Simulate success
    )
    db.session.add(payment)
    booking.is_paid = True
    db.session.commit()
    return jsonify({'paymentId': payment.id, 'status': payment.status}), 200


@app.route('/api/payments/<int:payment_id>', methods=['GET'])
@jwt_required()
def get_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    return jsonify({
        'id': payment.id,
        'bookingId': payment.booking_id,
        'amount': str(payment.amount),
        'method': payment.method,
        'status': payment.status
    }), 200


# Notification Endpoints
@app.route('/api/notifications', methods=['POST'])
@jwt_required()
def send_notification():
    data = request.get_json()
    user_id = data.get('userId')
    message = data.get('message')
    notification = Notification(user_id=user_id, message=message)
    db.session.add(notification)
    db.session.commit()
    return jsonify({
        'notificationId': notification.id,
        'message': notification.message
    }), 200


# Seed Dummy Data
def seed_dummy_data():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Create users first
        user1 = User(name="Chidi Okonkwo",
                     email="chidi@example.com",
                     phone="+234123456789",
                     location="Lagos, Nigeria")
        user1.set_password("password123")
        
        user2 = User(name="Provider User",
                     email="provider@example.com",
                     phone="+234987654321",
                     location="Abuja, Nigeria",
                     role="provider")
        user2.set_password("password123")

        # Add users to session and commit to get their IDs
        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()  # Commit here to get the user IDs

        # Now create provider with the committed user ID
        provider1 = Provider(
            user_id=user2.id,  # This will now have a valid ID
            photo="https://randomuser.me/api/portraits/men/1.jpg",
            rating=4.8,
            price="₦2,500/hr",
            category="Plumbing",
            location="Lagos",
            bio="Professional plumber with over 10 years of experience.",
            services=["Pipe Installation", "Drain Cleaning"],
            availability=[{
                "day": "Monday",
                "hours": "9AM - 5PM"
            }],
            reviews=[]
        )
        db.session.add(provider1)
        
        # Create service
        service1 = Service(
            name="Plumbing",
            description="Professional plumbing services",
            category="Home Services"
        )
        db.session.add(service1)
        
        # Final commit
        db.session.commit()
        print("Dummy data seeded successfully!")


if __name__ == '__main__':
    seed_dummy_data()
    app.run(debug=True)
