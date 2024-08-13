import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import Progress from './components/Progress';
import PerformanceChart from './components/PerformanceChart';
import CookieBanner from './components/CookieBanner';

function App() {
  const [tasks, setTasks] = useState([]);
  const [mockDate, setMockDate] = useState(null);

  window.deleteAllCookies = function() {
    const cookies = document.cookie.split(";");

    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });

    console.log("All cookies from this app have been deleted.");
  };

  window.appClock = function (useRealTime, fakeDate) {
    if (useRealTime) {
      setMockDate(null);
      console.log("Using real system time.");
    } else {
      setMockDate(fakeDate);
      console.log("Using fake date: " + fakeDate);
    }
  };

  window.deleteCookieDate = function(date) {
    Cookies.remove(date, { path: '/' });
    console.log(`Cookie for date ${date} has been deleted.`);
  };

  const getCurrentDate = () => {
    return mockDate || new Date().toISOString().split('T')[0];
  };

  const currentDate = getCurrentDate();

  useEffect(() => {
    console.log("se ha ejecutado useEffect");
    const savedTasks = Cookies.get(currentDate);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      loadTasksFromLastRegisteredDay();
    }
  }, [currentDate, setTasks]);

  const loadTasksFromLastRegisteredDay = () => {
    const allCookies = Cookies.get();
    const dates = Object.keys(allCookies)
      .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date))
      .sort((a, b) => new Date(b) - new Date(a));

    if (dates.length > 0) {
      const lastTasks = JSON.parse(Cookies.get(dates[0]));
      const newTasks = lastTasks.map(task => ({ ...task, completed: false }));
      setTasks(newTasks);
      saveTasksToCookie(newTasks);
    }
  };

  const saveTasksToCookie = (tasksToSave) => {
    Cookies.set(currentDate, JSON.stringify(tasksToSave), { expires: 365 });
  };

  // Función para ordenar las tareas de mayor a menor importancia
  const sortTasksByImportance = (tasksToSort) => {
    return tasksToSort.sort((a, b) => b.importance - a.importance);
  };

  const addTask = (text, importance) => {
    const newTask = { text, importance, completed: false };
    const updatedTasks = [...tasks, newTask];
    const sortedTasks = sortTasksByImportance(updatedTasks); // Ordenar las tareas
    setTasks(sortedTasks);
    saveTasksToCookie(sortedTasks); // Guardar las tareas ordenadas en las cookies
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
    const sortedTasks = sortTasksByImportance(updatedTasks); // Reordenar después de editar
    setTasks(sortedTasks);
    saveTasksToCookie(sortedTasks);
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
      <PerformanceChart />
      <CookieBanner />
    </div>
  );
}

export default App;
