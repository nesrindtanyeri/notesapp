import React, { useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import Select from 'react-select';

// Define initial state
const initialState = {
  title: '',
  content: '',
  selectedCategories: [],
  urgency: 'Low',
  image: null,
  notification: null,
  openModal: false,
  openDeleteModal: false,
  noteToDelete: null,
  searchTerm: '',
  selectedCategory: '',
  selectedDate: '',
  newCategory: '',
};

// Define actions
const actionTypes = {
  SET_TITLE: 'SET_TITLE',
  SET_CONTENT: 'SET_CONTENT',
  SET_SELECTED_CATEGORIES: 'SET_SELECTED_CATEGORIES',
  SET_URGENCY: 'SET_URGENCY',
  SET_IMAGE: 'SET_IMAGE',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  SET_OPEN_MODAL: 'SET_OPEN_MODAL',
  SET_OPEN_DELETE_MODAL: 'SET_OPEN_DELETE_MODAL',
  SET_NOTE_TO_DELETE: 'SET_NOTE_TO_DELETE',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_SELECTED_CATEGORY: 'SET_SELECTED_CATEGORY',
  SET_SELECTED_DATE: 'SET_SELECTED_DATE',
  SET_NEW_CATEGORY: 'SET_NEW_CATEGORY',
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_TITLE:
      return { ...state, title: action.payload };
    case actionTypes.SET_CONTENT:
      return { ...state, content: action.payload };
    case actionTypes.SET_SELECTED_CATEGORIES:
      return { ...state, selectedCategories: action.payload };
    case actionTypes.SET_URGENCY:
      return { ...state, urgency: action.payload };
    case actionTypes.SET_IMAGE:
      return { ...state, image: action.payload };
    case actionTypes.SET_NOTIFICATION:
      return { ...state, notification: action.payload };
    case actionTypes.SET_OPEN_MODAL:
      return { ...state, openModal: action.payload };
    case actionTypes.SET_OPEN_DELETE_MODAL:
      return { ...state, openDeleteModal: action.payload };
    case actionTypes.SET_NOTE_TO_DELETE:
      return { ...state, noteToDelete: action.payload };
    case actionTypes.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    case actionTypes.SET_SELECTED_CATEGORY:
      return { ...state, selectedCategory: action.payload };
    case actionTypes.SET_SELECTED_DATE:
      return { ...state, selectedDate: action.payload };
    case actionTypes.SET_NEW_CATEGORY:
      return { ...state, newCategory: action.payload };
    default:
      return state;
  }
};

