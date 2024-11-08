import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'; // No need for useNavigate or useEffect now
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import EditNote from './pages/EditNote';
import Register from './pages/Register';
import SignIn from './pages/SignIn';
import { useNotes } from './context/NotesContext';

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

          {/* Edit note page - allows access even if the user is not logged in */}
          <Route
            path="/edit/:noteId"
            element={loggedInUser ? <EditNote /> : <Navigate to="/signin" />}
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
