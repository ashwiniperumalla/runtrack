import { useState, useRef, useEffect } from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const startIcon = L.divIcon({
  className: "start-marker",
  html: "<div>●</div>",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const currentIcon = L.divIcon({
  className: "current-marker",
  html: "<div>●</div>",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});
function MapUpdater({ location, routeCoordinates }) {
  const map = useMap();

  if (routeCoordinates.length > 1) {
    map.fitBounds(routeCoordinates, {
      padding: [20, 20],
    });
  } else {
    map.setView([location.latitude, location.longitude], 16);
  }

  return null;
}
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => { 
  return localStorage.getItem("runtrackLoggedIn") === "true";
});
const [showWelcome, setShowWelcome] = useState(true);
const [logoutMessage, setLogoutMessage] = useState("");
const [resetMessage, setResetMessage] = useState("");
const [resetError, setResetError] = useState("");
useEffect(() => {
  if (!logoutMessage) return;

  const timer = setTimeout(() => {
    setLogoutMessage("");
  }, 3000);

  return () => clearTimeout(timer);
}, [logoutMessage]);
const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("runtrackUser");
  return savedUser ? JSON.parse(savedUser) : null;
});
const [profilePhoto, setProfilePhoto] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showResetPasswordText, setShowResetPasswordText] = useState(false);
  const [showConfirmResetPasswordText, setShowConfirmResetPasswordText] = useState(false);
  const [activity, setActivity] = useState("");
  const [target, setTarget] = useState("");
  const [alertInterval, setAlertInterval] = useState("");
  const [voiceLanguage, setVoiceLanguage] = useState("english");
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [pace, setPace] = useState(0);
  const [calories, setCalories] = useState(0);
  const [workoutHistory, setWorkoutHistory] = useState(() => {
  const savedHistory = localStorage.getItem("runtrackHistory");

  return savedHistory ? JSON.parse(savedHistory) : [];
});
useEffect(() => {
  localStorage.setItem(
    "runtrackHistory",
    JSON.stringify(workoutHistory)
  );
}, [workoutHistory]);

