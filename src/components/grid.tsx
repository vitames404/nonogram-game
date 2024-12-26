import React, { useState, useEffect } from "react";

const Grid = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [answerGrid, setAnswerGrid] = useState<number[][]>([]);
  const [rowHints, setRowHints] = useState<number[][]>([]);
  const [colHints, setColHints] = useState<number[][]>([]);

  // Create the grids when the component is mounted
  useEffect(() => {
    const newGrid = create_grid(5); // Create a 5x5 grid (answer grid)
    const emptyGrid = create_empty_grid(5); // Create a 5x5 empty grid
    
    setGrid(newGrid);
    setAnswerGrid(emptyGrid);

    // Generate hints for the grid
    const { rowHints, colHints } = generateHints(newGrid);
    setRowHints(rowHints);
    setColHints(colHints);

  }, []);

  function checkAnswer() {
    const isCorrect = grid.every((row, rowIndex) =>
      row.every((cell, cellIndex) => cell === answerGrid[rowIndex][cellIndex])
    );
  
    if (isCorrect) {
      console.log("WIN!!!");
    } else {
      console.log("Not yet correct, keep trying!");
    }
  
    return isCorrect;
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
    // Create the updated grid
    const newAnswerGrid = answerGrid.map((row, rIndex) =>
      row.map((cell, cIndex) => {
        if (rIndex === rowIndex && cIndex === cellIndex) {
          return cell === 1 ? 0 : 1; // Toggle between 0 and 1
        }
        return cell;
      })
    );
  
    // Check if the new grid matches the correct grid
    const isCorrect = newAnswerGrid.every((row, rIndex) =>
      row.every((cell, cIndex) => cell === grid[rIndex][cIndex])
    );
  
    // Update the state
    setAnswerGrid(newAnswerGrid);
  
    // Log the result
    if (isCorrect) {
      console.log("WIN!!!");
    } else {
      console.log("Not yet correct, keep trying!");
    }
  };
  

  // Generate hints for rows and columns
  function generateHints(grid) {
    function calculateHints(line) {
      const hints = [];
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
    }

    const rowHints = grid.map(row => calculateHints(row));

    const colHints = grid[0].map((_, colIndex) =>
      calculateHints(grid.map(row => row[colIndex]))
    );

    return { rowHints, colHints };
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div>
        {/* Column Hints */}
        <div className="grid py-3 grid-cols-5 ml-[45px] gap-1 w-[400px]">
          {colHints.map((hint, colIndex) => (
            <div
              key={colIndex}
              className="flex text-2xl flex-col items-center justify-end font-bold text-center text-white"
            >
              {hint.map((num, index) => (
                <span key={index} className="leading-tight">
                  {num}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Row hints */}
          <div className="grid grid-rows-5 text-white mr-4">
            {rowHints.map((hint, rowIndex) => (
              <div
                key={rowIndex}
                className="flex text-2xl items-center justify-end text-white font-bold"
              >
                {hint.join(" ")}
              </div>
            ))}
          </div>

          {/* Render the Answer Grid */}
          <div
            className={`grid gap-1`} // Add gap for spacing between squares
            style={{
              gridTemplateColumns: `repeat(${grid.length}, 1fr)`,
              gridTemplateRows: `repeat(${grid.length}, 1fr)`,
              width: "400px",
              height: "400px",
            }}
          >
            {answerGrid.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <div
                  key={`${rowIndex}-${cellIndex}`}
                  onClick={() => handleCellClick(rowIndex, cellIndex)} // Add click handler
                  className={`cursor-pointer`}
                  style={{
                    backgroundColor: cell === 1 ? "blue" : "white", // Display based on the value
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grid;
