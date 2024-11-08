import React, { createContext, useContext, useReducer, useEffect } from 'react';

const NotesContext = createContext();

// Initial state for the reducer
const initialState = {
  notes: [],
  categories: ['Work', 'Personal', 'Health', 'Study', 'Travel', 'Shopping'],
  loggedInUser: null
};

// Reducer function
const notesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.payload
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      };
    case 'SET_LOGGED_IN_USER':
      return {
        ...state,
        loggedInUser: action.payload
      };
    case 'UPDATE_NOTES':
      return {
        ...state,
        notes: action.payload
      };
    default:
      return state;
  }
};

export const NotesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
      dispatch({ type: 'SET_LOGGED_IN_USER', payload: user });
      const allNotes = JSON.parse(localStorage.getItem('notes')) || [];
      dispatch({ type: 'SET_NOTES', payload: allNotes.filter(note => note.userId === user.username) });
    }
  }, []);

  const updateNotesInLocalStorage = (updatedNotes) => {
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    dispatch({ type: 'UPDATE_NOTES', payload: updatedNotes });
  };

  return (
    <NotesContext.Provider value={{
      notes: state.notes,
      categories: state.categories,
      loggedInUser: state.loggedInUser,
      updateNotesInLocalStorage
    }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  return useContext(NotesContext);
};
