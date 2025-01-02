import React from "react";


const PopupLogin = () => {
  return(
      <div className="text-white flex justify-center items-center w-screen h-screen bg-gray-900">
        <div className="bg-gray-800">
          <p className="text-[32px]">
            USERNAME
          </p> 
          <input/>
          <p className="text-[32px]">
            PASSWORD
          </p>
          <input/>
        </div>
      </div>
  );
}

export default PopupLogin;
