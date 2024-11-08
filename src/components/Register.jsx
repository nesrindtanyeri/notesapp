import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // React Router v6 uses `useNavigate` instead of `useHistory`

  const handleRegister = (e) => {
    e.preventDefault();

    // Check if username and password are valid
    if (username.length < 3 || password.length < 6) {
      setError('Username must be at least 3 characters long and password at least 6 characters.');
      return;
    }

    // Check if the username already exists in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some((user) => user.username === username);

    if (userExists) {
      setError('Username already exists');
      return;
    }

    // Save new user to localStorage
    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Redirect to sign-in page after successful registration
    navigate('/sign-in');
  };

  // Reset error message when user starts typing in the fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (error) setError(''); // Clear error when user starts typing
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
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
