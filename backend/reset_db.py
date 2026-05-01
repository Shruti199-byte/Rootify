from backend.database import engine, Base
# We must import all models so Python knows what to build
from backend.models import User, NGO, Opportunity, Application, Message, Notification, Review, Post

print("🗑️ Dropping old, broken tables...")
Base.metadata.drop_all(bind=engine)

print("✨ Building fresh, perfect tables...")
Base.metadata.create_all(bind=engine)

print("✅ Database reset complete! You are ready to seed.")