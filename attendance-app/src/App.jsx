import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showLowAttendance, setShowLowAttendance] = useState(false);
  const [sortByPercentage, setSortByPercentage] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const userData = await response.json();

      const studentList = [];

      for (let i = 0; i < userData.length; i++) {
        const user = userData[i];
        const randomAttendance = Math.floor(Math.random() * 71) + 30;

        const student = {
          id: user.id,
          name: user.name,
          attendance: randomAttendance,
        };

        studentList.push(student);
      }

      setStudents(studentList);
    }

    fetchStudents();
  }, []);

  let studentsToShow = students;

  if (filter === 'present') {
    studentsToShow = studentsToShow.filter(function (student) {
      return student.attendance >= 75;
    });
  }

  if (filter === 'absent') {
    studentsToShow = studentsToShow.filter(function (student) {
      return student.attendance < 75;
    });
  }

  if (showLowAttendance) {
    studentsToShow = studentsToShow.filter(function (student) {
      return student.attendance < 75;
    });
  }

  if (sortByPercentage) {
    studentsToShow = [...studentsToShow].sort(function (studentA, studentB) {
      return studentA.attendance - studentB.attendance;
    });
  }

  function handleStudentClick(studentId) {
    if (selectedStudentId === studentId) {
      setSelectedStudentId(null);
    } else {
      setSelectedStudentId(studentId);
    }
  }

  return (
    <div className="app">
      <h1>Attenduccino</h1>
      <p className="subtitle">Track student attendance</p>

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

      <div className="student-list">
        {studentsToShow.map(function (student) {
          let colorClass = '';
          if (student.attendance >= 75) {
            colorClass = 'green';
          } else {
            colorClass = 'red';
          }

          let selectedClass = '';
          if (selectedStudentId === student.id) {
            selectedClass = 'selected';
          }

          let badgeClass = '';
          let statusText = '';
          if (student.attendance >= 75) {
            badgeClass = 'badge-green';
            statusText = 'Present';
          } else {
            badgeClass = 'badge-red';
            statusText = 'Absent';
          }

          const rowClassName = `student-row ${colorClass} ${selectedClass}`;

          return (
            <div
              key={student.id}
              className={rowClassName}
              onClick={() => handleStudentClick(student.id)}
            >
              <span className="name">{student.name}</span>
              <span className="pct">{student.attendance}%</span>
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

export default App;
