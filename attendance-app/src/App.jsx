import { useState, useEffect } from 'react';
import './App.css';

/* ────────── localStorage helpers ────────── */
function loadClasses() {
  try { return JSON.parse(localStorage.getItem('capputrackino_classes') || '[]'); }
  catch { return []; }
}
function persist(data) {
  localStorage.setItem('capputrackino_classes', JSON.stringify(data));
}

/* ────────── Decorative SVG ────────── */
function FloralGraphic({ className }) {
  return (
    <svg className={className} viewBox="0 0 340 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* main stem */}
      <path d="M170 360 Q168 280 170 190" stroke="#c9aab0" strokeWidth="2" strokeLinecap="round"/>
      {/* left branch */}
      <path d="M170 280 Q140 265 120 240" stroke="#c9aab0" strokeWidth="1.5" strokeLinecap="round"/>
      {/* right branch */}
      <path d="M170 250 Q200 235 218 210" stroke="#c9aab0" strokeWidth="1.5" strokeLinecap="round"/>
      {/* leaves */}
      <ellipse cx="128" cy="248" rx="16" ry="10" fill="#b5c4b1" opacity="0.75" transform="rotate(-35 128 248)"/>
      <ellipse cx="215" cy="218" rx="16" ry="10" fill="#b5c4b1" opacity="0.75" transform="rotate(30 215 218)"/>
      <ellipse cx="155" cy="305" rx="13" ry="8" fill="#c3cfbf" opacity="0.6" transform="rotate(-20 155 305)"/>
      <ellipse cx="186" cy="295" rx="12" ry="7" fill="#c3cfbf" opacity="0.6" transform="rotate(15 186 295)"/>
      {/* flower petals (main) */}
      <ellipse cx="170" cy="155" rx="14" ry="22" fill="#e8b4b8" opacity="0.85"/>
      <ellipse cx="170" cy="155" rx="14" ry="22" fill="#e8b4b8" opacity="0.85" transform="rotate(45 170 178)"/>
      <ellipse cx="170" cy="155" rx="14" ry="22" fill="#e8b4b8" opacity="0.85" transform="rotate(90 170 178)"/>
      <ellipse cx="170" cy="155" rx="14" ry="22" fill="#e8b4b8" opacity="0.85" transform="rotate(135 170 178)"/>
      {/* flower center */}
      <circle cx="170" cy="178" r="14" fill="#f5e6e8"/>
      <circle cx="170" cy="178" r="9" fill="#d4a5b0"/>
      <circle cx="170" cy="178" r="5" fill="#c9768e"/>
      {/* small flower top-right */}
      <ellipse cx="248" cy="110" rx="8" ry="13" fill="#e8b4b8" opacity="0.65"/>
      <ellipse cx="248" cy="110" rx="8" ry="13" fill="#e8b4b8" opacity="0.65" transform="rotate(60 248 122)"/>
      <ellipse cx="248" cy="110" rx="8" ry="13" fill="#e8b4b8" opacity="0.65" transform="rotate(120 248 122)"/>
      <circle cx="248" cy="122" r="8" fill="#f5e6e8"/>
      <circle cx="248" cy="122" r="5" fill="#d4a5b0"/>
      {/* small flower left */}
      <ellipse cx="95" cy="170" rx="7" ry="11" fill="#e8c8c0" opacity="0.65"/>
      <ellipse cx="95" cy="170" rx="7" ry="11" fill="#e8c8c0" opacity="0.65" transform="rotate(60 95 180)"/>
      <ellipse cx="95" cy="170" rx="7" ry="11" fill="#e8c8c0" opacity="0.65" transform="rotate(120 95 180)"/>
      <circle cx="95" cy="180" r="7" fill="#f5e6e8"/>
      <circle cx="95" cy="180" r="4" fill="#d4b5b0"/>
      {/* scattered dots */}
      <circle cx="220" cy="330" r="4" fill="#e8b4b8" opacity="0.45"/>
      <circle cx="110" cy="340" r="3" fill="#d4a5b0" opacity="0.4"/>
      <circle cx="260" cy="280" r="3" fill="#b5c4b1" opacity="0.5"/>
      <circle cx="80" cy="300" r="5" fill="#e8b4b8" opacity="0.35"/>
      <circle cx="290" cy="200" r="3" fill="#e8c8c0" opacity="0.4"/>
    </svg>
  );
}

