import { useState, useEffect } from "react";
import "./App.css";

/* ────────── localStorage ────────── */
function loadClasses() {
  const data = localStorage.getItem("classes");
  return data ? JSON.parse(data) : [];
}

function App() {
  const [classes, setClasses] = useState(loadClasses());
  const [activeId, setActiveId] = useState(null);
  const [classNameInput, setClassNameInput] = useState("");
  const [inputName, setInputName] = useState("");

  const activeClass = classes.find(c => c.id === activeId);

  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes));
  }, [classes]);

  /* ───── Create / Open Class ───── */
  function handleSetupSubmit(e) {
    e.preventDefault();

    const name = classNameInput.trim();
    if (!name) return;

    const existing = classes.find(
      c => c.name.toLowerCase() === name.toLowerCase()
    );

    if (existing) {
      setActiveId(existing.id);
    } else {
      const newClass = {
        id: Date.now(),
        name: name,
        students: []
      };
      setClasses([...classes, newClass]);
      setActiveId(newClass.id);
    }

    setClassNameInput("");
  }

  /* ───── Add Student ───── */
  function addStudent(e) {
    e.preventDefault();

    if (!inputName.trim() || !activeClass) return;

    const updatedClasses = classes.map(c => {
      if (c.id === activeId) {
        return {
          ...c,
          students: [...c.students, { name: inputName, status: null }]
        };
      }
      return c;
    });

    setClasses(updatedClasses);
    setInputName("");
  }

  /* ───── Mark Attendance ───── */
  function mark(name, status) {
    const updatedClasses = classes.map(c => {
      if (c.id === activeId) {
        return {
          ...c,
          students: c.students.map(s =>
            s.name === name
              ? { ...s, status: s.status === status ? null : status }
              : s
          )
        };
      }
      return c;
    });

    setClasses(updatedClasses);
  }

  /* ───── Remove Student ───── */
  function removeStudent(name) {
    const updatedClasses = classes.map(c => {
      if (c.id === activeId) {
        return {
          ...c,
          students: c.students.filter(s => s.name !== name)
        };
      }
      return c;
    });

    setClasses(updatedClasses);
  }

  /* ───── Stats ───── */
  const students = activeClass ? activeClass.students : [];

  const present = students.filter(s => s.status === "present").length;
  const absent = students.filter(s => s.status === "absent").length;
  const total = students.length;

  /* ───── UI ───── */
  if (!activeId) {
    return (
      <div>
        <h1>CappuTrackino</h1>

        <form onSubmit={handleSetupSubmit}>
          <input
            placeholder="Enter class name"
            value={classNameInput}
            onChange={e => setClassNameInput(e.target.value)}
          />
          <button>Open</button>
        </form>

        {classes.map(c => (
          <div key={c.id} onClick={() => setActiveId(c.id)}>
            {c.name}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => setActiveId(null)}>← Back</button>

      <h2>{activeClass.name}</h2>

      <p>
        Present: {present} | Absent: {absent} | Total: {total}
      </p>

      <form onSubmit={addStudent}>
        <input
          placeholder="Student name"
          value={inputName}
          onChange={e => setInputName(e.target.value)}
        />
        <button>Add</button>
      </form>

      {students.map(s => (
        <div key={s.name}>
          {s.name}

          <button onClick={() => mark(s.name, "present")}>P</button>
          <button onClick={() => mark(s.name, "absent")}>A</button>
          <button onClick={() => removeStudent(s.name)}>X</button>
        </div>
      ))}
    </div>
  );
}

export default App;
