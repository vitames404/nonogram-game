import React from "react";
import Repeat from "pixelarticons/svg/repeat.svg"

const Buttons = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="font-vt323 text-4xl ml-[46px]">
      <button onClick={onClick} className=" p-[10px] rounded-md text-black bg-gray-100">
        <img src={Repeat} alt="Repeat" className="w-[46px] h-[46px]"/>
      </button> 
    </div>
  );
};

export default Buttons;
