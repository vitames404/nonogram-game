import React, { useState, useEffect } from "react";

interface GridProps {
  grid: number[][];
  rowHints: number[][];
  colHints: number[][];
}

const Grid: React.FC<GridProps> = ({ grid, rowHints, colHints }) => {
  const [answerGrid, setAnswerGrid] = useState<number[][]>([]);

  useEffect(() => {
    // Initialize the answer grid as an empty grid whenever the main grid changes
    setAnswerGrid(createEmptyGrid(grid.length));
  }, [grid]);

  // Create an empty grid with 0 values
  const createEmptyGrid = (size: number): number[][] => {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }, () => 0)
    );
  };

  // Handle cell click
  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    const newAnswerGrid = answerGrid.map((row, rIndex) =>
      row.map((cell, cIndex) => {
        if (rIndex === rowIndex && cIndex === cellIndex) {
          return (cell + 1) % 3; // Cycle through 0 -> 1 -> 2 -> 0
        }
        return cell;
      })
    );

    setAnswerGrid(newAnswerGrid);

    if (checkWin(newAnswerGrid)) {
      alert("You win!");
    } else {
      console.log("Not correct yet. Keep trying!");
    }
  };

  // Check if the current answer grid matches the main grid
  const checkWin = (currentGrid: number[][]): boolean => {
    return grid.every((row, rowIndex) =>
      row.every((cell, cellIndex) => {
        if (cell === 1) {
          return currentGrid[rowIndex][cellIndex] === 1; // Match filled cells
        }
        return true; // Ignore empty cells
      })
    );
  };

  return (
    <div className="font-vt323">
      <div>
        {/* Column Hints */}
        <div className="grid py-3 grid-cols-5 ml-[70px] h-[120px]">
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
