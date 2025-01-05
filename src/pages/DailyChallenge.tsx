import React, { useState, useEffect } from "react";
import Grid from "../components/Grid"; // Assuming the Grid component is already created
import Timer from "../components/Timer"; // Optional, include if needed
import axios from "axios";

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
      const response = await axios.get("http://localhost:3000/get-daily");
      const { puzzle } = response.data;
      console.log(response.data.puzzle.grid);

      setGrid(puzzle.grid);
      setRowHints(puzzle.rowHints);
      setColHints(puzzle.colHints);
      setResetTimer(true); // Reset the timer (if applicable)
    } catch (err) {
      console.error("Error fetching the daily challenge:", err);
      setError("Failed to fetch the daily challenge. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            />
          )}

          {/* Fetch Daily Challenge Button */}
          <button
            onClick={fetchDailyChallenge}
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Fetch Daily Challenge Again
          </button>
        </div>
      </main>
    </div>
  );
};

export default DailyChallenge;
