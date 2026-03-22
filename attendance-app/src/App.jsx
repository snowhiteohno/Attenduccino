import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [showLow, setShowLow] = useState(false);
  const [sortOn, setSortOn] = useState(false);
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        const list = data.map(user => ({
          id: user.id,
          name: user.name,
          attendance: Math.floor(Math.random() * 71) + 30
        }));
        setStudents(list);
      });
  }, []);

  let filtered = students;

  if (filter === 'present') filtered = filtered.filter(s => s.attendance >= 75);
  if (filter === 'absent') filtered = filtered.filter(s => s.attendance < 75);
  if (showLow) filtered = filtered.filter(s => s.attendance < 75);
  if (sortOn) filtered = [...filtered].sort((a, b) => a.attendance - b.attendance);

  return (
    <div className="app">
      <h1>Attenduccino</h1>
      <p className="subtitle">Track student attendance</p>

      {/* Filter Buttons */}
      <div className="filters">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'present' ? 'active' : ''} onClick={() => setFilter('present')}>Present</button>
        <button className={filter === 'absent' ? 'active' : ''} onClick={() => setFilter('absent')}>Absent</button>
      </div>

      {/* Toggles */}
      <div className="toggles">
        <label>
          <input type="checkbox" checked={showLow} onChange={() => setShowLow(!showLow)} />
          Show &lt;75% only
        </label>
        <label>
          <input type="checkbox" checked={sortOn} onChange={() => setSortOn(!sortOn)} />
          Sort by %
        </label>
      </div>

      {/* Student List */}
      <div className="student-list">
        {filtered.map(s => (
          <div
            key={s.id}
            className={`student-row ${s.attendance >= 75 ? 'green' : 'red'} ${selectedId === s.id ? 'selected' : ''}`}
            onClick={() => setSelectedId(selectedId === s.id ? null : s.id)}
          >
            <span className="name">{s.name}</span>
            <span className="pct">{s.attendance}%</span>
            <span className={`badge ${s.attendance >= 75 ? 'badge-green' : 'badge-red'}`}>
              {s.attendance >= 75 ? 'Present' : 'Absent'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
