import React, { useState, useEffect } from "react";

const Grid = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [answerGrid, setAnswerGrid] = useState<number[][]>([]);

  // Create the grids when the component is mounted
  useEffect(() => {
    const newGrid = create_grid(5); // Create a 5x5 grid (answer grid)
    const emptyGrid = create_empty_grid(5); // Create a 5x5 empty grid
    setGrid(newGrid);
    setAnswerGrid(emptyGrid);
  }, []);

  function checkAnswer(){
    const areEqual = grid.every((row, rowIndex) =>
        row.every((cell, cellIndex) => cell === answerGrid[rowIndex][cellIndex])
      );
    console.log(areEqual);
  }

  // Create an empty grid with 0 values
  function create_empty_grid(size: number): number[][] {
    const grid: number[][] = [];
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        row.push(0); // All cells are initialized to 0
      }
      grid.push(row);
    }
    return grid;
  }

  // Create a random grid (answer grid)
  function create_grid(size: number): number[][] {
    const grid: number[][] = [];
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        const cell: number = Math.random() < 0.5 ? 0 : 1; // Randomly assign 0 or 1
        row.push(cell);
      }
      grid.push(row);
    }
    return grid;
  }

  // Function to handle cell click
  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    const newAnswerGrid = answerGrid.map((row, rIndex) =>
      row.map((cell, cIndex) => {
        if (rIndex === rowIndex && cIndex === cellIndex) {
          return 1; // Update the corresponding cell in the empty grid
        }
        return cell;
      })
    );
    setAnswerGrid(newAnswerGrid); // Update the answerGrid state

    // Log the updated answerGrid to verify the changes
    console.log("Updated Answer Grid:", newAnswerGrid);
  };

  return (
    <div className="grid h-screen place-items-center">
      {/* Render the Answer Grid (Visible to User) */}
      <div
        className="grid bg-red-400"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${grid.length}, 1fr)`,
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          width: "600px",
          height: "600px",
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              onClick={() => handleCellClick(rowIndex, cellIndex)} // Add click handler
              style={{
                backgroundColor:
                  cell === 1 ? "blue" : "yellow", // Display based on the value
                border: "1px solid orange",
                cursor: "pointer", // Add pointer cursor for better UX
              }}
            />
          ))
        )}
      </div>
      <button
      onClick={checkAnswer}
      >
            Test
      </button>
    </div>
  );
};

export default Grid;
