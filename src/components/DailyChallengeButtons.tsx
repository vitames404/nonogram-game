import ArrowLeft from "pixelarticons/svg/arrow-left.svg";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const DailyChallengeButtons = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleNormalClick = () => {
    navigate("/"); // Redirect to /daily-challenge
  };

  return (
    <div className="font-vt323 text-4xl w-screen flex justify-center gap-4">
      {/* First Button */}
      <button
        onClick={handleNormalClick}
        className="mt-[5px] p-[10px] rounded-md text-black bg-gray-100 relative group"
        title="Normal mode" // Tooltip text
      >
        <img src={ArrowLeft} alt="Normal mode" className="max-w-[46px] max-h-[46px] h-[8vw]" />
        {/* Custom Tooltip (if you want more control over styling) */}
        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white  px-2 py-1 text-2xl rounded-md whitespace-nowrap">
          Back to normal mode
        </div>
      </button>
    </div>
  );
};

export default DailyChallengeButtons;