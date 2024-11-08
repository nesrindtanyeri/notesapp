import React, { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

// Define action types
const actionTypes = {
  SET_USERNAME: 'SET_USERNAME',
  SET_PASSWORD: 'SET_PASSWORD',
};

// Reducer function to handle state updates
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USERNAME:
      return { ...state, username: action.payload };
    case actionTypes.SET_PASSWORD:
      return { ...state, password: action.payload };
    default:
      return state;
  }
};

const Register = () => {
  const initialState = {
    username: '',
    password: '',
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { username, password } = state;
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
          onChange={(e) => dispatch({ type: actionTypes.SET_USERNAME, payload: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full mb-4"
          value={password}
          onChange={(e) => dispatch({ type: actionTypes.SET_PASSWORD, payload: e.target.value })}
        />
        <button className="btn btn-primary w-full" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