/* ────────── App ────────── */
function App() {
  const [classes, setClasses] = useState(loadClasses);
  const [activeId, setActiveId] = useState(null);
  const [classNameInput, setClassNameInput] = useState('');
  const [inputName, setInputName] = useState('');

  const activeClass = classes.find(c => c.id === activeId);

  // persist on every change
  useEffect(() => { persist(classes); }, [classes]);

  /* helpers to mutate classes immutably */
  function updateClass(id, fn) {
    setClasses(prev => prev.map(c => c.id === id ? fn(c) : c));
  }

  /* ── Setup / home ── */
  function handleSetupSubmit(e) {
    e.preventDefault();
    const name = classNameInput.trim();
    if (!name) return;
    const existing = classes.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      setActiveId(existing.id);
    } else {
      const nc = { id: Date.now().toString(), name, students: [], createdAt: new Date().toLocaleDateString('en-IN') };
      setClasses(prev => [...prev, nc]);
      setActiveId(nc.id);
    }
    setClassNameInput('');
  }

  function deleteClass(e, id) {
    e.stopPropagation();
    if (id === activeId) setActiveId(null);
    setClasses(prev => prev.filter(c => c.id !== id));
  }

  /* ── Students ── */
  function addStudent(e) {
    e.preventDefault();
    const name = inputName.trim();
    if (!name || !activeClass) return;
    if (activeClass.students.find(s => s.name.toLowerCase() === name.toLowerCase())) return;
    updateClass(activeId, c => ({ ...c, students: [...c.students, { name, status: null }] }));
    setInputName('');
  }

  function mark(studentName, status) {
    updateClass(activeId, c => ({
      ...c,
      students: c.students.map(s =>
        s.name === studentName ? { ...s, status: s.status === status ? null : status } : s
      )
    }));
  }

  function removeStudent(studentName) {
    updateClass(activeId, c => ({ ...c, students: c.students.filter(s => s.name !== studentName) }));
  }

  /* ── Export CSV (user implementation) ── */
  function exportToCSV(data, filename = 'attendance.csv') {
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers.map(field => `"${row[field]}"`).join(',')
      )
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
  }

  /* ── Open attendance sheet in new tab ── */

  /* ── Stats ── */
  const students = activeClass?.students || [];
  const present  = students.filter(s => s.status === 'present').length;
  const absent   = students.filter(s => s.status === 'absent').length;
  const exempted = students.filter(s => s.status === 'exempted').length;
  const unmarked = students.filter(s => !s.status).length;
  const total    = students.length;
  const pct      = total > 0 ? Math.round((present / total) * 100) : 0;

  /* ══════════ HOME / SETUP SCREEN ══════════ */
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

        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>
    );
  }

  /* ══════════ MAIN ATTENDANCE SCREEN ══════════ */
  return (
    <div className="app">
      <FloralGraphic className="app-graphic" />

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

        {total > 0 && (
          <div className="stats-bar">
            <div className="stat-pill stat-present"><span className="stat-num">{present}</span><span className="stat-lbl">present</span></div>
            <div className="stat-pill stat-absent"><span className="stat-num">{absent}</span><span className="stat-lbl">absent</span></div>
            <div className="stat-pill stat-exempted"><span className="stat-num">{exempted}</span><span className="stat-lbl">exempted</span></div>
            <div className="stat-pill stat-unmarked"><span className="stat-num">{unmarked}</span><span className="stat-lbl">unmarked</span></div>
            <div className="stat-pct">{pct}%</div>
          </div>
        )}
      </header>

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
        {students.length > 0 && (
          <div className="upload-row">
            <button className="export-btn" onClick={() => {
              const data = activeClass.students.map((s, i) => ({
                'S.No': i + 1,
                Name: s.name,
                Status: s.status || 'Unmarked'
              }));
              exportToCSV(data, `${activeClass.name.replace(/[^a-z0-9]/gi, '_')}_attendance.csv`);
            }}>Download CSV</button>
          </div>
        )}
      </div>

      <div className="student-list">
        {students.length === 0 && (
          <div className="empty-state">
            <p>No students yet.</p>
            <p>Add names one by one above.</p>
          </div>
        )}
        {students.map((s, i) => (
          <div key={s.name} className={`student-row ${s.status ? 'row-' + s.status : ''}`}>
            <div className="student-info">
              <span className="student-number">{String(i + 1).padStart(2, '0')}</span>
              <span className="student-name">{s.name}</span>
            </div>
            <div className="status-buttons">
              <button className={`status-btn btn-present ${s.status === 'present' ? 'active' : ''}`} onClick={() => mark(s.name, 'present')}>P</button>
              <button className={`status-btn btn-absent  ${s.status === 'absent'  ? 'active' : ''}`} onClick={() => mark(s.name, 'absent')}>A</button>
              <button className={`status-btn btn-exempted ${s.status === 'exempted' ? 'active' : ''}`} onClick={() => mark(s.name, 'exempted')}>E</button>
              <button className="remove-btn" onClick={() => removeStudent(s.name)}>×</button>
            </div>
          </div>
        ))}
      </div>

      <div className="blob blob-1" />
      <div className="blob blob-2" />
    </div>
  );
}

export default App;
