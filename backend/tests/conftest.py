import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.main import app

# Test database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# Create test database engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    # Create the test database tables
    Base.metadata.create_all(bind=engine)
    
    # Create a new database session for the test
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Drop all tables after the test
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def test_provider(db):
    from app.models.provider import Provider
    provider = Provider(
        name="Test Provider",
        email="test@example.com",
        phone="+2348012345678",
        services=["plumbing", "electrical"]
    )
    db.add(provider)
    db.commit()
    db.refresh(provider)
    return provider

@pytest.fixture(scope="function")
def test_job(db, test_provider):
    from app.models.job import Job
    job = Job(
        title="Test Job",
        description="Test job description",
        status="pending",
        amount=10000,
        provider_id=test_provider.id
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job 