import { useState, useEffect } from 'react';
import './App.css';
import FloralGraphic from './FloralGraphic';

/* ────────── Helper Functions ────────── */
// These handle saving and loading data to the browser's local storage
// so that the attendance data isn't lost when you refresh the page.

function loadClasses() {
  const savedData = localStorage.getItem('capputrackino_classes');
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch (error) {
      console.error("Error reading saved data:", error);
      return [];
    }
  }
  return []; // Return an empty array if nothing was saved
}

function persist(data) {
  // Convert our JavaScript array/objects into a string to save it
  const stringData = JSON.stringify(data);
  localStorage.setItem('capputrackino_classes', stringData);
}

/* ────────── Main Application Component ────────── */
function App() {
  // 1. We define our application state (variables that change over time):
  // 'classes' holds our list of classes/sections
  const [classes, setClasses] = useState(loadClasses);
  
  // 'activeId' is the ID of the class currently opened. If null, we are on the home screen.
  const [activeId, setActiveId] = useState(null);
  
  // Text input for creating/searching a class
  const [classNameInput, setClassNameInput] = useState('');
  
  // Text input for adding a new student
  const [inputName, setInputName] = useState('');

  // 2. A handy variable: Find the full details of the currently opened class
  const activeClass = classes.find(c => c.id === activeId);

  // 3. Whenever 'classes' state changes, we save it to local storage automatically
  useEffect(() => { 
    persist(classes); 
  }, [classes]);

  /* ────────── Functions to Handle Actions ────────── */

  // Runs when user creates a new class or opens an existing one from home screen
  function handleSetupSubmit(e) {
    e.preventDefault(); // Stop page from refreshing
    const name = classNameInput.trim();
    if (name === '') return;

    // See if a class with this name already exists
    const existingClass = classes.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existingClass) {
      // Just open it
      setActiveId(existingClass.id);
    } else {
      // Create a brand new class object
      const newClass = { 
        id: Date.now().toString(), // Unique ID using current time
        name: name, 
        students: [], 
        createdAt: new Date().toLocaleDateString('en-IN') 
      };
      // Add it to our list of classes and open it
      setClasses([...classes, newClass]);
      setActiveId(newClass.id);
    }
    // Clear the input box
    setClassNameInput('');
  }

  // Deletes a class entirely
  function deleteClass(e, idToRemove) {
    e.stopPropagation(); // Stop clicking the card underneath the delete button
    
    // If we are deleting the class we currently have open, go back to home screen
    if (idToRemove === activeId) {
      setActiveId(null);
    }
    
    // Keep every class EXCEPT the one we are removing
    const filteredClasses = classes.filter(c => c.id !== idToRemove);
    setClasses(filteredClasses);
  }

  // Adds a student to the currently active class
  function addStudent(e) {
    e.preventDefault();
    const name = inputName.trim();
    if (name === '' || !activeClass) return;
    
    // Prevent adding duplicates
    const existingStudent = activeClass.students.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (existingStudent) return;

    // Create a new student object
    const newStudent = { name: name, status: null };
    
    // Make a copy of the active class, adding the new student to its array
    const updatedClass = { 
      ...activeClass, 
      students: [...activeClass.students, newStudent] 
    };

    // Update our main list of classes by replacing only the active class with our updated copy
    const updatedClasses = classes.map(c => c.id === activeId ? updatedClass : c);
    setClasses(updatedClasses);
    
    // Clear the input field
    setInputName('');
  }

  // Marks a student as present (P), absent (A), or exempted (E)
  function mark(studentName, newStatus) {
    // Go through current students and update the target student's status
    const updatedStudents = activeClass.students.map(student => {
      if (student.name === studentName) {
         // If clicking the same status button twice, unmark it (set to null)
         const finalStatus = student.status === newStatus ? null : newStatus;
         // Return a modified copy of the student
         return { ...student, status: finalStatus };
      }
      return student; // Other students remain unchanged
    });

    const updatedClass = { ...activeClass, students: updatedStudents };
    setClasses(classes.map(c => c.id === activeId ? updatedClass : c));
  }

  // Removes a student from the class
  function removeStudent(studentNameToRemove) {
    const keptStudents = activeClass.students.filter(student => student.name !== studentNameToRemove);
    const updatedClass = { ...activeClass, students: keptStudents };
    setClasses(classes.map(c => c.id === activeId ? updatedClass : c));
  }

  // Downloads attendance data as a CSV file (opens in Excel/Sheets)
  function exportToCSV(data, filename = 'attendance.csv') {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]); // e.g., ["S.No", "Name", "Status"]
    
    // Format rows for CSV string
    const csvRows = [
      headers.join(','), // The top row: "S.No,Name,Status"
      ...data.map(row =>
        headers.map(field => `"${row[field]}"`).join(',') // The data rows
      )
    ];
    
    const csvString = csvRows.join('\n');
    // Tell browser to create a downloadable file
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }

  /* ────────── Calculations for the Stats Bar ────────── */
  const students = activeClass ? activeClass.students : [];
  const present  = students.filter(s => s.status === 'present').length;
  const absent   = students.filter(s => s.status === 'absent').length;
  const exempted = students.filter(s => s.status === 'exempted').length;
  const unmarked = students.filter(s => s.status === null).length;
  const total    = students.length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0; // Avoid dividing by 0

  /* ══════════ SCREEN 1: HOME / SETUP ══════════ */
  // If no class is selected, show the setup screen
  if (!activeId) {
    return (
      <div className="setup-screen">
        <FloralGraphic className="setup-graphic" />

        <div className="setup-card">
          <p className="setup-eyebrow">attendance tracker</p>
          <h1 className="setup-title">CappuTrackino</h1>
          <p className="setup-sub">Enter a class name to open or create it.</p>

          <form onSubmit={handleSetupSubmit} className="setup-form">
            <input
              className="setup-input"
              type="text"
              placeholder="e.g. BCA Section A"
              value={classNameInput}
              onChange={e => setClassNameInput(e.target.value)}
            />
            <button className="setup-btn" type="submit">Open</button>
          </form>

          {/* Show previously saved classes if any exist */}
          {classes.length > 0 && (
            <div className="saved-section">
              <p className="saved-label">saved classes</p>
              <div className="saved-list">
                {classes.map(c => {
                  const t = c.students.length;
                  const p = c.students.filter(s => s.status === 'present').length;
                  const pct2 = t > 0 ? Math.round((p / t) * 100) : 0;
                  
                  return (
                    <div key={c.id} className="saved-card" onClick={() => setActiveId(c.id)}>
                      <div className="saved-card-body">
                        <span className="saved-card-name">{c.name}</span>
                        <span className="saved-card-meta">
                          {t} student{t !== 1 ? 's' : ''}
                          {t > 0 ? ` · ${pct2}% present` : ''}
                        </span>
                        {c.createdAt && <span className="saved-card-date">{c.createdAt}</span>}
                      </div>
                      <button className="saved-delete" onClick={e => deleteClass(e, c.id)} title="Delete class">×</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Decorative background shapes */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>
    );
  }

  /* ══════════ SCREEN 2: MAIN ATTENDANCE VIEW ══════════ */
  return (
    <div className="app">
      <FloralGraphic className="app-graphic" />

      {/* Top Header */}
      <header className="header">
        <div className="header-top">
          <div className="header-left">
            <button className="back-btn" onClick={() => setActiveId(null)}>← Home</button>
            <div>
              <span className="header-eyebrow">attendance tracker</span>
              <h1 className="header-title">CappuTrackino</h1>
            </div>
          </div>
          <div className="header-class-name">{activeClass?.name}</div>
        </div>

        {/* Stats Bar */}
        {total > 0 && (
          <div className="stats-bar">
            <div className="stat-pill stat-present"><span className="stat-num">{present}</span><span className="stat-lbl">present</span></div>
            <div className="stat-pill stat-absent"><span className="stat-num">{absent}</span><span className="stat-lbl">absent</span></div>
            <div className="stat-pill stat-exempted"><span className="stat-num">{exempted}</span><span className="stat-lbl">exempted</span></div>
            <div className="stat-pill stat-unmarked"><span className="stat-num">{unmarked}</span><span className="stat-lbl">unmarked</span></div>
            <div className="stat-pct">{percentage}%</div>
          </div>
        )}
      </header>

      {/* Input area for adding students */}
      <div className="add-panel">
        <form className="add-form" onSubmit={addStudent}>
          <input
            className="add-input"
            type="text"
            placeholder="Add student name..."
            value={inputName}
            onChange={e => setInputName(e.target.value)}
          />
          <button className="add-btn" type="submit">Add</button>
        </form>
        
        {/* CSV Download Button */}
        {students.length > 0 && (
          <div className="upload-row">
            <button className="export-btn" onClick={() => {
              // Prepare the data cleanly for Excel
              const data = activeClass.students.map((s, i) => ({
                'S.No': i + 1,
                Name: s.name,
                Status: s.status || 'Unmarked' // Fallback if no status selected
              }));
              exportToCSV(data, `${activeClass.name.replace(/[^a-z0-9]/gi, '_')}_attendance.csv`);
            }}>Download CSV</button>
          </div>
        )}
      </div>

      {/* List of students and buttons */}
      <div className="student-list">
        {students.length === 0 && (
          <div className="empty-state">
            <p>No students yet.</p>
            <p>Add names one by one above.</p>
          </div>
        )}
        
        {students.map((student, index) => (
          <div key={student.name} className={`student-row ${student.status ? 'row-' + student.status : ''}`}>
            {/* Left side: Student Info */}
            <div className="student-info">
              <span className="student-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="student-name">{student.name}</span>
            </div>
            
            {/* Right side: Marking Buttons */}
            <div className="status-buttons">
              <button 
                className={`status-btn btn-present ${student.status === 'present' ? 'active' : ''}`} 
                onClick={() => mark(student.name, 'present')}
              >P</button>
              
              <button 
                className={`status-btn btn-absent  ${student.status === 'absent'  ? 'active' : ''}`} 
                onClick={() => mark(student.name, 'absent')}
              >A</button>
              
              <button 
                className={`status-btn btn-exempted ${student.status === 'exempted' ? 'active' : ''}`} 
                onClick={() => mark(student.name, 'exempted')}
              >E</button>
              
              <button className="remove-btn" onClick={() => removeStudent(student.name)}>×</button>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative background shapes */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
    </div>
  );
}

export default App;
