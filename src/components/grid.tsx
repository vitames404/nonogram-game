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

  // Create an empty grid with 0 values
  function create_empty_grid(size: number): number[][] {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }, () => 0)
    );
  }

  // Create a random grid (answer grid)
  function create_grid(size: number): number[][] {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }, () => (Math.random() < 0.5 ? 0 : 1))
    );
  }

  // Function to handle cell click
  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    // Create the updated grid
    const newAnswerGrid = answerGrid.map((row, rIndex) =>
      row.map((cell, cIndex) => {
        if (rIndex === rowIndex && cIndex === cellIndex) {
          return cell < 2 ? cell + 1 : 0; // Cycle through 0 -> 1 -> 2 -> 0
        }
        return cell;
      })
    );

    // Update the state
    setAnswerGrid(newAnswerGrid);

    // Log the result
    if (checkWin(newAnswerGrid)) {
      console.log("WIN!!!");
    } else {
      console.log("Not yet correct, keep trying!");
    }
  };

  // Check if the new grid matches the correct grid
  const checkWin = (currentGrid: number[][]): boolean => {
    return grid.every((row, rowIndex) =>
      row.every((cell, cellIndex) => {
        if (cell === 1) {
          return currentGrid[rowIndex][cellIndex] === 1; // Check if grid has a 1 where answerGrid has a 1
        }
        return true; // Ignore other values
      })
    );
  };

  // Generate hints for rows and columns
  function generateHints(grid: number[][]) {
    function calculateHints(line: number[]) {
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

    const rowHints = grid.map((row) => calculateHints(row));

    const colHints = grid[0].map((_, colIndex) =>
      calculateHints(grid.map((row) => row[colIndex]))
    );

    return { rowHints, colHints };
  }

  return (
    <div>
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
          {/* Row Hints */}
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
            className="grid gap-1"
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
                  onClick={() => handleCellClick(rowIndex, cellIndex)}
                  className={`cursor-pointer w-full h-full border border-gray-700 ${
                    cell === 0
                      ? "bg-white"
                      : cell === 1
                      ? "bg-blue-700"
                      : "bg-red-700"
                  }`}
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
