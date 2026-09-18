from fastapi import FastAPI, Response, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import httpx
import mysql.connector
import bcrypt
import azure.cognitiveservices.speech as speechsdk
from pydantic import BaseModel, EmailStr, Field
from fastapi.staticfiles import StaticFiles
from azure.storage.blob import BlobServiceClient, ContentSettings

load_dotenv()

app = FastAPI()

PROFILE_UPLOAD_DIR = "/tmp/profile_photos"
os.makedirs(PROFILE_UPLOAD_DIR, exist_ok=True)
app.mount(
    "/profile_photos",
    StaticFiles(directory=PROFILE_UPLOAD_DIR),
    name="profile_photos"
)
telugu_audio_cache = {}
class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=100)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://runtrack-vweu.onrender.com",
        "https://runtrack-bay.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class MapMatchRequest(BaseModel):
    coordinates: list[list[float]]
@app.post("/map-match")
async def map_match(data: MapMatchRequest):
    if len(data.coordinates) < 2:
        return {"coordinates": data.coordinates}

    coordinates = ";".join(
        f"{lon},{lat}" for lat, lon in data.coordinates
    )

    url = f"https://router.project-osrm.org/match/v1/running/{coordinates}"

    params = {
    "geometries": "geojson",
    "overview": "full",
    "steps": "false",
    "tidy": "true",
    "gaps": "ignore",
    "snapping": "any",
}

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url, params=params)

    if response.status_code != 200:
        return {"coordinates": data.coordinates}

    result = response.json()

    if not result.get("matchings"):
        return {"coordinates": data.coordinates}

    matched_coordinates = result["matchings"][0]["geometry"]["coordinates"]

    return {
        "coordinates": [
            [lat, lon] for lon, lat in matched_coordinates
        ]
    }

AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY")
AZURE_SPEECH_REGION = os.getenv("AZURE_SPEECH_REGION")

MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")
AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
AZURE_STORAGE_CONTAINER = "profile-photos"

def get_db_connection():
    connection = mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DATABASE
    )
    return connection


@app.get("/")
def home():
    return {
        "message": "RunTrack backend is working",
        "azure_region": AZURE_SPEECH_REGION,
        "azure_key_loaded": bool(AZURE_SPEECH_KEY)
    }
@app.post("/workouts")
def save_workout(
    user_id: int,
    activity: str,
    target_distance: float,
    completed_distance: float,
    duration_seconds: int,
    speed: float,
    pace: float,
    calories: float
):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO workouts
        (user_id, activity, target_distance, completed_distance,
         duration_seconds, speed, pace, calories)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            user_id,
            activity,
            target_distance,
            completed_distance,
            duration_seconds,
            speed,
            pace,
            calories
        )
    )

    connection.commit()

    workout_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return {
        "message": "Workout saved successfully",
        "workout_id": workout_id
    }
@app.get("/workouts")
def get_workouts(user_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM workouts WHERE user_id = %s ORDER BY created_at DESC",
        (user_id,)
    )

    workouts = cursor.fetchall()

    cursor.close()
    connection.close()

    return workouts
@app.get("/test-db")
def test_db():
    connection = get_db_connection()
    connection.close()

    return {"message": "MySQL connection successful"}
@app.post("/register")
def register_user(data: RegisterRequest):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
    "SELECT id FROM users WHERE email = %s",
    (data.email,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        connection.close()
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = bcrypt.hashpw(
        data.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    cursor.execute(
        "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
        (data.name, data.email, hashed_password)
    )

    connection.commit()
    cursor.close()
    connection.close()

    return {"message": "User registered successfully"}

@app.post("/login")
def login_user(email: str, password: str):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE email = %s",
        (email,)
    )

    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not bcrypt.checkpw(
        password.encode("utf-8"),
        user["password"].encode("utf-8")
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "user_id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "profile_photo": user["profile_photo"]
    }
@app.post("/upload-profile-photo")
async def upload_profile_photo(
    user_id: int,
    file: UploadFile = File(...)
):
    allowed_types = ["image/jpeg", "image/png"]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG and PNG images are allowed"
        )

    file_extension = ".jpg" if file.content_type == "image/jpeg" else ".png"
    file_name = f"user_{user_id}{file_extension}"

    contents = await file.read()

    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image size must be less than 5 MB"
        )

    try:
        blob_service_client = BlobServiceClient.from_connection_string(
            AZURE_STORAGE_CONNECTION_STRING
        )

        blob_client = blob_service_client.get_blob_client(
            container=AZURE_STORAGE_CONTAINER,
            blob=file_name
        )

        blob_client.upload_blob(
            contents,
            overwrite=True,
            content_settings=ContentSettings(
                content_type=file.content_type
            )
        )

        profile_photo_url = blob_client.url

    except Exception as e:
        print("Azure Blob upload error:", e)
        raise HTTPException(
            status_code=500,
            detail="Unable to upload profile photo to storage"
        )

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "UPDATE users SET profile_photo = %s WHERE id = %s",
        (profile_photo_url, user_id)
    )

    connection.commit()
    cursor.close()
    connection.close()

    return {
        "message": "Profile photo uploaded successfully",
        "profile_photo": profile_photo_url
    }
@app.post("/forgot-password")
def forgot_password(email: str):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT id FROM users WHERE email = %s",
        (email,)
    )

    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if not user:
        return {"message": "If the email exists, you can reset your password"}

    return {"message": "Email found. You can reset your password"}


class ResetPasswordRequest(BaseModel):
    email: str
    new_password: str
@app.post("/reset-password")
def reset_password(data: ResetPasswordRequest):
    connection = get_db_connection()
    cursor = connection.cursor()

    hashed_password = bcrypt.hashpw(
        data.new_password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    cursor.execute(
        "UPDATE users SET password = %s WHERE email = %s",
        (hashed_password, data.email)
    )

    connection.commit()

    if cursor.rowcount == 0:
        cursor.close()
        connection.close()
        return {"message": "Email not found"}

    cursor.close()
    connection.close()

    return {"message": "Password reset successfully"}

@app.get("/test-telugu")
def test_telugu(message: str = "మీ వ్యాయామం ప్రారంభమైంది. మీకు శుభాకాంక్షలు!"):
    speech_config = speechsdk.SpeechConfig(
        subscription=AZURE_SPEECH_KEY,
        region=AZURE_SPEECH_REGION
    )

    speech_config.speech_synthesis_voice_name = "te-IN-ShrutiNeural"
    speech_config.set_speech_synthesis_output_format(
    speechsdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3
)

    synthesizer = speechsdk.SpeechSynthesizer(
    speech_config=speech_config,
    audio_config=None
)
    print("REQUEST MESSAGE:", message)
    print("CACHE HIT:", message in telugu_audio_cache)

    if message in telugu_audio_cache:
        return Response(
            content=telugu_audio_cache[message],
            media_type="audio/mpeg"
        )

    print("BEFORE AZURE SYNTHESIS")

    result = synthesizer.speak_text_async(message).get()

    print("AFTER AZURE SYNTHESIS")
    print("Speech result:", result.reason)
    print("Audio bytes:", len(result.audio_data) if result.audio_data else 0)

    telugu_audio_cache[message] = result.audio_data

    return Response(
        content=result.audio_data,
        media_type="audio/mpeg"
    )