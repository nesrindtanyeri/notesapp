import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNotes } from '../context/NotesContext';
import Select from 'react-select'; // Import react-select

const Home = () => {
  const { notes, setNotes, categories, setCategories, loggedInUser } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]); // Store multiple categories
  const [urgency, setUrgency] = useState('Low');
  const [image, setImage] = useState(null);
  const [notification, setNotification] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [newCategory, setNewCategory] = useState(''); // New category state

  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    if (loggedInUser) {
      const userNotes = JSON.parse(localStorage.getItem('notes')) || [];
      const userNotesFiltered = userNotes.filter(note => note.userId === loggedInUser.username);
      setNotes(userNotesFiltered);
    }
  }, [loggedInUser, setNotes]);

  const handleCreateNote = (e) => {
    e.preventDefault();
    if (title && content && selectedCategories.length > 0) {
      const newNote = {
        id: Date.now().toString(),
        userId: loggedInUser.username,
        title,
        content,
        categories: selectedCategories.map((category) => category.value), // Multiple categories
        date: currentDate,
        urgency,
        image: image ? URL.createObjectURL(image) : null,
      };
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes)); // Save to localStorage
      setTitle('');
      setContent('');
      setSelectedCategories([]);
      setUrgency('Low');
      setImage(null);
      setOpenModal(false);
      setNotification({ type: 'success', message: 'Note successfully added!' });
      setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
    }
  };

  // Handle category change using react-select
  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions || []);
  };

  const categoryOptions = categories.map((cat) => ({
    label: cat,
    value: cat,
  }));

  const handleDeleteNote = () => {
    if (noteToDelete) {
      const updatedNotes = notes.filter((note) => note.id !== noteToDelete.id);
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes)); // Save updated notes to localStorage
      setOpenDeleteModal(false);
      setNotification({ type: 'success', message: 'Note successfully deleted!' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearchTerm =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory ? note.categories.includes(selectedCategory) : true;

    const matchesDate =
      selectedDate === 'Today'
        ? note.date === currentDate
        : selectedDate === 'This Week'
        ? isThisWeek(note.date)
        : true;

    return matchesSearchTerm && matchesCategory && matchesDate;
  });

  const isThisWeek = (date) => {
    const noteDate = new Date(date);
    const today = new Date();
    const firstDayOfWeek = today.getDate() - today.getDay();
    const lastDayOfWeek = firstDayOfWeek + 6;
    const startOfWeek = new Date(today.setDate(firstDayOfWeek));
    const endOfWeek = new Date(today.setDate(lastDayOfWeek));
    return noteDate >= startOfWeek && noteDate <= endOfWeek;
  };

  // Function to add new category
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]); // Add new category to categories state
      setNewCategory('');
      setNotification({ type: 'success', message: 'Category added successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } else if (categories.includes(newCategory)) {
      setNotification({ type: 'error', message: 'Category already exists!' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar openCreateModal={() => setOpenModal(true)} />
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Your Notes</h1>

        {/* Filters */}
        <div className="mb-4 flex space-x-4">
          <input
            type="text"
            placeholder="Search by title or content"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-1/3"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="select select-bordered w-1/4"
          >
            <option value="">Filter by date</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
          </select>
        </div>

        {/* Show notification if it exists */}
        {notification && (
          <div className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
            {notification.message}
          </div>
        )}

        {/* Display Notes */}
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
                {/* Add Delete Button */}
                <button
                  onClick={() => {
                    setNoteToDelete(note); // Store note to delete
                    setOpenDeleteModal(true); // Open confirmation modal
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
      <Footer />

      {/* Modal for Create New Note */}
      {openModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Create New Note</h2>
            <form onSubmit={handleCreateNote} className="space-y-4">
              <div className="form-control">
                <label className="label">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="textarea textarea-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">Categories</label>
                <Select
                  isMulti
                  value={selectedCategories}
                  onChange={handleCategoryChange}
                  options={categoryOptions}
                  className="select-bordered"
                />
                <div className="flex items-center mt-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="input input-bordered mr-2 w-full"
                    placeholder="Create new category"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="btn btn-sm btn-primary"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="form-control">
                <label className="label">Urgency</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)} // Ensure this is controlled
                  className="select select-bordered w-full"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="form-control">
                <button type="submit" className="btn btn-primary w-full">Create Note</button>
              </div>
            </form>
            <button onClick={() => setOpenModal(false)} className="btn btn-ghost w-full mt-4">Close</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {openDeleteModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this note?</h2>
            <div className="flex justify-between">
              <button onClick={() => setOpenDeleteModal(false)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleDeleteNote} className="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

