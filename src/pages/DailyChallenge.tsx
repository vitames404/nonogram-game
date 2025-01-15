import React, { useState, useEffect } from "react";
import Grid from "../components/Grid";
import Timer from "../components/Timer";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

interface DailyChallengeProps {
  calculateHints: (grid: number[][]) => {
    rowHints: number[][];
    colHints: number[][];
  };
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ calculateHints }) => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [rowHints, setRowHints] = useState<number[][]>([]);
  const [colHints, setColHints] = useState<number[][]>([]);
  const [resetTimer, setResetTimer] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ranking, setRanking] = useState<{ username: string; time: number }[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Fetch the daily challenge from the backend
  const fetchDailyChallenge = async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchResponse = await fetch("http://localhost:3000/get-daily");

      if (!fetchResponse.ok) {
        if (fetchResponse.status === 404) {
          const createResponse = await fetch("http://localhost:3000/create-daily", {
            method: "POST",
          });

          if (!createResponse.ok) {
            throw new Error("Failed to create the daily challenge.");
          }

          const newChallengeResponse = await fetch("http://localhost:3000/get-daily");
          if (!newChallengeResponse.ok) {
            throw new Error("Failed to fetch the newly created challenge.");
          }

          const { puzzle: newPuzzle } = await newChallengeResponse.json();

          setGrid(newPuzzle.grid);
          setRowHints(newPuzzle.rowHints);
          setColHints(newPuzzle.colHints);
          setResetTimer(true);
        } else {
          throw new Error(`Failed to fetch the daily challenge. Status: ${fetchResponse.status}`);
        }
      } else {
        // If fetch is successful, set the grid and hints
        const { puzzle } = await fetchResponse.json();
        setGrid(puzzle.grid);
        setRowHints(puzzle.rowHints);
        setColHints(puzzle.colHints);
        setResetTimer(true);
      }
    } catch (error) {
      console.error("Error in fetchDailyChallenge:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRanking = async () => {
    try {
      const response = await fetch("http://localhost:3000/fetch-ranking", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { rankings } = await response.json();
      setRanking(rankings);
    } catch (err) {
      console.error("Error in fetchRanking:", err);
    }
  };

  const handleTimerComplete = (timeTaken: number) => {
    setCurrentTime(timeTaken);
  };

  const updateUser = () => {

    try{
      const response = fetch('http://localhost:3000/user-played',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

    }catch(err){  
      console.log(err);
    }

  }

  const addRanking = async () => {
    try {
      const response = await fetch('http://localhost:3000/add-ranking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ time: currentTime }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error adding ranking:', errorData);
      }

    } catch (err) {
      console.log(err);
    }
  }

  const handleWin = () => {
    alert("You won the DAILY MODE mode!");
    fetchRanking();
    addRanking();
    updateUser();
  };

  useEffect(() => {
    fetchDailyChallenge();
    fetchRanking();
  }, []);

  // Monitor changes to the ranking state and log the updated value
  useEffect(() => {
    console.log("Updated Ranking:", ranking);
  }, [ranking]);

  return (
    <>
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

      {/* Main Content */}
      <div className="flex flex-col min-h-screen text-white relative z-10">
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="relative flex flex-col items-center gap-4">
            {/* Timer */}
            <Timer
              resetTimer={resetTimer}
              onResetComplete={() => setResetTimer(false)}
              onComplete={handleTimerComplete}
            />

            {/* Display loading or error */}
            {loading && <p className="text-xl text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Grid */}
            {!loading && !error && (
              <Grid
                grid={grid}
                rowHints={rowHints}
                colHints={colHints}
                calculateHints={calculateHints}
                winCallBack={handleWin}
              />
            )}

            {/* Ranking List */}
            {!loading && ranking.length > 0 && (
              <div className="mt-6 w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-center mb-4">Rankings</h2>
                <ul>
                  {ranking.map((entry, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-gray-700 p-2 rounded-md mb-2"
                    >
                      <span className="font-medium">{entry.username}</span>
                      <span className="text-sm text-gray-400">{entry.time} seconds</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* No rankings available */}
            {!loading && ranking.length === 0 && (
              <p className="mt-6 text-gray-500 text-center">No rankings available yet.</p>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default DailyChallenge;