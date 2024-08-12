function TaskItem({ task, toggleTaskCompleted, editTask, index }) {
    const handleToggle = () => {
      toggleTaskCompleted(index);
    };
  
    const handleTextChange = (e) => {
      editTask(index, { ...task, text: e.target.value });
    };
  
    const handleImportanceChange = (e) => {
      editTask(index, { ...task, importance: Number(e.target.value) });
    };
  
    return (
      <div className="task-item">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
        />
        <input
          type="text"
          value={task.text}
          onChange={handleTextChange}
        />
        <input
          type="number"
          value={task.importance}
          onChange={handleImportanceChange}
          min="1"
        />
      </div>
    );
  }
  
  export default TaskItem;
  