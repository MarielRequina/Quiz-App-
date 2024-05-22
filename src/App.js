import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate from react-router-dom
import LoginPage from './pages/loginPage';
import SignUpPage from './pages/sign';
import QuizPage from './pages/quiz';
import ProfilePage from './pages/profile';
import Leaderboard from './components/leader';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> {/* Default route redirects to login */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/quiz/profile" element={<ProfilePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/sign" element={<SignUpPage />} />
        <Route path="/leader" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
