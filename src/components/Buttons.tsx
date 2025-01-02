import React from "react";
import Repeat from "pixelarticons/svg/repeat.svg"

const Buttons = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="font-vt323 text-4xl w-screen flex justify-center">
      <button onClick={onClick} className=" p-[10px] rounded-md text-black bg-gray-100">
        <img src={Repeat} alt="Repeat" className="max-w-[46px] max-h-[46px] h-[8vw]"/>
      </button> 
    </div>
  );
};

export default Buttons;
