import os
import psycopg2
import psycopg2.extras
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# ── PostgreSQL ─────────────────────────────────────────────
def get_pg_connection():
    return psycopg2.connect(
        os.getenv("DATABASE_URL"),
        cursor_factory=psycopg2.extras.RealDictCursor
    )

# ── MongoDB ────────────────────────────────────────────────
_mongo_client: AsyncIOMotorClient = None

def get_mongo_client() -> AsyncIOMotorClient:
    global _mongo_client
    if _mongo_client is None:
        _mongo_client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    return _mongo_client

def get_mongo_db():
    client = get_mongo_client()
    return client[os.getenv("MONGODB_DB", "novacampus_chatbot")]

async def test_mongo_connection():
    try:
        db = get_mongo_db()
        await db.command("ping")
        print("Connected to MongoDB")
    except Exception as e:
        print(f"MongoDB connection warning: {e}")
        print("Chatbot will run without conversation history")