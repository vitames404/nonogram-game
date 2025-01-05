import React, { useState } from "react";

interface PopupLoginProps {
  onLoginSuccess: (username: string) => void; // Callback for successful login
  onRegister: () => void; // Callback to switch to the register flow
  onGuestLogin: () => void; // Callback to switch to guest login
}

const PopupLogin: React.FC<PopupLoginProps> = ({ onLoginSuccess, onRegister, onGuestLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isUserExists, setIsUserExists] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");

  // Check if the username exists
  const checkUserExists = async () =>  {
    try {
      const response = await fetch('http://localhost:3000/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      setIsUserExists(data.exists); // Update state based on the response
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error('Error checking username:', err);
      setError('An error occurred. Please try again.');
    }
  };

  // Handle login submission
  const handleLoginSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(username); // Notify parent component of successful login
      } else {
        setError(data.message); // Display error message
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="text-white flex justify-center items-center w-screen h-screen bg-gray-900">
      <form>
        <div className="bg-gray-800 p-8 rounded-lg space-y-4">
          {/* Username Section */}
          <div className="flex flex-col space-y-2">
            <p className="text-[32px]">USERNAME</p>
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
          {/* Next/Join Button */}
          <button
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission
              if (isUserExists === true) {
                handleLoginSubmit(); // If user exists, handle login
              } else {
                checkUserExists(); // If initial state, check if user exists
              }
            }}
            type="button" // Use type="button" to prevent form submission
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4"
          >
            {isUserExists === true ? 'Login' : 'Next'}
          </button>

          {/* Register or Guest Login (if user does not exist) */}
          {isUserExists === false && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent form submission
                  onRegister(); 
                }}
                type="button"
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 mt-4"
              >
                Register
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent form submission
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
