// src/App.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import EditNote from './pages/EditNote';
import Register from './pages/Register';
import SignIn from './pages/SignIn';
import { useNotes } from './context/NotesContext'; // Assuming NotesContext manages loggedInUser

const App = () => {
  const { loggedInUser } = useNotes(); // Get loggedInUser from context

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar appears on all pages */}
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          {/* Home page */}
          <Route path="/" element={<Home />} />
          
          {/* Edit note page - only accessible if the user is logged in */}
          <Route
            path="/edit/:noteId"
            element={loggedInUser ? <EditNote /> : <SignIn />}
          />
          
          {/* Register page - accessible without login */}
          <Route path="/register" element={<Register />} />
          
          {/* SignIn page - accessible without login */}
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </main>

      {/* Footer appears on all pages */}
      <Footer />
    </div>
  );
};

export default App;

