import React, { useState } from "react";
import PopupLogin from "../components/PopupLogin";
import PopupRegister from "../components/PopupRegister";
import { Navigate } from "react-router-dom";
import Title from "../components/Title";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

const Login = () => {
  const [state, setState] = useState<number>(1); // 1: Login, 2: Register, 3: Guest
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // Handle successful login
  const handleLoginSuccess = () => {
    setRedirectTo("/"); // Redirect to the game page
  };

  // Handle successful registration
  const handleRegisterSuccess = () => {
    setRedirectTo("/"); 
  };

  const handleGuestLogin = () => {
    setRedirectTo("/"); 
  };

  // If redirectTo is set, render the Navigate component
  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  return (
    <>
    {/* Canvas for Stars */}
    <div className="fixed inset-0 z-0 pointer-events-none bg-gray-900">
      <Canvas>
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      </Canvas>
    </div>
    <div className="font-vt323 relative z-10">
        <Title />
        {state === 1 && (
          <PopupLogin
            onLoginSuccess={handleLoginSuccess}
            onRegister={() => setState(2)}
            onGuestLogin={handleGuestLogin} />
        )}
        {state === 2 && (
          <PopupRegister onRegisterSuccess={handleRegisterSuccess} />
        )}
      </div></>
  );
};

export default Login;