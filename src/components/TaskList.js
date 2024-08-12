import TaskItem from './TaskItem';

function TaskList({ tasks, toggleTaskCompleted, editTask }) {
  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <TaskItem
          key={index}
          index={index}
          task={task}
          toggleTaskCompleted={toggleTaskCompleted}
          editTask={editTask}
        />
      ))}
    </div>
  );
}

export default TaskList;
