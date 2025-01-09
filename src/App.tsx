import React, { useState, useEffect } from "react";
import Grid from "./components/Grid.tsx";
import Buttons from "./components/Buttons.tsx";
import Timer from "./components/Timer.tsx";

import Login from "./pages/Login.tsx";
import DailyChallenge from "./pages/DailyChallenge.tsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext"; // Contexto de autenticação
import ProtectedRoute from "./components/auth/ProtectedRoute"; // Rota protegida

const App: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [rowHints, setRowHints] = useState<number[][]>([]);
  const [colHints, setColHints] = useState<number[][]>([]);

  const [resetTimer, setResetTimer] = useState(false);
  const [highScore, setHighScore] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState<number>(0);

  useEffect(() => {
    // Generate a game when the component mounts
    generateGame();
  }, []);

  const generateGame = () => {    
    console.log("Generating new game...");
    const newGrid = createGrid(5); // Generate a new 5x5 grid
    setGrid(newGrid);

    const { rowHints, colHints } = calculateHints(newGrid);
    setRowHints(rowHints);
    setColHints(colHints);

    // Add a function that resets the Timer
    setResetTimer(true);
  };

  // Create a random grid (answer grid)
  const createGrid = (size: number): number[][] => {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }, () => (Math.random() < 0.5 ? 0 : 1))
    );
  };

  // Generate hints for rows and columns
  const calculateHints = (grid: number[][]) => {
    const calculateLineHints = (line: number[]) => {
      const hints: number[] = [];
      let count = 0;

      for (const cell of line) {
        if (cell === 1) {
          count += 1; // Count consecutive 1's
        } else if (count > 0) {
          hints.push(count); // Add the count to hints
          count = 0;
        }
      }

      if (count > 0) {
        hints.push(count); // Add the last group if it ends with 1's
      }

      return hints.length > 0 ? hints : [0]; // Return [0] if no 1's are found
    };

    const rowHints = grid.map((row) => calculateLineHints(row));
    const colHints = grid[0].map((_, colIndex) =>
      calculateLineHints(grid.map((row) => row[colIndex]))
    );

    return { rowHints, colHints };
  };

  const getHighscore = async() =>{
    // Retrieve the user past highscore
    try {
      const response = await fetch('http://localhost:3000/get-highscore', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      setHighScore(data.highscore);
      console.log(highScore);
    } catch (err) {
      console.error('Error checking username:', err);
    }
  }

  const updateHS = async () => {
    try {
      // Update the high score on the server
      const response = await fetch('http://localhost:3000/update-highscore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ highscore: currentScore }),
        credentials: 'include', // Include cookies for authentication
      });

      const data = await response.json();
      if (response.ok) {
        setHighScore(data.highscore); // Update the high score in the state
      } else {
        console.error('Failed to update high score:', data.message);
      }
    } catch (err) {
      console.error('Error updating high score:', err);
    }
  }

  const handleWin = async () => { 

    alert("You won lmaoo");

    // Define the user past highscore
    getHighscore();

    // Compare high and current score
    if(currentScore < highScore){
      // Update highscore
      updateHS();
      alert("New Highscore!!");
    }

    generateGame();
    
  }

  const handleTimerComplete = (timeTaken: number) => {
    setCurrentScore(timeTaken);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Página de Login (aberta a todos) */}
          <Route path="/home" element={<Login />} />

          {/* Rota protegida para o jogo principal */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="flex flex-col min-h-screen bg-gray-900 text-white">
                  <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="relative flex flex-col items-center gap-4">
                      {/* Timer */}
                      <Timer
                        resetTimer={resetTimer}
                        onResetComplete={() => setResetTimer(false)}
                        onComplete={handleTimerComplete}
                      />
                      {/* Grid */}
                      <Grid
                        grid={grid}
                        rowHints={rowHints}
                        colHints={colHints}
                        calculateHints={calculateHints}
                        winCallBack={handleWin}
                      />

                      {/* Buttons */}
                      <div className="flex gap-2 mt-4">
                        <Buttons onClick={handleWin} />
                      </div>
                    </div>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Rota protegida para o desafio diário */}
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
