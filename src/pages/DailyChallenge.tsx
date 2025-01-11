import React, { useState, useEffect } from "react";
import Grid from "../components/Grid"; 
import Timer from "../components/Timer"; 

interface DailyChallengeProps {
    calculateHints: (grid: number[][]) => { rowHints: number[][]; colHints: number[][] };
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ calculateHints }) => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [rowHints, setRowHints] = useState<number[][]>([]);
  const [colHints, setColHints] = useState<number[][]>([]);
  const [resetTimer, setResetTimer] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the daily challenge from the backend
  const fetchDailyChallenge = async () => {
    try {
      setLoading(true);
      setError(null);
  
      // Try to fetch the daily challenge
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
      // Handle any unexpected errors
      console.error("Error in fetchDailyChallenge:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleWin = () => {
    alert("You won the DAILY MODE mode!");
  }

  useEffect(() => {
    fetchDailyChallenge();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative flex flex-col items-center gap-4">
          {/* Timer */}
          <Timer
            resetTimer={resetTimer}
            onResetComplete={() => setResetTimer(false)}
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
        </div>
      </main>
    </div>
  );
};

export default DailyChallenge;
