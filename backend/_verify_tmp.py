import asyncio, os, bcrypt
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv(Path(".env"), override=True)

async def t():
    c = AsyncIOMotorClient(os.environ["MONGO_URL"], serverSelectionTimeoutMS=8000)
    db = c[os.environ["DB_NAME"]]
    doc = await db.admins.find_one({"email": "info@garnavo.com"})
    print("doc found:", bool(doc))
    if doc:
        ok = bcrypt.checkpw(b"Garnavo@Admin2026", doc["password_hash"].encode())
        print("password verifies against stored hash:", ok)
    print("all admin emails:", [a.get("email") async for a in db.admins.find({}, {"_id": 0, "email": 1})])
    c.close()

asyncio.run(t())