const Home = () => {
  const { notes, setNotes, categories, setCategories, loggedInUser } = useNotes();
  const [state, dispatch] = useReducer(reducer, initialState);
  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    if (loggedInUser) {
      try {
        const userNotes = JSON.parse(localStorage.getItem('notes')) || [];
        const userNotesFiltered = userNotes.filter(note => note.userId === loggedInUser.username);
        setNotes(userNotesFiltered);
      } catch (error) {
        console.error("Error retrieving notes from localStorage", error);
        setNotes([]);
      }
    }
  }, [loggedInUser, setNotes]);

  const handleCreateNote = (e) => {
    e.preventDefault();
    if (state.title && state.content && state.selectedCategories.length > 0) {
      const newNote = {
        id: Date.now().toString(),
        userId: loggedInUser ? loggedInUser.username : "guest", // Use "guest" if loggedInUser is null
        title: state.title,
        content: state.content,
        categories: state.selectedCategories.map((category) => category.value),
        date: currentDate,
        urgency: state.urgency,
        image: state.image ? URL.createObjectURL(state.image) : null,
      };
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      dispatch({ type: actionTypes.SET_TITLE, payload: '' });
      dispatch({ type: actionTypes.SET_CONTENT, payload: '' });
      dispatch({ type: actionTypes.SET_SELECTED_CATEGORIES, payload: [] });
      dispatch({ type: actionTypes.SET_URGENCY, payload: 'Low' });
      dispatch({ type: actionTypes.SET_IMAGE, payload: null });
      dispatch({ type: actionTypes.SET_OPEN_MODAL, payload: false });
      dispatch({ type: actionTypes.SET_NOTIFICATION, payload: { type: 'success', message: 'Note successfully added!' } });
      setTimeout(() => dispatch({ type: actionTypes.SET_NOTIFICATION, payload: null }), 3000);
    }
  };

  const handleCategoryChange = (selectedOptions) => {
    dispatch({ type: actionTypes.SET_SELECTED_CATEGORIES, payload: selectedOptions || [] });
  };

  const categoryOptions = categories.map((cat) => ({
    label: cat,
    value: cat,
  }));

  const handleDeleteNote = () => {
    if (state.noteToDelete) {
      const updatedNotes = notes.filter((note) => note.id !== state.noteToDelete.id);
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      dispatch({ type: actionTypes.SET_OPEN_DELETE_MODAL, payload: false });
      dispatch({ type: actionTypes.SET_NOTIFICATION, payload: { type: 'success', message: 'Note successfully deleted!' } });
      setTimeout(() => dispatch({ type: actionTypes.SET_NOTIFICATION, payload: null }), 3000);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearchTerm =
      note.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(state.searchTerm.toLowerCase());

    const matchesCategory = state.selectedCategory ? note.categories.includes(state.selectedCategory) : true;

    const matchesDate =
      state.selectedDate === 'Today'
        ? note.date === currentDate
        : state.selectedDate === 'This Week'
        ? isThisWeek(note.date)
        : true;

    return matchesSearchTerm && matchesCategory && matchesDate;
  });

  const isThisWeek = (date) => {
    const noteDate = new Date(date);
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));
    return noteDate >= startOfWeek && noteDate <= endOfWeek;
  };

  const handleAddCategory = () => {
    const normalizedCategory = state.newCategory.trim().toLowerCase();
    if (normalizedCategory && !categories.some(cat => cat.toLowerCase() === normalizedCategory)) {
      setCategories([...categories, state.newCategory]);
      dispatch({ type: actionTypes.SET_NEW_CATEGORY, payload: '' });
      dispatch({ type: actionTypes.SET_NOTIFICATION, payload: { type: 'success', message: 'Category added successfully!' } });
      setTimeout(() => dispatch({ type: actionTypes.SET_NOTIFICATION, payload: null }), 3000);
    } else {
      dispatch({ type: actionTypes.SET_NOTIFICATION, payload: { type: 'error', message: 'Category already exists!' } });
      setTimeout(() => dispatch({ type: actionTypes.SET_NOTIFICATION, payload: null }), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Your Notes</h1>

        <div className="mb-4 flex space-x-4">
          <input
            type="text"
            placeholder="Search by title or content"
            value={state.searchTerm}
            onChange={(e) => dispatch({ type: actionTypes.SET_SEARCH_TERM, payload: e.target.value })}
            className="input input-bordered w-1/3"
          />
          <select
            value={state.selectedCategory}
            onChange={(e) => dispatch({ type: actionTypes.SET_SELECTED_CATEGORY, payload: e.target.value })}
            className="select select-bordered w-1/4"
          >
            <option value="">Filter by category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={state.selectedDate}
            onChange={(e) => dispatch({ type: actionTypes.SET_SELECTED_DATE, payload: e.target.value })}
            className="select select-bordered w-1/4"
          >
            <option value="">Filter by date</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
          </select>
        </div>

        <div className="mb-4">
          <button onClick={() => dispatch({ type: actionTypes.SET_OPEN_MODAL, payload: true })} className="btn btn-primary">
            Create a Note
          </button>
        </div>

        {state.notification && (
          <div className={`alert ${state.notification.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
            {state.notification.message}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.length ? (
            filteredNotes.map((note) => (
              <div key={note.id} className="card shadow-lg p-4 bg-base-100">
                <h2 className="card-title">{note.title}</h2>
                <p>{note.content.substring(0, 100)}...</p>
                <p className="text-sm text-gray-500">Categories: {note.categories.join(', ')}</p>
                <p className="text-sm text-gray-500">Urgency: {note.urgency}</p>
                <p className="text-sm text-gray-500">Date: {note.date}</p>
                {note.image && <img src={note.image} alt="Note" className="w-full h-auto mt-2" />}
                <Link to={`/edit/${note.id}`}>
                  <button className="btn btn-sm btn-info mt-2">Edit Note</button>
                </Link>
                <button
                  onClick={() => {
                    dispatch({ type: actionTypes.SET_NOTE_TO_DELETE, payload: note });
                    dispatch({ type: actionTypes.SET_OPEN_DELETE_MODAL, payload: true });
                  }}
                  className="btn btn-sm btn-error mt-2 ml-2"
                >
                  Delete Note
                </button>
              </div>
            ))
          ) : (
            <p>No notes available. Create one to get started!</p>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {state.openModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-xl font-bold mb-4">Create a New Note</h2>
            <form onSubmit={handleCreateNote}>
              <div className="mb-4">
                <label className="block">Title</label>
                <input
                  type="text"
                  value={state.title}
                  onChange={(e) => dispatch({ type: actionTypes.SET_TITLE, payload: e.target.value })}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block">Content</label>
                <textarea
                  value={state.content}
                  onChange={(e) => dispatch({ type: actionTypes.SET_CONTENT, payload: e.target.value })}
                  className="textarea textarea-bordered w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block">Select Categories</label>
                <Select
                  options={categoryOptions}
                  isMulti
                  onChange={handleCategoryChange}
                  value={state.selectedCategories}
                />
                {/* New Category Input */}
                <div className="mt-2">
                  <label className="block">Add New Category</label>
                  <input
                    type="text"
                    value={state.newCategory}
                    onChange={(e) => dispatch({ type: actionTypes.SET_NEW_CATEGORY, payload: e.target.value })}
                    className="input input-bordered w-full"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="btn btn-sm btn-info mt-2"
                  >
                    Add Category
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block">Urgency</label>
                <select
                  value={state.urgency}
                  onChange={(e) => dispatch({ type: actionTypes.SET_URGENCY, payload: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block">Image</label>
                <input
                  type="file"
                  onChange={(e) => dispatch({ type: actionTypes.SET_IMAGE, payload: e.target.files[0] })}
                  className="file-input file-input-bordered w-full"
                />
              </div>
              <div className="flex justify-between">
                <button type="submit" className="btn btn-primary">Create</button>
                <button type="button" onClick={() => dispatch({ type: actionTypes.SET_OPEN_MODAL, payload: false })} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

