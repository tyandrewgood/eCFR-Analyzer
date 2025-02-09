// src/components/TimeSeriesChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TimeSeriesChart({ data }) {
  // we expect data to be an array of objects like: 
  // [{ date: '2023-01-01', wordCount: 1200 }, { date: '2023-02-01', wordCount: 1600 }, ...]

  const chartData = {
    datasets: [
      {
        label: 'Word Count Over Time',
        data: data.map(point => ({
          x: point.date,   // "2023-01-01" in ISO format
          y: point.wordCount
        })),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.2, // slight curve
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month' // or 'day', depending on your data frequency
        },
        title: {
          display: true,
          text: 'Date'
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Word Count'
        }
      }
    },
  };

  return <Line data={chartData} options={options} />;
}
