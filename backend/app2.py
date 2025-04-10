from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

# Initialize Flask app
app = Flask(__name__)

# Configuration for SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-here')  # Change in production
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# Database Models
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    location = db.Column(db.String(100))
    role = db.Column(db.String(20), default='customer')
    notifications = db.Column(db.Boolean, default=True)  # This is the column
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Provider(db.Model):
    __tablename__ = 'providers'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    photo = db.Column(db.String(200))
    rating = db.Column(db.Float, default=0.0)
    price = db.Column(db.String(50))
    category = db.Column(db.String(100))
    location = db.Column(db.String(100))
    bio = db.Column(db.Text)
    services = db.Column(db.JSON)
    availability = db.Column(db.JSON)
    user = db.relationship('User', backref='provider', uselist=False)

class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    provider_id = db.Column(db.Integer, db.ForeignKey('providers.id'), nullable=False)
    service = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    notes = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')
    cost = db.Column(db.Numeric(10, 2))
    is_paid = db.Column(db.Boolean, default=False)
    user = db.relationship('User', backref='bookings')
    provider = db.relationship('Provider', backref='bookings')

class Payment(db.Model):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    method = db.Column(db.String(20))
    details = db.Column(db.JSON)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=db.func.now())
    booking = db.relationship('Booking', backref='payment', uselist=False)

class Service(db.Model):
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    user = db.relationship('User', backref='notification_list')  # Renamed backref

