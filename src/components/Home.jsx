import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import Select from 'react-select';

const Home = () => {
  const { notes, setNotes, categories, setCategories, loggedInUser } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [urgency, setUrgency] = useState('Low');
  const [image, setImage] = useState(null);
  const [notification, setNotification] = useState(null);
  const [openModal, setOpenModal] = useState(false); // To control modal visibility
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [newCategory, setNewCategory] = useState('');

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
    if (title && content && selectedCategories.length > 0) {
      const newNote = {
        id: Date.now().toString(),
        userId: loggedInUser ? loggedInUser.username : "guest", // Use "guest" if loggedInUser is null
        title,
        content,
        categories: selectedCategories.map((category) => category.value),
        date: currentDate,
        urgency,
        image: image ? URL.createObjectURL(image) : null,
      };
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      setTitle('');
      setContent('');
      setSelectedCategories([]);
      setUrgency('Low');
      setImage(null);
      setOpenModal(false);
      setNotification({ type: 'success', message: 'Note successfully added!' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

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
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
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
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));
    return noteDate >= startOfWeek && noteDate <= endOfWeek;
  };

  const handleAddCategory = () => {
    const normalizedCategory = newCategory.trim().toLowerCase();
    if (normalizedCategory && !categories.some(cat => cat.toLowerCase() === normalizedCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
      setNotification({ type: 'success', message: 'Category added successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification({ type: 'error', message: 'Category already exists!' });
      setTimeout(() => setNotification(null), 3000);
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

        <div className="mb-4">
          <button onClick={() => setOpenModal(true)} className="btn btn-primary">
            Create a Note
          </button>
        </div>

        {notification && (
          <div className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
            {notification.message}
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
                    setNoteToDelete(note);
                    setOpenDeleteModal(true);
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
      {openModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-xl font-bold mb-4">Create a New Note</h2>
            <form onSubmit={handleCreateNote}>
              <div className="mb-4">
                <label className="block">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
                  value={selectedCategories}
                />
              </div>
              <div className="mb-4">
                <label className="block">Urgency</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
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
                  onChange={(e) => setImage(e.target.files[0])}
                  className="file-input file-input-bordered w-full"
                />
              </div>
              <div className="flex justify-between">
                <button type="submit" className="btn btn-primary">Create</button>
                <button type="button" onClick={() => setOpenModal(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
