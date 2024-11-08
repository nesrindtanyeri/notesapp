// src/pages/EditNote.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';

const EditNote = () => {
  const { noteId } = useParams();
  const { notes, updateNote } = useNotes();
  const navigate = useNavigate();
  
  const note = notes.find(n => n.id === noteId);
  const [title, setTitle] = useState(note ? note.title : '');
  const [content, setContent] = useState(note ? note.content : '');

  useEffect(() => {
    if (!note) navigate('/');
  }, [note, navigate]);

  const handleSave = () => {
    if (note) {
      updateNote(noteId, { title, content });
      navigate('/');
    }
  };

  // Function to create ICS file for calendar
  const createICSFile = (title, startTime, endTime) => {
    const icsContent = `
      BEGIN:VCALENDAR
      VERSION:2.0
      BEGIN:VEVENT
      SUMMARY:${title}
      DTSTART:${startTime}
      DTEND:${endTime}
      END:VEVENT
      END:VCALENDAR
    `;
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.ics`;
    link.click();
  };

  return note ? (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">Edit Note</h2>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Content</span>
        </label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className="textarea textarea-bordered w-full"
          rows="5"
        ></textarea>
      </div>
      <button onClick={handleSave} className="btn btn-primary">
        Save Changes
      </button>

      {/* Add to Calendar Button */}
      <button
        onClick={() => createICSFile(note.title, '20241107T090000', '20241107T100000')} // Example times
        className="btn btn-sm btn-success mt-2"
      >
        Add to Calendar
      </button>
    </div>
  ) : (
    <p>Note not found</p>
  );
};

export default EditNote;

