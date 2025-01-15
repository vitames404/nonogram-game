import { useState, useEffect } from "react";
import PopupLogin from "../components/PopupLogin";
import PopupRegister from "../components/PopupRegister";
import { Navigate } from "react-router-dom";
import Title from "../components/Title";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useAuth } from "../components/auth/AuthContext"; // Import useAuth

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const Login = () => {
  const [state, setState] = useState<number>(1); // 1: Login, 2: Register, 3: Guest
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const { isAuthenticated, loading } = useAuth(); // Add checkAuthentication

  // Redirect to the game page if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      setRedirectTo("/");
    }
  }, [isAuthenticated, loading]);

  // Handle successful login
  const handleLoginSuccess = () => {
    window.location.href = "/";
  };

  // Handle successful registration
  const handleRegisterSuccess = () => {
    window.location.href = "/";
  };

  // Handle guest login
  const handleGuestLogin = async () => {
    try {
      const username = `guest_${Math.random().toString(36).substring(7)}`; // Generate a random username for the guest

      const response = await fetch(`${API_BASE_URL}/login-guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
        credentials: "include",
      });

      if (response.ok) {
        setRedirectTo("/");
        window.location.href = "/"; // Redirect to the game page
      } else {
        console.error("Failed to login as guest");
      }
    } catch (err) {
      console.error("Error during guest login:", err);
    }
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
            onGuestLogin={handleGuestLogin}
          />
        )}
        {state === 2 && (
          <PopupRegister onRegisterSuccess={handleRegisterSuccess} />
        )}
      </div>
    </>
  );
};

export default Login;