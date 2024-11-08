import React, { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

// Define action types
const actionTypes = {
  SET_USERNAME: 'SET_USERNAME',
  SET_PASSWORD: 'SET_PASSWORD',
  SET_ERROR: 'SET_ERROR',
  RESET_ERROR: 'RESET_ERROR',
};

// Reducer function to handle state updates
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USERNAME:
      return { ...state, username: action.payload };
    case actionTypes.SET_PASSWORD:
      return { ...state, password: action.payload };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    case actionTypes.RESET_ERROR:
      return { ...state, error: '' };
    default:
      return state;
  }
};

const SignIn = () => {
  const initialState = {
    username: '',
    password: '',
    error: '',
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { username, password, error } = state;
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();

    // Check if the user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (!user) {
      dispatch({ type: actionTypes.SET_ERROR, payload: 'Invalid username or password' });
      return;
    }

    // Save the logged-in user in localStorage or sessionStorage
    localStorage.setItem('loggedInUser', JSON.stringify(user));

    // Redirect to the Home page after successful sign-in
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (error) dispatch({ type: actionTypes.RESET_ERROR }); // Reset error when user starts typing
    if (name === 'username') {
      dispatch({ type: actionTypes.SET_USERNAME, payload: value });
    } else if (name === 'password') {
      dispatch({ type: actionTypes.SET_PASSWORD, payload: value });
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
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
        <button type="submit">Sign In</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SignIn;

