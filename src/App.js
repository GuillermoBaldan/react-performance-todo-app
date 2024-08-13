import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import Progress from './components/Progress';
import PerformanceChart from './components/PerformanceChart'; // Importa el nuevo componente

function App() {
  const [tasks, setTasks] = useState([]);
  const [mockDate, setMockDate] = useState(null);

  // Definir la función global para borrar todas las cookies
  window.deleteAllCookies = function() {
    const cookies = document.cookie.split(";");

    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });

    console.log("All cookies from this app have been deleted.");
  };

  // Función global para controlar la fecha de la aplicación
  window.appClock = function (useRealTime, fakeDate) {
    if (useRealTime) {
      setMockDate(null); // Usar la fecha real del sistema
      console.log("Using real system time.");
    } else {
      setMockDate(fakeDate); // Usar la fecha falsa proporcionada
      console.log("Using fake date: " + fakeDate);
    }
  };

  // Función global para borrar la cookie de una fecha específica
  window.deleteCookieDate = function(date) {
    Cookies.remove(date, { path: '/' });
    console.log(`Cookie for date ${date} has been deleted.`);
  };

  // Obtener la fecha actual, ya sea real o simulada
  const getCurrentDate = () => {
    return mockDate || new Date().toISOString().split('T')[0];
  };

  const currentDate = getCurrentDate();

  useEffect(() => {
    // Cargar las tareas del día actual desde las cookies
    const savedTasks = Cookies.get(currentDate);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // No hay tareas para el día actual, buscar el último día registrado
      loadTasksFromLastRegisteredDay();
    }
  }, [currentDate, setTasks]);

  const loadTasksFromLastRegisteredDay = () => {
    const allCookies = Cookies.get(); // Obtiene todas las cookies
    const dates = Object.keys(allCookies)
      .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date)) // Filtra las cookies que son fechas en formato YYYY-MM-DD
      .sort((a, b) => new Date(b) - new Date(a)); // Ordena las fechas de más reciente a más antigua

    if (dates.length > 0) {
      const lastTasks = JSON.parse(Cookies.get(dates[0]));
      // Marcar todas las tareas como no completadas
      const newTasks = lastTasks.map(task => ({ ...task, completed: false }));
      setTasks(newTasks);
      saveTasksToCookie(newTasks); // Guardar las tareas como las del día actual
    }
  };

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
      <PerformanceChart /> {/* Incluir el gráfico de rendimiento */}
    </div>
  );
}

export default App;