class Review(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    provider_id = db.Column(db.Integer, db.ForeignKey('providers.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.now())
    provider = db.relationship('Provider', backref='reviews')
    user = db.relationship('User', backref='reviews')

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
            'user': {'id': user.id, 'name': user.name, 'email': user.email, 'role': user.role}
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
        'id': user.id, 'name': user.name, 'email': user.email, 'phone': user.phone,
        'location': user.location, 'role': user.role, 'notifications': user.notifications
    }), 200

# User Endpoints
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
        'id': user.id, 'name': user.name, 'email': user.email, 'phone': user.phone,
        'location': user.location, 'role': user.role
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

# Provider Endpoints
@app.route('/api/providers', methods=['GET'])
def list_providers():
    query = Provider.query.join(User)
    if search := request.args.get('q'):
        query = query.filter(db.or_(User.name.ilike(f'%{search}%'), Provider.category.ilike(f'%{search}%')))
    if category := request.args.get('category'):
        query = query.filter(Provider.category == category)
    if location := request.args.get('location'):
        query = query.filter(Provider.location == location)
    if sort := request.args.get('sort'):
        if sort == 'rating':
            query = query.order_by(Provider.rating.desc())
    providers = query.all()
    return jsonify([{
        'id': p.id, 'name': p.user.name, 'photo': p.photo, 'rating': p.rating,
        'price': p.price, 'category': p.category, 'location': p.location
    } for p in providers]), 200

@app.route('/api/providers/<int:provider_id>', methods=['GET'])
def get_provider(provider_id):
    provider = Provider.query.get_or_404(provider_id)
    reviews = [{
        'id': r.id, 'user': r.user.name, 'rating': r.rating, 'comment': r.comment,
        'date': r.created_at.strftime('%Y-%m-%d')
    } for r in provider.reviews]
    return jsonify({
        'id': provider.id, 'name': provider.user.name, 'photo': provider.photo,
        'rating': provider.rating, 'price': provider.price, 'category': provider.category,
        'location': provider.location, 'bio': provider.bio, 'services': provider.services,
        'availability': provider.availability, 'reviews': reviews
    }), 200

@app.route('/api/providers', methods=['POST'])
@jwt_required()
def create_provider():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if user.role != 'provider':
        return jsonify({'message': 'Only providers can create profiles'}), 403
    if Provider.query.filter_by(user_id=user_id).first():
        return jsonify({'message': 'Provider profile already exists'}), 400
    data = request.get_json()
    provider = Provider(
        user_id=user_id, photo=data.get('photo'), category=data.get('category'),
        location=data.get('location'), bio=data.get('bio'), services=data.get('services'),
        availability=data.get('availability'), price=data.get('price')
    )
    db.session.add(provider)
    db.session.commit()
    return jsonify({'id': provider.id, 'message': 'Provider profile created'}), 201

# Service Endpoints
@app.route('/api/services', methods=['GET'])
def list_services():
    services = Service.query.all()
    return jsonify([{'id': s.id, 'name': s.name} for s in services]), 200

@app.route('/api/services/<string:category>/providers', methods=['GET'])
def list_providers_by_category(category):
    providers = Provider.query.filter_by(category=category).all()
    return jsonify([{
        'id': p.id, 'name': p.user.name, 'photo': p.photo, 'rating': p.rating,
        'price': p.price, 'location': p.location
    } for p in providers]), 200

# Booking Endpoints
@app.route('/api/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    user_id = get_jwt_identity()
    data = request.get_json()
    provider = Provider.query.get_or_404(data.get('providerId'))
    booking = Booking(
        user_id=user_id, provider_id=provider.id, service=data.get('service'),
        date=datetime.strptime(data.get('date'), '%Y-%m-%d').date(),
        time=datetime.strptime(data.get('time'), '%H:%M').time(),
        location=data.get('location'), notes=data.get('notes'), cost=0.00
    )
    db.session.add(booking)
    db.session.commit()
    return jsonify({'id': booking.id, 'message': 'Booking created'}), 201

@app.route('/api/bookings', methods=['GET'])
@jwt_required()
def list_bookings():
    user_id = get_jwt_identity()
    query = Booking.query.filter_by(user_id=user_id)
    if status := request.args.get('status'):
        if status == 'upcoming':
            query = query.filter(Booking.status.in_(['pending', 'confirmed']))
        elif status == 'completed':
            query = query.filter(Booking.status == 'completed')
    bookings = query.all()
    return jsonify([{
        'id': b.id, 'providerId': b.provider_id, 'providerName': b.provider.user.name,
        'providerPhoto': b.provider.photo, 'service': b.service, 'date': b.date.strftime('%Y-%m-%d'),
        'time': b.time.strftime('%H:%M'), 'location': b.location, 'status': b.status,
        'cost': str(b.cost), 'isPaid': b.is_paid
    } for b in bookings]), 200

@app.route('/api/bookings/<int:booking_id>/status', methods=['PUT'])
@jwt_required()
def update_booking_status(booking_id):
    user_id = get_jwt_identity()
    booking = Booking.query.get_or_404(booking_id)
    provider = Provider.query.filter_by(user_id=user_id).first()
    if not provider or booking.provider_id != provider.id:
        return jsonify({'message': 'Unauthorized'}), 403
    data = request.get_json()
    new_status = data.get('status')
    if new_status not in ['pending', 'confirmed', 'completed', 'cancelled']:
        return jsonify({'message': 'Invalid status'}), 400
    booking.status = new_status
    db.session.commit()
    return jsonify({'id': booking.id, 'status': booking.status}), 200

# Payment Endpoints
@app.route('/api/payments', methods=['POST'])
@jwt_required()
def process_payment():
    data = request.get_json()
    booking = Booking.query.get_or_404(data.get('bookingId'))
    payment = Payment(
        booking_id=booking.id, amount=booking.cost or 100.00, method=data.get('method'),
        details=data.get('details'), status='success'
    )
    db.session.add(payment)
    booking.is_paid = True
    db.session.commit()
    return jsonify({'paymentId': payment.id, 'status': payment.status}), 200

# Notification Endpoint
@app.route('/api/notifications', methods=['POST'])
@jwt_required()
def send_notification():
    data = request.get_json()
    user = User.query.get_or_404(data.get('userId'))
    if not user.notifications:
        return jsonify({'message': 'Notifications disabled for user'}), 400
    notification = Notification(user_id=user.id, message=data.get('message'))
    db.session.add(notification)
    db.session.commit()
    return jsonify({'notificationId': notification.id, 'message': notification.message}), 200

# Review Endpoint
@app.route('/api/providers/<int:provider_id>/reviews', methods=['POST'])
@jwt_required()
def post_review(provider_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    booking = Booking.query.filter_by(user_id=user_id, provider_id=provider_id, status='completed').first()
    if not booking:
        return jsonify({'message': 'No completed booking found'}), 403
    review = Review(provider_id=provider_id, user_id=user_id, rating=data.get('rating'), comment=data.get('comment'))
    db.session.add(review)
    db.session.commit()
    provider = Provider.query.get(provider_id)
    reviews = provider.reviews
    provider.rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 0.0
    db.session.commit()
    return jsonify({'message': 'Review posted'}), 201

# Seed Dummy Data
def seed_dummy_data():
    with app.app_context():
        # Clear existing data (optional)
        db.drop_all()
        db.create_all()

        # Dummy Users
        user1 = User(name="John Doe", email="john@example.com", phone="08012345678", location="Lagos")
        user1.set_password("password123")
        user2 = User(name="Jane Smith", email="jane@example.com", phone="08098765432", location="Abuja", role="provider")
        user2.set_password("password123")

        # Dummy Providers
        provider1 = Provider(
            user_id=2, photo="http://example.com/jane.jpg", rating=4.5, price="₦3,000/hr",
            category="Electrician", location="Abuja", bio="Skilled electrician with 5 years experience",
            services=["Wiring", "Repairs"], availability=["Monday 9-12", "Wednesday 14-17"]
        )

        # Dummy Services
        service1 = Service(name="Electrician")
        service2 = Service(name="Plumbing")

        # Dummy Booking
        booking1 = Booking(
            user_id=1, provider_id=1, service="Wiring", date=datetime.strptime("2025-04-15", '%Y-%m-%d').date(),
            time=datetime.strptime("10:00", '%H:%M').time(), location="Lagos", notes="Fix lights", cost=3000.00
        )

        # Dummy Payment
        payment1 = Payment(
            booking_id=1, amount=3000.00, method="card", details={"cardNumber": "1234-5678-9012-3456"}, status="success"
        )

        # Dummy Notification
        notification1 = Notification(user_id=1, message="Your booking is confirmed!")

        # Dummy Review
        booking1.status = "completed"  # Required for review
        review1 = Review(provider_id=1, user_id=1, rating=4, comment="Great job fixing the lights!")

        # Add to session
        db.session.add_all([user1, user2, provider1, service1, service2, booking1, payment1, notification1, review1])
        db.session.commit()
        print("Dummy data seeded successfully!")

# Initialize Database and Run App
if __name__ == '__main__':
    seed_dummy_data()  # Seed data on first run
    app.run(debug=True)