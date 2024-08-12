import { useState } from 'react';

function AddTaskForm({ addTask }) {
  const [text, setText] = useState('');
  const [importance, setImportance] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTask(text, importance);
      setText('');
      setImportance(1);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter task"
        required
      />
      <input
        type="number"
        value={importance}
        onChange={(e) => setImportance(Number(e.target.value))}
        min="1"
        placeholder="Importance (1-10)"
        required
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default AddTaskForm;
