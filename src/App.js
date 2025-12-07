import React, { useState } from "react";
import Dashboard from './components/Dashboard/Dashboard';
import CreateQuestionSet from './components/QuestionSet/CreateQuestionSet';
import Login from './components/Login/Login';
import LessonHistory from './components/LessonHistory/LessonHistory';
import Leaderboard from './components/Leaderboard/Leaderboard';
import TeacherProfile from './components/TeacherProfile/TeacherProfile';

// --- MAIN APPLICATION ---
function App() {
  const [view, setView] = useState("dashboard"); // 'dashboard', 'create', 'lessonHistory', 'leaderboard', 'profile'
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView("dashboard"); // Reset view when logging out
  };

  // If not logged in, show login page
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // If logged in, show the main application
  return (
    <div className="font-sans antialiased">
      {view === "dashboard" && <Dashboard setView={setView} onLogout={handleLogout} />}
      {view === "create" && <CreateQuestionSet setView={setView} onLogout={handleLogout} />}
      {view === "lessonHistory" && <LessonHistory setView={setView} onLogout={handleLogout} />}
      {view === "leaderboard" && <Leaderboard setView={setView} onLogout={handleLogout} />}
      {view === "profile" && <TeacherProfile setView={setView} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
