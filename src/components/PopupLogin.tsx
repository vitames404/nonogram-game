import React, { useState } from "react";

interface PopupLoginProps {
  onLoginSuccess: (username: string) => void; // Callback for successful login
  onRegister: () => void; // Callback to switch to the register flow
  onGuestLogin: () => void;  
}

const PopupLogin: React.FC<PopupLoginProps> = ({ onLoginSuccess, onRegister, onGuestLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isUserExists, setIsUserExists] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");

  // Check if the username exists
  const checkUserExists = async () => {
    try {
      const response = await fetch("http://localhost:3000/check-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      setIsUserExists(data.exists);
      setError("");

      if (!data.exists) {
        localStorage.setItem("possibleName", username);
      }
    } catch (err) {
      console.error("Error checking username:", err);
      setError("An error occurred. Please try again.");
    }
  };

  // Handle the login logic
  const handleLoginSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (response.ok) {
        onLoginSuccess(username);
        alert("Login successful!");
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An error occurred. Please try again.");
    }
  };

  // Handle form submit and prevent the default form refresh
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    if (isUserExists === true) {
      handleLoginSubmit(); // Login user
    } else {
      checkUserExists(); // Check if user exists
    }
  };

  return (
    <div className="text-white flex justify-center items-center w-screen h-screen text-2xl">
      <form onSubmit={handleFormSubmit}>
        <div className="bg-gray-800 p-8 rounded-lg space-y-4">
          {/* Username Section */}
          <div className="flex flex-col space-y-2">
            <p className="text-[42px] pb-3">USERNAME</p>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 rounded bg-gray-700 text-white"
            />

            {/* Password Input (if user exists) */}
            {isUserExists === true && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 rounded bg-gray-700 text-white mt-4"
              />
            )}
          </div>

          {/* Login/Next Button */}
          {isUserExists !== false && (
            <button
              type="submit" // Using type="submit" here to trigger form submission
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4"
            >
              Login
            </button>
          )}

          {/* Register and Guest Login Buttons (if user does not exist) */}
          {isUserExists === false && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onRegister();
                }}
                type="button"
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 mt-4"
              >
                Register
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onGuestLogin();
                }}
                type="button"
                className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 mt-4"
              >
                Login as Guest
              </button>
            </>
          )}

          {/* Error Message */}
          {error && <p className="text-red-700">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default PopupLogin;
