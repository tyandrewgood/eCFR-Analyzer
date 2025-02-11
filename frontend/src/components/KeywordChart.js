// src/components/KeywordChart.js
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,  // Register CategoryScale for x-axis (default for bar charts)
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register all necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function KeywordChart({ keywords }) {
  // Extract labels and counts from the keywords array
  const labels = keywords.map(([word]) => word);
  const counts = keywords.map(([_, count]) => count);

  const data = {
    labels,
    datasets: [
      {
        label: 'Keyword Frequency',
        data: counts,
        backgroundColor: 'rgba(63, 81, 181, 0.5)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}
