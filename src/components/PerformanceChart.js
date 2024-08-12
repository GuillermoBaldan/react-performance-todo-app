import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Cookies from 'js-cookie';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function PerformanceChart() {
  // Obtener todas las cookies que almacenan datos de tareas
  const allCookies = Cookies.get();
  const dates = Object.keys(allCookies)
    .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date)) // Filtra solo las fechas en formato YYYY-MM-DD
    .sort((a, b) => new Date(a) - new Date(b)); // Ordena por fecha de más antigua a más reciente

  const labels = [];
  const dataValues = [];

  // Recorre las fechas y calcula el porcentaje de performance de cada día
  dates.forEach(date => {
    const tasks = JSON.parse(allCookies[date]);
    const totalImportance = tasks.reduce((total, task) => total + task.importance, 0);
    const completedImportance = tasks.filter(task => task.completed).reduce((total, task) => total + task.importance, 0);
    const performance = totalImportance > 0 ? (completedImportance / totalImportance) * 100 : 0;

    labels.push(date);
    dataValues.push(performance);
  });

  // Datos para el gráfico
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Daily Performance (%)',
        data: dataValues,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Opciones para el gráfico
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div>
      <h2>Performance Over Time</h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default PerformanceChart;
