"""One-time admin password reset for garnavo.com/admin.

Usage (run from the backend folder, with .env filled in):
    python reset_admin.py

Prompts for a new password, then overwrites the bcrypt hash of the
ADMIN_EMAIL account in the `admins` collection. Works against whatever
MONGO_URL points at — use your production Atlas URL to reset the live site.

Safe to re-run. Delete this file afterwards if you want.
"""
import asyncio
import getpass
import os
import sys
from pathlib import Path

import bcrypt
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv(Path(__file__).parent / ".env")

MONGO_URL = os.environ.get("MONGO_URL", "")
DB_NAME = os.environ.get("DB_NAME", "garnavo")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@garnavo.com")


async def main() -> int:
    if not MONGO_URL:
        print("MONGO_URL is empty in backend/.env — fill it in first.")
        return 1

    pw = getpass.getpass(f"New password for {ADMIN_EMAIL}: ")
    if len(pw) < 8:
        print("Password must be at least 8 characters.")
        return 1
    if pw != getpass.getpass("Confirm password: "):
        print("Passwords do not match.")
        return 1

    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    pw_hash = bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

    res = await db.admins.update_one(
        {"email": ADMIN_EMAIL},
        {"$set": {"email": ADMIN_EMAIL, "password_hash": pw_hash}},
        upsert=True,
    )
    client.close()

    if res.upserted_id:
        print(f"Created new admin account: {ADMIN_EMAIL}")
    else:
        print(f"Password updated for: {ADMIN_EMAIL}")
    print("Log in at https://garnavo.com/admin with that email + new password.")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
