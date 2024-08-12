import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import Progress from './components/Progress';

function App() {

// Definir la función globalmente en el window object
window.deleteAllCookies = function() {
  const cookies = document.cookie.split(";");

  cookies.forEach((cookie) => {
    const cookieName = cookie.split("=")[0].trim();
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  });

  console.log("All cookies from this app have been deleted.");
};

  
  const [tasks, setTasks] = useState([]);
  const currentDate = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

  useEffect(() => {
    // Cargar las tareas del día actual desde las cookies
    const savedTasks = Cookies.get(currentDate);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [currentDate]);

  const saveTasksToCookie = (tasksToSave) => {
    Cookies.set(currentDate, JSON.stringify(tasksToSave), { expires: 365 });
  };

  const addTask = (text, importance) => {
    const newTask = { text, importance, completed: false };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasksToCookie(updatedTasks);
  };

  const toggleTaskCompleted = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    saveTasksToCookie(updatedTasks);
  };

  const editTask = (index, updatedTask) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = updatedTask;
    setTasks(updatedTasks);
    saveTasksToCookie(updatedTasks);
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
