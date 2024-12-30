import React, { useEffect, useState } from "react";

interface TimerProps {
  resetTimer: boolean;
  onResetComplete: () => void;
}

const Timer: React.FC<TimerProps> = ({ resetTimer, onResetComplete }) => {
  // State to store current time
  const [time, setTime] = useState(0);

  useEffect(() => {
    // Set the interval and store its ID
    const intervalId = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 10);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (resetTimer) {
      setTime(0); // Reset the timer to 0
      onResetComplete(); // Notify parent that reset is complete
    }
  }, [resetTimer, onResetComplete]);

  const hours = Math.floor(time / 360000);
  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;

  return (
    <div className="text-white font-vt323 text-5xl">
      <p>
        {hours}:{minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}:
        {milliseconds.toString().padStart(2, "0")}
      </p>
    </div>
  );
};

export default Timer;