useEffect(() => {
  if (!user?.user_id) return;

  const loadWorkoutHistory = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/workouts?user_id=${user.user_id}`
      );

      if (!response.ok) {
        throw new Error("Failed to load workout history");
      }

      const data = await response.json();

      const formattedHistory = data.map((workout) => ({
        activity: workout.activity,
        target: `${workout.target_distance * 1000} m`,
        distance: workout.completed_distance,
        time: workout.duration_seconds,
        speed: workout.speed,
        pace: workout.pace,
        calories: workout.calories,
        date: new Date(workout.created_at).toLocaleString(),
      }));

      setWorkoutHistory(formattedHistory);
    } catch (error) {
      console.error("Workout history load error:", error);
    }
  };

  loadWorkoutHistory();
}, [user?.user_id]);
  const secondsRef = useRef(0);
  const distanceRef = useRef(0);
  const startTriggeredRef = useRef(false);
  const teluguSpeakingRef = useRef(false);
  const [location, setLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [matchedRouteCoordinates, setMatchedRouteCoordinates] = useState([]);
useEffect(() => {
  if (
    routeCoordinates.length < 2 ||
    routeCoordinates.length % 5 !== 0
  ) {
    return;
  }

  const matchRouteToRoads = async () => {
    try {
      const response = await fetch(
        "${API_BASE_URL}/map-match",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coordinates: routeCoordinates,
          }),
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (data.coordinates?.length > 1) {
        setMatchedRouteCoordinates(data.coordinates);
      }
    } catch (error) {
      console.error("Map matching error:", error);
    }
  };

  matchRouteToRoads();
}, [routeCoordinates]);
  const previousLocation = useRef(null);
  const gpsWatchId = useRef(null);
  const targetReachedRef = useRef(false);
  const lastAlertDistanceRef = useRef(0);
  const [gpsError, setGpsError] = useState("");

  const [customTarget, setCustomTarget] = useState("");
  const [customAlert, setCustomAlert] = useState("");
  useEffect(() => {
  if (!workoutStarted || isPaused) {
    return;
  }

 const timer = setInterval(() => {
  setSeconds((prevSeconds) => {
    const newSeconds = prevSeconds + 1;
    secondsRef.current = newSeconds;
    return newSeconds;
  });
}, 1000);

  return () => clearInterval(timer);
}, [workoutStarted, isPaused]);
const speak = async (message) => {

// Telugu → Azure AI Speech
if (voiceLanguage === "telugu") {
  if (teluguSpeakingRef.current) {
    return;
  }

  teluguSpeakingRef.current = true;

  try {
    let teluguMessage = message;

    const completedMatch = message.match(/^(\d+)\s+meters completed/i);

    if (completedMatch) {
      const meters = completedMatch[1];
      teluguMessage = `మీరు ${meters} మీటర్లు పూర్తి చేశారు.`;
    } else if (message === "Your workout is ready. Can I start the timer?") {
      teluguMessage = "మీ వ్యాయామం సిద్ధంగా ఉంది. టైమర్ ప్రారంభించనా?";
    } else if (message === "Timer started. Have a great workout!") {
      teluguMessage = "టైమర్ ప్రారంభమైంది. మీ వ్యాయామం విజయవంతంగా సాగాలని కోరుకుంటున్నాను!";
    } else if (message === "Target reached. Great job!") {
      teluguMessage = "మీ లక్ష్యాన్ని చేరుకున్నారు. చాలా బాగా చేశారు!";
    } else if (message === "Workout stopped. Here is your workout summary.") {
      teluguMessage = "వ్యాయామం ఆపబడింది. ఇదిగో మీ వ్యాయామ సారాంశం.";
    } else if (message === "I did not understand. Please say stop.") {
      teluguMessage = "నాకు అర్థం కాలేదు. దయచేసి స్టాప్ అని చెప్పండి.";
    } else if (message === "I could not hear you. Please try again.") {
      teluguMessage = "మీ మాట నాకు వినిపించలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.";
    }
   
    const response = await fetch(
      `${API_BASE_URL}/test-telugu?message=${encodeURIComponent(teluguMessage)}`
    );

    if (!response.ok) {
      throw new Error("Telugu voice request failed");
    }

const audioData = await response.arrayBuffer();
const audioBlob = new Blob([audioData], { type: "audio/mpeg" });
const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);

    audio.onended = () => {
  URL.revokeObjectURL(audioUrl);
  teluguSpeakingRef.current = false;
};

    await audio.play();

    return;
  } catch (error) {
  console.error("Telugu voice error:", error);
  teluguSpeakingRef.current = false;
  return;
}
}
  // English → existing browser female voice
  const speech = new SpeechSynthesisUtterance(message);

  speech.lang = "en-IN";
  speech.rate = 1;
  speech.pitch = 1.1;

  const voices = window.speechSynthesis.getVoices();

  const femaleVoice = voices.find(
    (voice) => voice.name === "Google UK English Female"
  );

  if (femaleVoice) {
    speech.voice = femaleVoice;
  }

  await new Promise((resolve) => {
  speech.onend = resolve;
  window.speechSynthesis.speak(speech);
});
};
const listenForStart = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice recognition is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = false;

 startTriggeredRef.current = false;
setIsListening(true);

recognition.start();

recognition.onresult = (event) => {
  if (startTriggeredRef.current) {
    return;
  }
    const userSpeech = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(" ")
        .toLowerCase();

    

    if (
        userSpeech.includes("yes") ||
        userSpeech.includes("start") ||
        userSpeech.includes("okay") ||
        userSpeech.includes("ok") ||
        userSpeech.includes("begin") ||
        userSpeech.includes("go") ||
        userSpeech.includes("let's go")
    ) {
      startTriggeredRef.current = true;
        recognition.stop();
        setIsListening(false);

       setSeconds(0);
       secondsRef.current = 0;
       setDistance(0);
       distanceRef.current = 0;
       setSpeed(0);
       setPace(0);
       setCalories(0);
       setRouteCoordinates([]);
       setIsPaused(false);
       setWorkoutCompleted(false);
       previousLocation.current = null;
       targetReachedRef.current = false;
       lastAlertDistanceRef.current = 0;

        setWorkoutStarted(true);
        startGPSTracking();

        speak("Timer started. Have a great workout!");
    }
};

  recognition.onerror = () => {
    setIsListening(false);
    speak("I could not hear you. Please try again.");
  };

  recognition.onend = () => {
    setIsListening(false);
  };
};
const startGPSTracking = () => {
  

  if (!navigator.geolocation) {
    
    alert("GPS is not supported by this browser.");
    return;
  }
if (gpsWatchId.current !== null) {
    navigator.geolocation.clearWatch(gpsWatchId.current);
    gpsWatchId.current = null;
}

previousLocation.current = null;
  

 gpsWatchId.current = navigator.geolocation.watchPosition(
    async (position) => {
  

 const latitude = position.coords.latitude;
const longitude = position.coords.longitude;

// Check whether this is the first GPS point
if (!previousLocation.current) {
  setLocation({
    latitude,
    longitude,
  });

  setRouteCoordinates((prev) => [
    ...prev,
    [latitude, longitude],
  ]);

  previousLocation.current = {
    latitude,
    longitude,
    timestamp: position.timestamp,
  };

  return;
}

// Calculate distance from previous GPS point
const R = 6371000;

const lat1 =
  previousLocation.current.latitude * Math.PI / 180;

const lat2 =
  latitude * Math.PI / 180;

const deltaLat =
  (latitude - previousLocation.current.latitude) * Math.PI / 180;

const deltaLon =
  (longitude - previousLocation.current.longitude) * Math.PI / 180;

const a =
  Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
  Math.cos(lat1) *
    Math.cos(lat2) *
    Math.sin(deltaLon / 2) *
    Math.sin(deltaLon / 2);

const c =
  2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

const distanceMoved = R * c;

const timeDiff =
  (position.timestamp - previousLocation.current.timestamp) / 1000;

// Ignore unrealistic GPS jumps
if (
  distanceMoved > 500 ||
  (timeDiff > 0 && (distanceMoved / timeDiff) * 3.6 > 50)
) {
  console.warn("Ignoring unrealistic GPS movement:", {
    distanceMoved,
    timeDiff,
  });
  return;
}

// Accept valid GPS point
setLocation({
  latitude,
  longitude,
});

setRouteCoordinates((prev) => [
  ...prev,
  [latitude, longitude],
]);

if (timeDiff > 0) {
  const currentSpeed = (distanceMoved / timeDiff) * 3.6;
  setSpeed(currentSpeed);

  if (currentSpeed > 0) {
    const currentPace = 60 / currentSpeed;
    setPace(currentPace);
  }
}

const newDistance =
  distanceRef.current + distanceMoved / 1000;

const estimatedCalories = newDistance * 60;

setCalories(estimatedCalories);

distanceRef.current = newDistance;
setDistance(newDistance);

previousLocation.current = {
  latitude,
  longitude,
  timestamp: position.timestamp,
};


// Convert selected target into kilometers
let targetDistanceKm;

if (target === "Custom") {
    targetDistanceKm = Number(customTarget);
} else if (target.includes("m")) {
    targetDistanceKm = parseFloat(target) / 1000;
} else {
    targetDistanceKm = parseFloat(target);
}
console.log("TARGET:", target);


// Check voice alert interval
let alertDistanceKm;

if (alertInterval === "Custom") {
  alertDistanceKm = Number(customAlert) / 1000;
} else if (alertInterval.includes("m")) {
  alertDistanceKm = parseFloat(alertInterval) / 1000;
} else {
  alertDistanceKm = parseFloat(alertInterval);
}


if (
  alertDistanceKm > 0 &&
  newDistance >= lastAlertDistanceRef.current + alertDistanceKm &&
  newDistance < targetDistanceKm
) {
  lastAlertDistanceRef.current += alertDistanceKm;
  

  speak(
    `${Math.round(lastAlertDistanceRef.current * 1000)} meters completed.`
  );
}
// Check if target is reached
if (
  newDistance >= targetDistanceKm &&
  !targetReachedRef.current
) {
  targetReachedRef.current = true;
  const finalTimeSeconds = secondsRef.current;
const finalSpeed =
  finalTimeSeconds > 0
    ? (newDistance / finalTimeSeconds) * 3600
    : 0;

const finalPace =
  newDistance > 0
    ? (finalTimeSeconds / 60) / newDistance
    : 0;

  setWorkoutStarted(false);
setWorkoutCompleted(true);

setWorkoutHistory((prev) => [
  ...prev,
  {
  activity: activity,
  target: target,
  distance: newDistance,
  time: secondsRef.current,
  speed: finalSpeed,
  pace: finalPace,
  calories: Math.round(newDistance * 60),
  date: new Date().toLocaleString(),
}
]);
// Save completed workout to MySQL
try {
 const response = await fetch(
  `${API_BASE_URL}/workouts?user_id=${user?.user_id}&activity=${encodeURIComponent(activity)}&target_distance=${targetDistanceKm}&completed_distance=${newDistance}&duration_seconds=${secondsRef.current}&speed=${finalSpeed}&pace=${finalPace}&calories=${Math.round(newDistance * 60)}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: user?.user_id,
      activity: activity,
      target_distance: targetDistanceKm,
      completed_distance: newDistance,
      duration_seconds: secondsRef.current,
      speed: finalSpeed,
      pace: finalPace,
      calories: Math.round(newDistance * 60),
    }),
   });

} catch (error) {
  console.error("Workout database save error:", error);
}



