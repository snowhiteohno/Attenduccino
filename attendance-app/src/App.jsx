// We import two hooks from React:
// useState  — lets us store and update data (like a variable that re-renders the page)
// useEffect — lets us run code once when the component first appears on screen
import { useState, useEffect } from 'react';

// Import the CSS file that styles this component
import './App.css';

function App() {

  // ---- STATE VARIABLES ----
  // Each useState gives us [currentValue, functionToUpdateIt]

  // "students" holds the list of student objects we get from the API
  const [students, setStudents] = useState([]);

  // "filter" tracks which filter button is active: 'all', 'present', or 'absent'
  const [filter, setFilter] = useState('all');

  // "selectedStudentId" stores the id of the student the user clicked on (or null if none)
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // "showLowAttendance" is true/false — when true, we only show students below 75%
  const [showLowAttendance, setShowLowAttendance] = useState(false);

  // "sortByPercentage" is true/false — when true, we sort students by attendance %
  const [sortByPercentage, setSortByPercentage] = useState(false);


  // ---- FETCH STUDENTS FROM THE INTERNET ----
  // useEffect runs the function inside it when the component first loads.
  // The empty array [] means "run this only once, not on every re-render".
  useEffect(() => {
    // We define an async function so we can use "await" inside it
    async function fetchStudents() {
      // Step 1: Send a request to the API and wait for the response
      const response = await fetch('https://jsonplaceholder.typicode.com/users');

      // Step 2: Convert the response into a JavaScript array of objects
      const userData = await response.json();

      // Step 3: Build our own student list from the API data
      // We take each user's id and name, and add a random attendance percentage
      const studentList = [];

      for (let i = 0; i < userData.length; i++) {
        const user = userData[i];

        // Generate a random attendance between 30 and 100
        const randomAttendance = Math.floor(Math.random() * 71) + 30;

        // Create a student object and push it into our list
        const student = {
          id: user.id,
          name: user.name,
          attendance: randomAttendance,
        };

        studentList.push(student);
      }

      // Step 4: Save the student list into state so React displays it
      setStudents(studentList);
    }

    // Call the async function we just defined
    fetchStudents();
  }, []);


  // ---- FILTER AND SORT THE STUDENTS ----

  // Start with the full list of students
  let studentsToShow = students;

  // If the "present" filter is active, keep only students with attendance >= 75%
  if (filter === 'present') {
    studentsToShow = studentsToShow.filter(function (student) {
      return student.attendance >= 75;
    });
  }

  // If the "absent" filter is active, keep only students with attendance < 75%
  if (filter === 'absent') {
    studentsToShow = studentsToShow.filter(function (student) {
      return student.attendance < 75;
    });
  }

  // If the "show low attendance" checkbox is on, keep only students below 75%
  if (showLowAttendance) {
    studentsToShow = studentsToShow.filter(function (student) {
      return student.attendance < 75;
    });
  }

  // If the "sort by percentage" checkbox is on, sort from lowest to highest
  if (sortByPercentage) {
    // We use [...studentsToShow] to make a copy first (never sort the original array)
    studentsToShow = [...studentsToShow].sort(function (studentA, studentB) {
      return studentA.attendance - studentB.attendance;
    });
  }


  // ---- CLICK HANDLER ----
  // When a student row is clicked, select it. If already selected, deselect it.
  function handleStudentClick(studentId) {
    if (selectedStudentId === studentId) {
      // Already selected — deselect by setting to null
      setSelectedStudentId(null);
    } else {
      // Not selected — select this student
      setSelectedStudentId(studentId);
    }
  }


  // ---- WHAT WE RENDER ON SCREEN ----
  return (
    <div className="app">

      {/* App title and subtitle */}
      <h1>Attenduccino</h1>
      <p className="subtitle">Track student attendance</p>

      {/* ---- FILTER BUTTONS ---- */}
      <div className="filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>

        <button
          className={filter === 'present' ? 'active' : ''}
          onClick={() => setFilter('present')}
        >
          Present
        </button>

        <button
          className={filter === 'absent' ? 'active' : ''}
          onClick={() => setFilter('absent')}
        >
          Absent
        </button>
      </div>

      {/* ---- TOGGLE CHECKBOXES ---- */}
      <div className="toggles">
        <label>
          <input
            type="checkbox"
            checked={showLowAttendance}
            onChange={() => setShowLowAttendance(!showLowAttendance)}
          />
          Show &lt;75% only
        </label>

        <label>
          <input
            type="checkbox"
            checked={sortByPercentage}
            onChange={() => setSortByPercentage(!sortByPercentage)}
          />
          Sort by %
        </label>
      </div>

      {/* ---- STUDENT LIST ---- */}
      <div className="student-list">
        {studentsToShow.map(function (student) {

          // Decide the color of the row: green if >= 75%, red otherwise
          let colorClass = '';
          if (student.attendance >= 75) {
            colorClass = 'green';
          } else {
            colorClass = 'red';
          }

          // Decide if this row should be highlighted as "selected"
          let selectedClass = '';
          if (selectedStudentId === student.id) {
            selectedClass = 'selected';
          }

          // Decide the badge style and text
          let badgeClass = '';
          let statusText = '';
          if (student.attendance >= 75) {
            badgeClass = 'badge-green';
            statusText = 'Present';
          } else {
            badgeClass = 'badge-red';
            statusText = 'Absent';
          }

          // Build the full class string for the row
          const rowClassName = `student-row ${colorClass} ${selectedClass}`;

          return (
            <div
              key={student.id}
              className={rowClassName}
              onClick={() => handleStudentClick(student.id)}
            >
              {/* Student name */}
              <span className="name">{student.name}</span>

              {/* Attendance percentage */}
              <span className="pct">{student.attendance}%</span>

              {/* Status badge (Present or Absent) */}
              <span className={`badge ${badgeClass}`}>
                {statusText}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}

// Export the App component so other files can use it
export default App;
