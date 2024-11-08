// src/pages/SignIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = () => {
    if (username && password) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(user => user.username === username && user.password === password);

      if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        navigate('/');
      } else {
        alert('Invalid credentials');
      }
    } else {
      alert('Please enter your username and password');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card shadow-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        <input
          type="text"
          placeholder="Username"
          className="input input-bordered w-full mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-full" onClick={handleSignIn}>
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignIn;