setIsPaused(false);

  if (gpsWatchId.current !== null) {
    navigator.geolocation.clearWatch(gpsWatchId.current);
    gpsWatchId.current = null;
  }

  speak("Target reached. Great job!");

  return targetDistanceKm;
}
    },
   (error) => {
  

  setGpsError(error.message);
},
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    }
  );
};
const listenForStop = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice recognition is not supported in this browser.");
    return;
  }
  

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  setIsListening(true);

  recognition.start();

  recognition.onresult = (event) => {
    const userSpeech = event.results[0][0].transcript.toLowerCase();

    

    setIsListening(false);

    if (
  userSpeech.includes("stop") ||
  userSpeech.includes("finish")
) {
  setWorkoutStarted(false);
setIsPaused(false);
setWorkoutCompleted(true);

setWorkoutHistory((prev) => [
  ...prev,
  {
    activity: activity,
    target: target,
    distance: distance,
    time: secondsRef.current,
    calories: Math.round(distance * 60),
    date: new Date().toLocaleString(),
  },
]);

speak("Workout stopped. Here is your workout summary.");
} else {
      speak("I did not understand. Please say stop.");
    }
  };

  recognition.onerror = () => {
    setIsListening(false);
    speak("I could not hear you. Please try again.");
  };

  recognition.onend = () => {
    setIsListening(false);
  };
};
const handleRegister = async () => {
  if (!registerName.trim() || !registerEmail.trim() || !registerPassword || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (registerPassword.length < 8) {
    alert("Password must be at least 8 characters long.");
    return;
  }

  if (registerPassword !== confirmPassword) {
    setResetError("Passwords do not match.");
    return;
  }

  try {
    const response = await fetch(
  "${API_BASE_URL}/register",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: registerName.trim(),
      email: registerEmail.trim(),
      password: registerPassword,
    }),
  }
);

    const data = await response.json();

    if (!response.ok) {
      alert(
  Array.isArray(data.detail)
    ? data.detail[0].msg
    : data.detail || "Registration failed."
);
      return;
    }

    alert("Account created successfully. Please log in.");

    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setConfirmPassword("");
    setShowRegister(false);
  } catch (error) {
    console.error("Registration error:", error);
    alert("Unable to connect to the server.");
  }
};
const handleLogin = async () => {
  

  try {
    const response = await fetch(
      `${API_BASE_URL}/login?email=${encodeURIComponent(loginEmail)}&password=${encodeURIComponent(loginPassword)}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();
    

    if (!response.ok) {
      alert(data.detail || "Invalid email or password");
      return;
    }

    setUser(data);
    setIsLoggedIn(true);
    localStorage.setItem("runtrackLoggedIn", "true");
    localStorage.setItem("runtrackUser", JSON.stringify(data));

  } catch (error) {
    console.error("Login error:", error);
    alert("Unable to connect to the server.");
  }
};

const handleForgotPassword = async () => {
  if (!forgotEmail.trim()) {
  setResetError("Please enter your registered email.");
  return;
}

  try {
    const response = await fetch(
      `${API_BASE_URL}/forgot-password?email=${encodeURIComponent(forgotEmail.trim())}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Email not found.");
      return;
    }

    setShowResetPassword(true);
  } catch (error) {
    console.error("Forgot password error:", error);
    alert("Unable to connect to the server.");
  }
};
const handleResetPassword = async () => {
  if (!newPassword.trim()) {
    alert("Please enter your new password.");
    return;
  }

  if (newPassword.length < 8) {
    setResetError("Password must be at least 8 characters.");
    return;
  }
if (newPassword !== confirmNewPassword) {
  setResetError("Passwords do not match.");
  return;
}
  try {
    const response = await fetch(
      `${API_BASE_URL}/reset-password?email=${encodeURIComponent(forgotEmail.trim())}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          new_password: newPassword,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Unable to reset password.");
      return;
    }

    setResetMessage("Password reset successfully.");

    setNewPassword("");
    setConfirmNewPassword("");
    setForgotEmail("");
    setResetError("");
    setResetMessage("");
    setShowResetPassword(false);
    setShowForgotPassword(false);
  } catch (error) {
    console.error("Reset password error:", error);
    alert("Unable to connect to the server.");
  }
};
const handleLogout = () => {
  setUser(null);
  setIsLoggedIn(false);
  setLogoutMessage("Logged out successfully.");
  setLoginEmail("");
  setLoginPassword("");

  localStorage.removeItem("runtrackLoggedIn");
  localStorage.removeItem("runtrackUser");
};
if (showWelcome) {
  return (
    <div className="welcome-container">
      <h1>RunTrack</h1>

      <div className="runner-image">
  <img
    src="/runner-silhouette.png"
    alt="Running silhouette"
    draggable="false"
  />
</div>

      <p>Train smarter. Perform better.</p>

      <button
        className="welcome-button"
        onClick={() => setShowWelcome(false)}
      >
        GET STARTED
      </button>
    </div>
  );
}

if (!isLoggedIn) {
  if (showForgotPassword) {
    if (showResetPassword) {
  return (
    <div className="login-container">
      <h1>🏃 RunTrack</h1>
      <h2>Reset Password</h2>
      {resetError && (
  <p className="error-message">{resetError}</p>
)}

     <div className="password-field">
  <input
    type={showResetPasswordText ? "text" : "password"}
    placeholder="Enter your new password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
  />

  <button
    type="button"
    className="password-eye-button"
    onClick={() => setShowResetPasswordText(!showResetPasswordText)}
  >
    {showResetPasswordText ? (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.7 4 10 8-0.4 1.2-1 2.4-1.8 3.4" />
        <path d="M6.6 6.6C4.7 7.8 3.4 9.6 2 12c1.3 4 5 8 10 8 1.2 0 2.3-.2 3.3-.6" />
      </svg>
    ) : (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    )}
  </button>
</div>
     <div className="password-field">
  <input
    type={showConfirmResetPasswordText ? "text" : "password"}
    placeholder="Confirm your new password"
    value={confirmNewPassword}
    onChange={(e) => setConfirmNewPassword(e.target.value)}
  />

  <button
    type="button"
    className="password-eye-button"
    onClick={() =>
      setShowConfirmResetPasswordText(!showConfirmResetPasswordText)
    }
  >
    {showConfirmResetPasswordText ? (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.7 4 10 8-0.4 1.2-1 2.4-1.8 3.4" />
        <path d="M6.6 6.6C4.7 7.8 3.4 9.6 2 12c1.3 4 5 8 10 8 1.2 0 2.3-.2 3.3-.6" />
      </svg>
    ) : (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    )}
  </button>
</div>

      <button
  className="login-action-button"
  onClick={handleResetPassword}
>
  RESET PASSWORD
</button>

      <button
        className="register-login-button"
        onClick={() => {
          setShowResetPassword(false);
          setShowForgotPassword(false);
        }}
      >
        Back to Login
      </button>
    </div>
  );
}
  return (
    <div className="login-container">
      <h1>🏃 RunTrack</h1>
      <h2>Forgot Password?</h2>
      {resetError && (
  <p className="error-message">{resetError}</p>
)}

      <input
        type="email"
        placeholder="Enter your registered email"
        value={forgotEmail}
        onChange={(e) => setForgotEmail(e.target.value)}
      />

      <button
  className="login-action-button"
  onClick={handleForgotPassword}
>
  CONTINUE
</button>

      <button
        className="register-login-button"
        onClick={() => setShowForgotPassword(false)}
      >
        Back to Login
      </button>
    </div>
  );
}
  if (showRegister) {
    return (
      <div className="login-container">
        <h1>🏃 RunTrack</h1>
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Enter your name"
          value={registerName}
          onChange={(e) => setRegisterName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter your email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
        />

        <div className="password-field">
  <input
    type={showRegisterPassword ? "text" : "password"}
    placeholder="Enter your password"
    value={registerPassword}
    onChange={(e) => setRegisterPassword(e.target.value)}
  />

  <button
    type="button"
    className="password-toggle"
    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
    aria-label={
      showRegisterPassword ? "Hide password" : "Show password"
    }
  >
    {showRegisterPassword ? (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ) : (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
        <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c7 0 10 8 10 8a16.8 16.8 0 0 1-2.1 3.2" />
        <path d="M6.3 6.3C3.6 8.2 2 12 2 12s3 7 10 7a9.8 9.8 0 0 0 2.9-.4" />
      </svg>
    )}
  </button>
</div>

        <div className="password-field">
  <input
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Confirm your password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
  />

  <button
    type="button"
    className="password-toggle"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    aria-label={
      showConfirmPassword ? "Hide password" : "Show password"
    }
  >
    {showConfirmPassword ? (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ) : (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
        <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c7 0 10 8 10 8a16.8 16.8 0 0 1-2.1 3.2" />
        <path d="M6.3 6.3C3.6 8.2 2 12 2 12s3 7 10 7a9.8 9.8 0 0 0 2.9-.4" />
      </svg>
    )}
  </button>
</div>

        <button
  className="login-action-button"
  onClick={handleRegister}
>
  SIGN UP
</button>

        <br />

        <button
  className="register-login-button"
  onClick={() => setShowRegister(false)}
>
  Already have an account? Login
</button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h1>🏃 RunTrack</h1>
      <h2>Login</h2>
      {logoutMessage && (
  <div className="logout-toast">
    ✓ {logoutMessage}
  </div>
)}

      <input
        type="email"
        placeholder="Enter your email"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
      />

      <br />
      <br />

      <div className="password-field">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter your password"
    value={loginPassword}
    onChange={(e) => setLoginPassword(e.target.value)}
  />

  <button
  type="button"
  className="password-toggle"
  onClick={() => setShowPassword(!showPassword)}
  aria-label={showPassword ? "Hide password" : "Show password"}
>
  {showPassword ? (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 1 0 2.8 2.8" />
      <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-3.2 4.4" />
      <path d="M6.6 6.6C3.7 8.5 2 12 2 12s3.5 8 10 8c1.8 0 3.3-.5 4.6-1.2" />
    </svg>
  )}
</button>
</div>

      <br />
      <br />
{resetMessage && (
  <p className="success-message">{resetMessage}</p>
)}
      <button className="login-action-button" onClick={handleLogin}>
  LOGIN
</button>
      <br />
<button
  className="login-secondary-button"
  onClick={() => setShowForgotPassword(true)}
>
  Forgot Password?
</button>
<br />

<button
  className="login-secondary-button signup-button"
  onClick={() => setShowRegister(true)}
>
  Don't have an account? Sign Up
</button>
    </div>
  );
}
const handleProfilePhotoChange = async (event) => {
  const file = event.target.files[0];

  if (!file) return;

  if (!["image/jpeg", "image/png"].includes(file.type)) {
    alert("Only JPG and PNG images are allowed.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Image size must be less than 5 MB.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  

  try {
    const response = await fetch(
      `${API_BASE_URL}/upload-profile-photo?user_id=${user?.user_id}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    const photoPath = `${API_BASE_URL}${data.profile_photo}`;

    if (!response.ok) {
      alert(data.detail || "Profile photo upload failed.");
      return;
    }

    

    setProfilePhoto(photoPath);

    const updatedUser = {
      ...user,
      profile_photo: data.profile_photo,
    };

    setUser(updatedUser);
    localStorage.setItem("runtrackUser", JSON.stringify(updatedUser));

    alert("Profile photo uploaded successfully.");
  } catch (error) {
    console.error("Profile photo upload error:", error);
    alert("Unable to upload profile photo.");
  }
};
return (
    <div className="app-container">
      <h1>🏃 RunTrack</h1>
<p>Welcome, {user?.name}! 👋</p>

<button className="logout-button" onClick={handleLogout}>
  LOGOUT
</button>
<div className="profile-card">
  <h2>👤 My Profile</h2>

  <div className="profile-photo-section">
    <div className="profile-photo-placeholder">
  {profilePhoto ? (
    <img src={profilePhoto} alt="Profile" />
  ) : (
    "👤"
  )}
</div>

    <label className="profile-photo-button">
      Change Photo
      <input
  type="file"
  accept="image/jpeg,image/png"
  hidden
  onChange={handleProfilePhotoChange}
/>
    </label>
  </div>

  <p><strong>Name:</strong> {user?.name}</p>
  <p><strong>Email:</strong> {user?.email}</p>
</div>
<div className="dashboard-section">
  <h2>📊 Your Dashboard</h2>

  <div className="dashboard-card">
    <h3>🏃 Total Workouts</h3>
    <p>{workoutHistory.length}</p>
  </div>
  <div className="dashboard-card">
  <h3>📏 Total Distance</h3>
  <p>
    {workoutHistory
      .reduce((total, workout) => total + workout.distance, 0)
      .toFixed(2)}{" "}
    km
  </p>
</div>
<div className="dashboard-card">
  <h3>🔥 Total Calories</h3>
  <p>
    {workoutHistory
      .reduce((total, workout) => total + workout.calories, 0)
      .toFixed(0)}{" "}
    kcal
  </p>
</div>
<div className="recent-workouts">
  <h3>📋 Recent Workouts</h3>

  {workoutHistory.slice(-3).reverse().map((workout, index) => (
    <div className="recent-workout-card" key={index}>
      <p>🏃 {workout.activity}</p>
      <p>📏 {workout.distance.toFixed(2)} km</p>
      <p>⏱️ {Math.floor(workout.time / 60)}:
        {(workout.time % 60).toString().padStart(2, "0")}
      </p>
    </div>
  ))}
</div>
<div className="dashboard-card">
  <h3>🏆 Longest Distance</h3>
  <p>
    {workoutHistory.length > 0
      ? Math.max(...workoutHistory.map((workout) => workout.distance)).toFixed(2)
      : "0.00"}{" "}
    km
  </p>
</div>
<div className="dashboard-card">
  <h3>⚡ Fastest Speed</h3>
  <p>
    {workoutHistory.length > 0
      ? Math.max(
          ...workoutHistory.map((workout) => workout.speed || 0)
        ).toFixed(2)
      : "0.00"}{" "}
    km/h
  </p>
</div>
<div className="dashboard-card">
  <h3>⏱️ Best Pace</h3>
  <p>
    {workoutHistory.length > 0
      ? Math.min(
          ...workoutHistory
            .map((workout) => workout.pace || 0)
            .filter((pace) => pace > 0)
        ).toFixed(2)
      : "0.00"}{" "}
    min/km
  </p>
</div>
</div>
<div className="workout-setup">
      <p>Smart Fitness & Training Assistant</p>

     <h2>Choose Voice Language</h2>

<div className="language-buttons">
  <button onClick={() => setVoiceLanguage("english")}>
    <img
      src="/india-flag.svg"
      alt="India"
      width="22"
      style={{ verticalAlign: "middle", marginRight: "5px" }}
    />
    English
  </button>

  <button onClick={() => setVoiceLanguage("telugu")}>
    <img
      src="/india-flag.svg"
      alt="India"
      width="22"
      style={{ verticalAlign: "middle", marginRight: "5px" }}
    />
    తెలుగు
  </button>
</div>

<p>
  Selected Language:{" "}
  {voiceLanguage === "english" ? "English" : "తెలుగు"}
</p>

      {/* Activity Selection */}

      <h2>Choose Your Activity</h2>
      <div className="activity-buttons">
      <button onClick={() => setActivity("Walking")}>
        🚶 Walking
      </button>

      <button onClick={() => setActivity("Jogging")}>
        🏃 Jogging
      </button>

      <button onClick={() => setActivity("Running")}>
        🏃 Running
      </button>
      </div>

      <p className="selected-activity">
  Selected Activity: {activity || "None"}
</p>

      {/* Target Distance */}
      <h2>Choose Your Target Distance</h2>

<div className="target-buttons">
  <button onClick={() => setTarget("100 m")}>100 m</button>
  <button onClick={() => setTarget("200 m")}>200 m</button>
  <button onClick={() => setTarget("400 m")}>400 m</button>
  <button onClick={() => setTarget("1 km")}>1 km</button>
  <button onClick={() => setTarget("Custom")}>Custom</button>
</div>

      {target === "Custom" && (
        <div>
          <p>Enter your target distance:</p>

          <input
            type="number"
            placeholder="Example: 5"
            value={customTarget}
            onChange={(e) => setCustomTarget(e.target.value)}
          />

          <select>
            <option>km</option>
            <option>m</option>
          </select>

          <button
            onClick={() => setTarget(`${customTarget} m`)}
          >
            Set Target
          </button>
        </div>
      )}

      <p className="selection-status">
  Selected Target: {target || "None"}
</p>

      {/* Voice Alert Interval */}
      <h2>Choose Voice Alert Interval</h2>
      <div className="voice-alert-buttons">

      <button onClick={() => setAlertInterval("100 m")}>
        100 m
      </button>

      <button onClick={() => setAlertInterval("500 m")}>
        500 m
      </button>

      <button onClick={() => setAlertInterval("1 km")}>
        1 km
      </button>

      <button onClick={() => setAlertInterval("2 km")}>
        2 km
      </button>

      <button onClick={() => setAlertInterval("Custom")}>
        Custom
      </button>
      </div>

      {alertInterval === "Custom" && (
        <div>
          <p>Enter your alert interval:</p>

          <input
            type="number"
            placeholder="Example: 1"
            value={customAlert}
            onChange={(e) => setCustomAlert(e.target.value)}
          />

          <select>
            <option>km</option>
            <option>m</option>
          </select>

          <button
            onClick={() => setAlertInterval(`${customAlert} km`)}
          >
            Set Interval
          </button>
        </div>
      )}

      <p className="selection-status">
  Voice Alert: {alertInterval || "None"}
</p>

      <br />

      <button
      className="start-workout-button"
  onClick={async () => {
    await speak("Your workout is ready. Can I start the timer?");
listenForStart();
  }}
>
  START WORKOUT
</button>
{isListening && (
  <p>🎤 Listening... Say "Yes" to start.</p>
)}
</div>
        {workoutStarted && (
  <div className="active-workout">
  <h2>Workout Started! 🏃</h2>
  <div className="metrics-grid">
   <div className="metric-card">
  <h3>
    ⏱️ Time: {Math.floor(seconds / 60)}:
    {(seconds % 60).toString().padStart(2, "0")}
  </h3>
</div>

<div className="metric-card">
  <p>📍 Distance: {distance.toFixed(2)} km</p>
</div>
<div className="metric-card">
  <p>⚡ Speed: {speed.toFixed(2)} km/h</p>
</div>

<div className="metric-card">
  <p>⏱️ Pace: {pace.toFixed(2)} min/km</p>
</div>

<div className="metric-card">
  <p>🔥 Calories: {calories.toFixed(0)} kcal</p>
</div>
</div>
<div className="gps-status">
  {gpsError && (
    <p>⚠️ GPS Error: {gpsError}</p>
  )}

  {location && (
    <p>
      📍 GPS: {location.latitude.toFixed(5)},{" "}
      {location.longitude.toFixed(5)}
    </p>
  )}
</div>
{location && (
  <div className="workout-map">
    <h3 className="live-route-title">📍 Live Route</h3>
    <MapContainer
      center={[location.latitude, location.longitude]}
      zoom={16}
      scrollWheelZoom={false}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater
  location={location}
  routeCoordinates={routeCoordinates}
/>

     {routeCoordinates.length > 0 && (
  <Marker
  position={routeCoordinates[0]}
  icon={startIcon}
/>
)}

<Marker
  position={[location.latitude, location.longitude]}
  icon={currentIcon}
/>

<Polyline
  positions={
  matchedRouteCoordinates.length > 1
    ? matchedRouteCoordinates
    : routeCoordinates
}
  pathOptions={{ color: "#c2185b", weight: 5 }}
/>
    </MapContainer>
    <div className="map-legend">
  <span>🟢 Start</span>
  <span>🩷 Current</span>
  <span>━ Route</span>
</div>
  </div>
)}
    <div className="workout-buttons">
    <button
      className="workout-button"
      onClick={() => setIsPaused(!isPaused)}
    >
      {isPaused ? "RESUME" : "PAUSE"}
    </button>

    <button
      className="workout-button"
      onClick={listenForStop}
    >
      🎤 VOICE STOP
    </button>
  </div>

    <p>Activity: {activity}</p>
    <p>Target: {target}</p>
    <p>Voice Alert: {alertInterval}</p>
  </div>
 )}
 {workoutCompleted && (
  <div className="workout-summary">
    <h2>🏁 Workout Completed!</h2>

    <h3>Workout Summary</h3>

    <p>Activity: {activity}</p>
    <p>Target: {target}</p>
    <p>Voice Alert: {alertInterval}</p>
    <p>Distance Completed: {distance.toFixed(2)} km</p>

    <p>
      ⏱️ Total Time: {Math.floor(seconds / 60)}:
      {(seconds % 60).toString().padStart(2, "0")}
    </p>
  </div>
)}
         {workoutHistory.length > 0 && (
        <div className="workout-history">
  <h2>📋 Workout History</h2>

  {workoutHistory.map((workout, index) => (
    <div key={index} className="workout-card">
      <h3>Workout {index + 1}</h3>

      <div className="workout-details">
  <p>🏃 Activity: {workout.activity}</p>
  <p>🎯 Target: {workout.target}</p>
  <p>📍 Distance: {workout.distance.toFixed(2)} km</p>
  <p>
    ⏱️ Time: {Math.floor(workout.time / 60)}:
    {(workout.time % 60).toString().padStart(2, "0")}
  </p>
  <p>⚡ Speed: {(workout.speed || 0).toFixed(2)} km/h</p>
  <p>🕐 Pace: {(workout.pace || 0).toFixed(2)} min/km</p>
  <p>🔥 Calories: {workout.calories.toFixed(0)} kcal</p>
  <p>📅 Date: {workout.date}</p>
</div>
    </div>
))}
</div>
)}

</div>
);

}

export default App;