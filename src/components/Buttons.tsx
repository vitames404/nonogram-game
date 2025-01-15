import Repeat from "pixelarticons/svg/repeat.svg";
import CalendarCheck from "pixelarticons/svg/calendar-check.svg";
import QuestionMark from "pixelarticons/svg/warning-box.svg"; // Add this import for the new icon
import { useNavigate } from "react-router-dom";

interface ButtonsProps {
  onClick: () => void; // Function to handle the repeat button click
  onHowToPlayClick: () => void; // Function to handle the "How to Play" button click
}

const Buttons = ({ onClick, onHowToPlayClick }: ButtonsProps) => {
  const navigate = useNavigate();

  const handleDailyChallengeClick = () => {
    navigate("/daily-challenge");
  };

  return (
    <div className="font-vt323 text-4xl w-screen flex justify-center gap-4">
      {/* Repeat Button */}
      <button onClick={onClick} className="p-[10px] rounded-md text-black bg-gray-100">
        <img src={Repeat} alt="Repeat" className="max-w-[46px] max-h-[46px] h-[8vw]" />
      </button>

      {/* Daily Challenge Button */}
      <button
        onClick={handleDailyChallengeClick}
        className="p-[10px] rounded-md text-black bg-gray-100 relative group"
        title="Daily Challenge"
      >
        <img src={CalendarCheck} alt="Daily Challenge" className="max-w-[46px] max-h-[46px] h-[8vw]" />
        {/* Optional: Custom Tooltip */}
        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white px-2 py-1 text-2xl rounded-md whitespace-nowrap">
          Daily Challenge
        </div>
      </button>

      {/* How to Play Button */}
      <button
        onClick={onHowToPlayClick}
        className="p-[10px] rounded-md text-black bg-gray-100 relative group"
        title="How to Play"
      >
        <img src={QuestionMark} alt="How to Play" className="max-w-[46px] max-h-[46px] h-[8vw]" />
        {/* Optional: Custom Tooltip */}
        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white px-2 py-1 text-2xl rounded-md whitespace-nowrap">
          How to Play
        </div>
      </button>
    </div>
  );
};

export default Buttons;