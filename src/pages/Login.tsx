import React, { useState } from "react";
import PopupLogin from "../components/PopupLogin";
import PopupRegister from "../components/PopupRegister";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState<number>(1); // 1: Login, 2: Register, 3: Guest
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // Handle successful login
  const handleLoginSuccess = () => {
    setRedirectTo("/"); // Redirect to the game page
  };

  // Handle successful registration
  const handleRegisterSuccess = () => {
    setRedirectTo("/teste"); // Redirect to the test page
  };

  const handleGuestLogin = () => {
    setRedirectTo("/teste"); // Redirect for guest login
  };

  // If redirectTo is set, render the Navigate component
  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  return (
    <>
      {state === 1 && (
        <PopupLogin
          onLoginSuccess={handleLoginSuccess}
          onRegister={() => setState(2)}
          onGuestLogin={handleGuestLogin}
        />
      )}
      {state === 2 && (
        <PopupRegister onRegisterSuccess={handleRegisterSuccess} />
      )}
    </>
  );
};

export default Login;
