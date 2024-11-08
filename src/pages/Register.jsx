// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    if (username && password) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userExists = users.find(user => user.username === username);
      if (userExists) {
        alert('User already exists!');
      } else {
        const newUser = { username, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful');
        navigate('/signin');
      }
    } else {
      alert('Please enter a username and password');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card shadow-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
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
        <button className="btn btn-primary w-full" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
