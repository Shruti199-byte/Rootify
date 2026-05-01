from backend.database import engine
from sqlalchemy import text

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("\n✅ SUCCESS: YOUR DATABASE IS CONNECTED PERFECTLY!\n")
except Exception as e:
    print("\n❌ FAILED: DATABASE IS NOT CONNECTED. Here is the exact error:")
    print(e)
    print("\n")