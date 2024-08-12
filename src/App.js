import { useState } from 'react';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import Progress from './components/Progress';

function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (text, importance) => {
    const newTask = { text, importance, completed: false };
    setTasks([...tasks, newTask]);
  };

  const toggleTaskCompleted = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const editTask = (index, updatedTask) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = updatedTask;
    setTasks(updatedTasks);
  };

  const totalImportance = tasks.reduce((total, task) => total + task.importance, 0);
  const completedImportance = tasks.filter(task => task.completed)
                                   .reduce((total, task) => total + task.importance, 0);
  const completionPercentage = totalImportance > 0 ? (completedImportance / totalImportance) * 100 : 0;

  return (
    <div>
      <h1>Todo Machine</h1>
      <AddTaskForm addTask={addTask} />
      <TaskList tasks={tasks} toggleTaskCompleted={toggleTaskCompleted} editTask={editTask} />
      <Progress percentage={completionPercentage} />
    </div>
  );
}

export default App;
