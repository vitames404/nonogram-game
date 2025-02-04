import React, { useState, useEffect } from "react";
import Grid from "./components/Grid.tsx";
import Buttons from "./components/Buttons.tsx";
import Timer from "./components/Timer.tsx";
import Login from "./pages/Login.tsx";
import DailyChallenge from "./pages/DailyChallenge.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Logout from "pixelarticons/svg/logout.svg";
import HowToPlayPopup from "./components/HowtoPlayPopup.tsx";

import {Canvas} from "@react-three/fiber";
import {Stars} from "@react-three/drei";

const App: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [rowHints, setRowHints] = useState<number[][]>([]);
  const [colHints, setColHints] = useState<number[][]>([]);
  const [resetTimer, setResetTimer] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false); // State for popup visibility
  const [highScore, setHighScore] = useState<number>(0);
  const [highscorePrint, setHighscorePrint] = useState<string>("0:00:00");
  const [username, setUsername] = useState<string>("Loading...")
  const [currentScore, setCurrentScore] = useState<number>(0);

  useEffect(() => {
    generateGame();
    getHighscore();
  }, []);

  useEffect(() => {
    formatTime(highScore);
  }, [highScore]);

  const generateGame = () => {
    const newGrid = createGrid(5);
    setGrid(newGrid);

    const { rowHints, colHints } = calculateHints(newGrid);
    setRowHints(rowHints);
    setColHints(colHints);

    setResetTimer(true);
  };

  const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000';

  const formatTime = (centiseconds: number): void => {
    const minutes = Math.floor((centiseconds / 100) / 60);
    const seconds = Math.floor((centiseconds / 100) % 60);
    const cs = centiseconds % 100;
    setHighscorePrint(`${minutes}:${String(seconds).padStart(2, '0')}:${String(cs).padStart(2, '0')}`);
  };

  const createGrid = (size: number): number[][] => {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }, () => (Math.random() < 0.5 ? 0 : 1))
    );
  };

  const calculateHints = (grid: number[][]) => {
    const calculateLineHints = (line: number[]) => {
      const hints: number[] = [];
      let count = 0;

      for (const cell of line) {
        if (cell === 1) {
          count += 1;
        } else if (count > 0) {
          hints.push(count);
          count = 0;
        }
      }

      if (count > 0) {
        hints.push(count);
      }

      return hints.length > 0 ? hints : [0];
    };

    const rowHints = grid.map((row) => calculateLineHints(row));
    const colHints = grid[0].map((_, colIndex) =>
      calculateLineHints(grid.map((row) => row[colIndex]))
    );

    return { rowHints, colHints };
  };

  const getHighscore = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-userinfo`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      setHighScore(data.highscore);
      setUsername(data.username);
    } catch (err) {
      console.error('Error checking username:', err);
    }
  };

  const updateHS = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/update-highscore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ highscore: currentScore }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setHighScore(data.highscore);
      } else {
        console.error('Failed to update high score:', data.message);
      }
    } catch (err) {
      console.error('Error updating high score:', err);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',  // Ensure cookies are included in the request
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
  
      if (response.ok) {
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/home";  
      } else {
        console.error('Failed to logout');
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const handleWin = async () => {
    alert("You won lmaoo");
    getHighscore();

    if (currentScore < highScore || highScore == null) {
      updateHS();
      alert("New Highscore!!");
    }
  };

  const handleTimerComplete = (timeTaken: number) => {
    setCurrentScore(timeTaken);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/home" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                <div className="flex flex-col min-h-screen relative z-10 text-white">
                  <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="relative flex flex-col items-center gap-4">
                      <Timer
                        resetTimer={resetTimer}
                        onResetComplete={() => setResetTimer(false)}
                        onComplete={handleTimerComplete}
                      />
                      <Grid
                        grid={grid}
                        rowHints={rowHints}
                        colHints={colHints}
                        calculateHints={calculateHints}
                        winCallBack={handleWin}
                      />
                      <div className="flex gap-2 mt-4">
                      <Buttons
                        onClick={generateGame} // Existing function for the repeat button
                        onHowToPlayClick={() => setShowHowToPlay(true)} // Function to show the popup
                      />
                      </div>
                    </div>
                    <div className="font-vt323 text-2xl hidden md:block top-5 left-1/2 transform -translate-x-1/2 bg-gray-800 p-4 rounded-lg shadow-lg md:absolute md:left-auto md:right-4 md:transform-none relative">
                      <h3 className="text-3xl font-bold">User Info</h3>
                      <p>Name: {username}</p>
                      <p>Lowest time: {highscorePrint}</p>
                      <button 
                        onClick={handleLogout} 
                        className="absolute top-2 right-2 p-[5px] rounded-md text-black bg-gray-100"
                      >
                        <img src={Logout} alt="Repeat" className="max-w-[20px] max-h-[20px] h-[8vw]" />
                      </button>
                      {/* How to Play Popup */}
                      {showHowToPlay && (
                        <HowToPlayPopup isVisible={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
                      )}
                    </div>
                  </main>
                </div>
                {/* Canvas for Stars */}
                <div className="fixed inset-0 z-0 pointer-events-none bg-gray-900">
                  <Canvas>
                    <Stars
                      radius={100}
                      depth={50}
                      count={5000}
                      factor={4}
                      saturation={0}
                      fade
                      speed={1}
                    />
                  </Canvas>
                </div>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/daily-challenge"
            element={
              <ProtectedRoute>
                <DailyChallenge calculateHints={calculateHints} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;