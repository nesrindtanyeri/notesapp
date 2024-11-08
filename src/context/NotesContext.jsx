// src/context/NotesContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const NotesContext = createContext();

export const NotesContextProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([
    'Work', 'Personal', 'Health', 'Study', 'Travel', 'Shopping'
  ]);

  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
      setLoggedInUser(user);
      const allNotes = JSON.parse(localStorage.getItem('notes')) || [];
      setNotes(allNotes.filter(note => note.userId === user.username)); // Filter notes for logged-in user
    }
  }, []);

  const updateNotesInLocalStorage = (updatedNotes) => {
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  return (
    <NotesContext.Provider value={{ notes, setNotes, categories, setCategories, loggedInUser, updateNotesInLocalStorage }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  return useContext(NotesContext);
};
