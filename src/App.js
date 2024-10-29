import React, { useState, useEffect } from 'react';
import './App.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [noteDate, setNoteDate] = useState(null);
  const [noteTime, setNoteTime] = useState(''); // Time state
  const [noteAMPM, setNoteAMPM] = useState('AM'); // AM/PM state
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load registered users from local storage
  useEffect(() => {
    const savedUsers = localStorage.getItem('registeredUsers');
    setRegisteredUsers(savedUsers ? JSON.parse(savedUsers) : []);
  }, []);

  // Load notes when username is set
  useEffect(() => {
    if (username) {
      const savedNotes = localStorage.getItem(`${username}_notes`);
      setNotes(savedNotes ? JSON.parse(savedNotes) : []);
    }
  }, [username]);

  // Save notes when they change
  useEffect(() => {
    if (username && isLoggedIn) {
      localStorage.setItem(`${username}_notes`, JSON.stringify(notes));
    }
  }, [notes, username, isLoggedIn]);

  const handleRegister = (e) => {
    e.preventDefault();
    const userExists = registeredUsers.find((user) => user.username === username);
    if (userExists) {
      alert('Username already exists! Redirecting to login.');
      setIsRegistered(false); // Set to false to show the login form
      return; // Prevent registration if the user already exists
    }
    const newUser = { username, password };
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    alert('Registration successful! You can now log in.');
    setIsRegistered(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = registeredUsers.find((user) => user.username === username && user.password === password);
    if (user) {
      setIsLoggedIn(true);
      alert(`Welcome back, ${username}!`);
    } else {
      alert('Invalid username or password');
    }
  };

  const handleAddNote = () => {
    if (noteInput) {
      let formattedTimestamp = '';

      if (noteDate) {
        const date = new Date(noteDate);
        if (noteTime) {
          const [hours, minutes] = noteTime.split(':');
          let hourValue = parseInt(hours);
          if (noteAMPM === 'PM' && hourValue < 12) {
            hourValue += 12; // Convert to 24-hour format
          } else if (noteAMPM === 'AM' && hourValue === 12) {
            hourValue = 0; // Convert 12 AM to 0 hours
          }
          date.setHours(hourValue, minutes);
          formattedTimestamp = date.toLocaleString();
        } else {
          formattedTimestamp = date.toLocaleString(); // Default to date only
        }
      } else {
        formattedTimestamp = new Date().toLocaleString(); // Default to current date and time
      }

      const newNote = { text: noteInput, timestamp: formattedTimestamp };
      setNotes((prevNotes) => [...prevNotes, newNote]);
      setNoteInput('');
      setNoteDate(null);
      setNoteTime('');
      setNoteAMPM('AM'); // Reset AM/PM to default
    }
  };

  const handleDeleteNote = (index) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
  };

  return (
    <div className="App">
      <h1>Daily Notebook</h1>
      {!isLoggedIn ? (
        // Registration or Login Form
        <>
          {!isRegistered ? (
            <form onSubmit={handleRegister}>
              <h2>Register</h2>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter a username to register"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a password"
                required
              />
              <button type="submit">Register</button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <h2>Log In</h2>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button type="submit">Log In</button>
            </form>
          )}
          <button onClick={() => setIsRegistered((prev) => !prev)}>
            {isRegistered ? "Go to Register" : "Already registered? Log in"}
          </button>
        </>
      ) : (
        // Notes Section
        <>
          <h2>Welcome, {username}!</h2>
          <div className="input-container">
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Add a new note"
            />
            <DatePicker
              selected={noteDate}
              onChange={(date) => setNoteDate(date)}
              placeholderText="Select date"
              dateFormat="Pp"
              isClearable
            />
            <h4>click to add time</h4>
            <h1>⬇️</h1>
            <input
              type="time"
              value={noteTime}
              onChange={(e) => setNoteTime(e.target.value)}
              required
            />

            <button type="button" onClick={handleAddNote}>Add Note</button>
          </div>
          <ul>
            {notes.map((note, index) => (
              <li key={index}>
                <p>{note.text}</p>
                <small>{note.timestamp}</small>
                <button onClick={() => handleDeleteNote(index)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
