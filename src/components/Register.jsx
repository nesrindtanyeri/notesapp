// src/components/Register.jsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleRegister = (e) => {
    e.preventDefault();

    // Check if the username already exists in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.username === username);

    if (userExists) {
      setError('Username already exists');
      return;
    }

    // Save new user to localStorage
    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Redirect to sign-in page after successful registration
    history.push('/sign-in');
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
