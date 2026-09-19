# RunTrack – Smart Fitness & Physical Test Training Platform
## Live Demo

🌐 **RunTrack:** https://runtrack-bay.vercel.app
## About the Project

RunTrack is a full-stack fitness and physical-test training web application designed for walking, jogging, and running workouts.

It uses GPS to track outdoor distance and provides real-time workout metrics such as time, speed, pace, calories, and route information. Users can set target distances and voice-alert intervals, use English or Telugu voice support, pause/resume workouts, and view saved workout history.

The application also includes user authentication, password reset, profile photo upload, and persistent workout data storage.


## Features

- Walking, Jogging, and Running modes
- Custom target distance
- Voice alert intervals
- English and Telugu voice support
- GPS-based outdoor distance tracking
- Speed, pace, time, and calorie calculation
- Live route tracking with OpenStreetMap
- Road-matched GPS routes using OSRM
- Pause, resume, and voice stop
- Automatic target completion
- Workout summary and history
- User registration and login
- Password reset
- Profile photo upload
- MySQL workout and user storage
- Azure AI Speech for Telugu voice
- Responsive desktop and mobile UI

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- React Leaflet
- OpenStreetMap

### Backend
- Python
- FastAPI
- MySQL
- bcrypt
- Azure AI Speech
- OSRM

## Project Structure

```text
runtrack/
├── backend/
│   └── main.py
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .gitignore
├── package.json
└── README.md

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/ashwiniperumalla/runtrack.git
cd runtrack
```
### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
The frontend will run locally using Vite.

## Backend Setup

### 1. Navigate to the backend folder

```bash
cd backend
```
### 2. Create a virtual environment
```bash
python -m venv venv
```
### 3. Activate the virtual environment
windows:
``` bash
venv\Scripts\activate
```
### 4. Install backend dependencies
``` bash 
pip install -r requirements.txt
```
### 5. Start the FastAPI server
``` bash
uvicorn main:app --reload
```
The backend API will run locally at `http://127.0.0.1:8000`.

## Environment Variables

Create a `.env` file inside the `backend` folder and add the required configuration values:

```env
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=your_azure_speech_region

MYSQL_HOST=your_mysql_host
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=your_mysql_database

AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
```
Do not commit `.env` files or secret credentials to GitHub.



## Deployment

### Frontend

The RunTrack frontend is deployed using Vercel.

**Production URL:**  
https://runtrack-bay.vercel.app

### Backend

The FastAPI backend is deployed using Render.

**Production API:**  
https://runtrack-api.onrender.com

### Database

The application uses Azure Database for MySQL for persistent user and workout data.

### Cloud Storage

Profile photos are stored using Azure Blob Storage.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate a user |
| POST | `/forgot-password` | Initiate password reset |
| POST | `/reset-password` | Reset user password |
| POST | `/upload-profile-photo` | Upload a profile photo |
| GET | `/profile-photo/{user_id}` | Retrieve a user's profile photo |
| POST | `/workouts` | Save workout data |
| GET | `/workouts` | Retrieve workout history |
| POST | `/map-match` | Match GPS coordinates to a route |
| POST | `/test-telugu` | Generate Telugu voice output |

## Screenshots

### Welcome Page
[View RunTrack Welcome Screenshot](screenshots/welcome.png)

### Login

[View RunTrack Login Screenshot](screenshots/login.png)

### Dashboard

[View RunTrack Dashboard Screenshot](screenshots/dashboard.png)

### Workout Tracking

[View RunTrack Workout Screenshot](screenshots/workout.png)

### Workout History

[View RunTrack Workout History Screenshot](screenshots/workout_history.png)

## Project Highlights

- Built a full-stack fitness tracking application using React and FastAPI.
- Implemented GPS-based outdoor workout tracking with live route visualization.
- Added real-time distance, speed, pace, timer, and calorie calculations.
- Implemented voice-controlled workout start with English and Telugu voice support.
- Added automatic workout completion based on the selected target distance.
- Integrated Azure Database for MySQL for persistent application data.
- Integrated Azure Blob Storage for profile photo storage.
- Deployed the frontend on Vercel and backend on Render.
- Designed the application to work across desktop and mobile devices.
- GPS-based workout tracking with live route visualization
- Real-time distance, speed, pace, time, and calorie tracking
- Voice-controlled workout start with English and Telugu support
- Custom target-distance and voice-alert intervals
- Automatic workout completion when the target distance is reached
- User authentication with registration, login, and password reset
- Persistent workout history using Azure Database for MySQL
- Profile photo storage using Azure Blob Storage
- Responsive interface for desktop and mobile devices
- Full-stack deployment using Vercel, Render, and Microsoft Azure

## Author

**Ashwini Perumalla**

- GitHub: https://github.com/ashwiniperumalla
- LinkedIn: https://www.linkedin.com/in/ashwini-perumalla/