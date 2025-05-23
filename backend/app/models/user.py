from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from ..extensions import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    location = db.Column(db.String(100))
    role = db.Column(db.String(20), default='customer')
    notifications = db.Column(db.Boolean, default=True)
    password_hash = db.Column(db.String(128), nullable=False)
    payment_methods = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    email_verified = db.Column(db.Boolean, default=False)
    profile_picture = db.Column(db.String(200))
    bio = db.Column(db.Text)
    preferences = db.Column(db.JSON)

    # Relationships
    provider_profile = db.relationship('Provider', backref='user', uselist=False)
    bookings = db.relationship('Booking', backref='user', lazy='dynamic')
    notifications_list = db.relationship('Notification', backref='user', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'location': self.location,
            'role': self.role,
            'notifications': self.notifications,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'is_active': self.is_active,
            'email_verified': self.email_verified,
            'profile_picture': self.profile_picture,
            'bio': self.bio,
            'preferences': self.preferences
        }

    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_id(cls, user_id):
        return cls.query.get(user_id)

    def update_last_login(self):
        self.last_login = datetime.utcnow()
        db.session.commit()

    def verify_email(self):
        self.email_verified = True
        db.session.commit()

    def update_preferences(self, preferences):
        self.preferences = preferences
        db.session.commit()

    def __repr__(self):
        return f'<User {self.email}>' 