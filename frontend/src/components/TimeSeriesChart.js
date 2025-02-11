// src/components/TimeSeriesChart.js

import React from 'react';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

// Register the Filler plugin so "fill: true" works
ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TimeSeriesChart({ data }) {
  // e.g. data = [{ date: '2023-01-01', wordCount: 1000 }, ... ]
  const chartData = {
    datasets: [
      {
        label: 'Word Count',
        data: data.map((point) => ({
          x: point.date,
          y: point.wordCount,
        })),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true, // uses the Filler plugin
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: { unit: 'month' },
      },
      y: { beginAtZero: true },
    },
  };

  return <Line data={chartData} options={options} />;
}
