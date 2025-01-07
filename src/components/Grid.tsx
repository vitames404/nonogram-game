import React, { useState, useEffect } from "react";

interface GridProps {
  grid: number[][];
  rowHints: number[][];
  colHints: number[][];
  calculateHints: (grid: number[][]) => { rowHints: number[][]; colHints: number[][] };
  winCallBack: () => void;
}

const Grid: React.FC<GridProps> = ({ grid, rowHints, colHints, calculateHints, winCallBack }) => {
  const [answerGrid, setAnswerGrid] = useState<number[][]>([]);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

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

  // Handle cell click (marking the cell)
  const markCell = (rowIndex: number, cellIndex: number) => {
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
      winCallBack();
    }
  };

  // Check if the player's grid satisfies the hints
  const checkWin = (currentGrid: number[][]): boolean => {
    const { rowHints: calculatedRowHints, colHints: calculatedColHints } =
      calculateHints(currentGrid);

    // Compare calculated hints with original hints
    return (
      JSON.stringify(calculatedRowHints) === JSON.stringify(rowHints) &&
      JSON.stringify(calculatedColHints) === JSON.stringify(colHints)
    );
  };

  return (
    <div className="font-vt323 mr-[120px]">
      <div>
        {/* Column Hints */}
        <div className="grid py-3 grid-cols-5 ml-[110px] h-[120px]" style={{ userSelect:"none" }}>
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
          <div className="grid grid-rows-5 text-white mr-4 w-[100px]" style={{ userSelect:"none" }}>
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
            className={`grid gap-1 w-[50vw] h-[50vw] max-w-[400px] max-h-[400px]`}
            style={{
              gridTemplateColumns: `repeat(${grid.length}, 1fr)`,
              gridTemplateRows: `repeat(${grid.length}, 1fr)`,
            }}
            onMouseLeave={() => setIsMouseDown(false)} // Reset when mouse leaves the grid
          >
            {answerGrid.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <div
                  key={`${rowIndex}-${cellIndex}`}
                  onMouseDown={() => {
                    setIsMouseDown(true);
                    markCell(rowIndex, cellIndex);
                  }}
                  onMouseEnter={() => {
                    if (isMouseDown) {
                      markCell(rowIndex, cellIndex);
                    }
                  }}
                  onMouseUp={() => setIsMouseDown(false)} // Reset on mouse up
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
