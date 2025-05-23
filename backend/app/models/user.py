from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum
from werkzeug.security import generate_password_hash, check_password_hash

class UserType(str, enum.Enum):
    CUSTOMER = "customer"
    PROVIDER = "provider"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)
    full_name = Column(String(100))
    phone = Column(String(20))
    user_type = Column(Enum(UserType), default=UserType.CUSTOMER)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    jobs = relationship("Job", back_populates="customer")
    reviews = relationship("Review", back_populates="customer")
    provider_profile = relationship("Provider", back_populates="user", uselist=False)

    def __repr__(self):
        return f"<User {self.email}>"

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'user_type': self.user_type,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'is_active': self.is_active,
            'is_verified': self.is_verified
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
        self.is_verified = True
        db.session.commit()

    def update_preferences(self, preferences):
        self.preferences = preferences
        db.session.commit() 