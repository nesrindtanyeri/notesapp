// src/components/SignIn.jsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSignIn = (e) => {
    e.preventDefault();

    // Check if the user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
      setError('Invalid username or password');
      return;
    }

    // Save the logged-in user in localStorage or sessionStorage
    localStorage.setItem('loggedInUser', JSON.stringify(user));

    // Redirect to the Home page after successful sign-in
    history.push('/');
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
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
        <button type="submit">Sign In</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SignIn;
