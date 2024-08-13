import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import Progress from './components/Progress';
import PerformanceChart from './components/PerformanceChart';
import CookieBanner from './components/CookieBanner';

// Función para obtener la fecha actual o simulada
const getCurrentDate = (mockDate) => {
  return mockDate || new Date().toISOString().split('T')[0];
};

function App() {
  const [mockDate, setMockDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(getCurrentDate(mockDate)); // Estado inicial con la fecha actual
  const [tasks, setTasks] = useState([]);

  // Función global para eliminar todas las cookies
  window.deleteAllCookies = function() {
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    console.log("All cookies from this app have been deleted.");
  };

  // Función global para simular el reloj de la aplicación
  window.appClock = function (useRealTime, fakeDate) {
    if (useRealTime) {
      setMockDate(null);
      console.log("Using real system time.");
    } else {
      setMockDate(fakeDate);
      console.log("Using fake date: " + fakeDate);
    }
  };

  // Función global para eliminar la cookie de una fecha específica
  window.deleteCookieDate = function(date) {
    Cookies.remove(date, { path: '/' });
    console.log(`Cookie for date ${date} has been deleted.`);
  };

  // Función para reiniciar la aplicación al día de hoy
  window.resetAppToToday = function() {
    // Borra la cookie del día actual
    Cookies.remove(currentDate, { path: '/' });

    // Carga la lista de tareas del último día registrado
    loadTasksFromLastRegisteredDay();

    console.log(`Reset done: Tasks for ${currentDate} have been cleared and replaced by tasks from the last available day.`);
  };

  // useEffect que verifica si ha cambiado el día
  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = getCurrentDate(mockDate);
      if (newDate !== currentDate) {
        setCurrentDate(newDate); // Actualiza la fecha actual
        loadTasksFromLastRegisteredDay(); // Carga las tareas del día más reciente, sin completadas
      }
    }, 60000); // Verifica cada 60 segundos
    return () => clearInterval(interval);
  }, [currentDate, mockDate]);

  useEffect(() => {
    console.log("se ha ejecutado useEffect");
    const savedTasks = Cookies.get(currentDate);

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      loadTasksFromLastRegisteredDay();
    }
  }, [currentDate]);

  // Función para cargar las tareas del último día registrado
  const loadTasksFromLastRegisteredDay = () => {
    const allCookies = Cookies.get();
    const dates = Object.keys(allCookies)
      .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date))
      .sort((a, b) => new Date(b) - new Date(a));

    if (dates.length > 0) {
      const lastTasks = JSON.parse(Cookies.get(dates[0]));
      const newTasks = lastTasks.map(task => ({ ...task, completed: false }));
      setTasks(newTasks);
      saveTasksToCookie(newTasks); // Guardar las tareas como las del día actual
    }
  };

  const saveTasksToCookie = (tasksToSave) => {
    Cookies.set(currentDate, JSON.stringify(tasksToSave), { expires: 365 });
  };

  const sortTasksByImportance = (tasksToSort) => {
    return tasksToSort.sort((a, b) => b.importance - a.importance);
  };

  const addTask = (text, importance) => {
    const newTask = { text, importance, completed: false };
    const updatedTasks = [...tasks, newTask];
    const sortedTasks = sortTasksByImportance(updatedTasks);
    setTasks(sortedTasks);
    saveTasksToCookie(sortedTasks);
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
    const sortedTasks = sortTasksByImportance(updatedTasks);
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
