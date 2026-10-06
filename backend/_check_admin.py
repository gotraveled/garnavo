import asyncio, os, bcrypt
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv(Path(".env"), override=True)

async def t():
    c = AsyncIOMotorClient(os.environ["MONGO_URL"], serverSelectionTimeoutMS=8000)
    db = c[os.environ["DB_NAME"]]
    doc = await db.admins.find_one({"email": "info@garnavo.com"})
    if not doc:
        print("No admin doc for info@garnavo.com")
        c.close()
        return
    h = doc["password_hash"]
    print("hash prefix:", h[:7])
    print("hash length:", len(h))
    print("hash valid bcrypt?:", h.startswith("$2b$") or h.startswith("$2a$"))
    try:
        ok = bcrypt.checkpw(b"Garnavo@Admin2026", h.encode())
        print("checkpw result:", ok)
    except Exception as e:
        print("checkpw CRASHED:", e)
    c.close()

asyncio.run(t())
