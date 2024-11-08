import React, { useReducer, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';

// Define action types
const actionTypes = {
  SET_TITLE: 'SET_TITLE',
  SET_CONTENT: 'SET_CONTENT',
  RESET_FIELDS: 'RESET_FIELDS',
  SET_DATE: 'SET_DATE',
  SET_START_TIME: 'SET_START_TIME',
  SET_END_TIME: 'SET_END_TIME',
};

// Reducer function to handle state updates
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_TITLE:
      return { ...state, title: action.payload };
    case actionTypes.SET_CONTENT:
      return { ...state, content: action.payload };
    case actionTypes.SET_DATE:
      return { ...state, date: action.payload };
    case actionTypes.SET_START_TIME:
      return { ...state, startTime: action.payload };
    case actionTypes.SET_END_TIME:
      return { ...state, endTime: action.payload };
    case actionTypes.RESET_FIELDS:
      return { title: '', content: '', date: '', startTime: '', endTime: '' };
    default:
      return state;
  }
};

const EditNote = () => {
  const { noteId } = useParams();
  const { notes, updateNote } = useNotes();
  const navigate = useNavigate();

  const note = notes.find(n => n.id === noteId);
  const initialState = {
    title: note ? note.title : '',
    content: note ? note.content : '',
    date: note ? note.date : '',
    startTime: note ? note.startTime : '',
    endTime: note ? note.endTime : '',
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { title, content, date, startTime, endTime } = state;

  useEffect(() => {
    if (!note) navigate('/');
    if (note) {
      dispatch({ type: actionTypes.SET_TITLE, payload: note.title });
      dispatch({ type: actionTypes.SET_CONTENT, payload: note.content });
      dispatch({ type: actionTypes.SET_DATE, payload: note.date });
      dispatch({ type: actionTypes.SET_START_TIME, payload: note.startTime });
      dispatch({ type: actionTypes.SET_END_TIME, payload: note.endTime });
    }
  }, [note, navigate]);

  const handleSave = () => {
    if (note) {
      updateNote(noteId, { title, content, date, startTime, endTime });
      navigate('/');
    }
  };

  // Function to create ICS file for calendar
  const createICSFile = (title, date, startTime, endTime) => {
    const icsContent = `
      BEGIN:VCALENDAR
      VERSION:2.0
      BEGIN:VEVENT
      SUMMARY:${title}
      DTSTART:${date}T${startTime}
      DTEND:${date}T${endTime}
      DESCRIPTION:${content}
      LOCATION:Online
      END:VEVENT
      END:VCALENDAR
    `;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.ics`;
    link.click();
  };

  // Check if all fields are set to enable Add to Calendar button
  const isFormValid = title && content && date && startTime && endTime;

  return note ? (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">Edit Note</h2>
      
      {/* Title Input */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => dispatch({ type: actionTypes.SET_TITLE, payload: e.target.value })}
          className="input input-bordered w-full"
        />
      </div>

      {/* Content Input */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Content</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => dispatch({ type: actionTypes.SET_CONTENT, payload: e.target.value })}
          className="textarea textarea-bordered w-full"
          rows="5"
        ></textarea>
      </div>

      {/* Date and Time Inputs */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Event Date</span>
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => dispatch({ type: actionTypes.SET_DATE, payload: e.target.value })}
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Start Time</span>
        </label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => dispatch({ type: actionTypes.SET_START_TIME, payload: e.target.value })}
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">End Time</span>
        </label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => dispatch({ type: actionTypes.SET_END_TIME, payload: e.target.value })}
          className="input input-bordered w-full"
        />
      </div>

      <button onClick={handleSave} className="btn btn-primary mb-2">
        Save Changes
      </button>

      {/* Add to Calendar Button */}
      <button
        onClick={() => createICSFile(title, date, startTime, endTime)}
        className={`btn btn-sm btn-success ${!isFormValid ? 'btn-disabled' : 'mt-2'}`}
        disabled={!isFormValid}
      >
        Add to Calendar
      </button>
    </div>
  ) : (
    <p>Note not found</p>
  );
};

export default EditNote;
