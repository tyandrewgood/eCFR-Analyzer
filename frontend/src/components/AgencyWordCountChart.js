import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,      // For the x-axis (agency names)
  LinearScale,        // For the y-axis (word counts)
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AgencyWordCountChart({ data }) {
  // If data is provided as a prop, use it; otherwise, fetch it.
  const [agencyData, setAgencyData] = useState(data || []);
  const [loading, setLoading] = useState(!data); // only show loading if data is not provided

  useEffect(() => {
    if (!data) {
      setLoading(true);
      axios
        .get('http://localhost:8091/agency_word_count', {
          params: { query: 'Regulations' }
        })
        .then((res) => {
          setAgencyData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching agency word count:', err);
          setLoading(false);
        });
    }
  }, [data]);

  if (loading) {
    return <div>Loading Agency Data...</div>;
  }

  // Ensure that agencyData is an array; if not, use an empty array
  const agencies = Array.isArray(agencyData) ? agencyData : [];
  
  const chartData = {
    labels: agencies.map((item) => item.agency),
    datasets: [
      {
        label: 'Word Count',
        data: agencies.map((item) => item.word_count),
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Total Word Count by Agency' },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 90,
          minRotation: 45,
        },
      },
      y: { beginAtZero: true },
    },
  };

  return <Bar data={chartData} options={options} />;
}
