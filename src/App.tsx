import React, { useState, useEffect } from "react";
import Grid from "./components/Grid.tsx";
import Buttons from "./components/Buttons.tsx";
import Timer from "./components/Timer.tsx";

const App: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [rowHints, setRowHints] = useState<number[][]>([]);
  const [colHints, setColHints] = useState<number[][]>([]);

  const [resetTimer, setResetTimer] = useState(false);

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative flex flex-col items-center gap-4">
          {/* Timer */}
          <Timer resetTimer={resetTimer} onResetComplete={() => setResetTimer(false)} />
            
          {/* Grid */}
          <Grid
            grid={grid}
            rowHints={rowHints}
            colHints={colHints}
            calculateHints={calculateHints} // Pass the calculateHints function as a prop
          />

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            <Buttons onClick={generateGame} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
