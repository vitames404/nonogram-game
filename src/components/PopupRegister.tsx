import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface PopupRegisterProps {
  onRegisterSuccess: () => void; // Callback for successful registration
}

const PopupRegister: React.FC<PopupRegisterProps> = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Populate username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("possibleName");
    if (storedUsername) {
      setUsername(storedUsername); // Set the username input value
    }
  }, []); 

  // Handle registration submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onRegisterSuccess(); // Notify parent component of successful registration
      } else {
        setError(data.message); // Display error message
      }
    } catch (err) {
      console.error('Error registering user:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="text-white flex justify-center items-center w-screen h-screen text-2xl">
      <form onSubmit={handleRegisterSubmit}>
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
              required
            />
          </div>

          {/* Email Section */}
          <div className="flex flex-col space-y-2">
            <p className="text-[32px]">EMAIL</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

          {/* Password Section */}
          <div className="flex flex-col space-y-2">
            <p className="text-[32px]">PASSWORD</p>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4"
          >
            Register
          </button>

          {/* Error Message */}
          {error && <p className="text-red-700">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default PopupRegister;