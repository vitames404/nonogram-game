import React, { useState } from "react";
import PopupLogin from "../components/PopupLogin.tsx";
import PopupRegister from "../components/PopupRegister.tsx";

const Login = () => {
  const [state, setState] = useState<number>(1); // 1: Login, 2: Register, 3: Guest

  // Handle successful login
  const handleLoginSuccess = (username: string) => {
    alert(`Welcome back, ${username}!`);
    // Redirect or update the app state as needed
  };

  // Handle successful registration
  const handleRegisterSuccess = () => {
    alert('Registration successful!');
    setState(1); // Switch back to the login popup
  };

  return (
    <>
      {state === 1 && (
        <PopupLogin
          onLoginSuccess={handleLoginSuccess}
          onRegister={() => setState(2)}
          onGuestLogin={() => setState(3)}
        />
      )}
      {state === 2 && (
        <PopupRegister onRegisterSuccess={handleRegisterSuccess} />
      )}
    </>
  );
};

export default Login;