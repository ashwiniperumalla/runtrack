# RunTrack – Smart Fitness & Physical Test Training Platform

RunTrack is a smart fitness and physical-test training web application that tracks outdoor walking, jogging, and running workouts using GPS.

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