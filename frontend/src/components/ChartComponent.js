// src/components/ChartComponent.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = ({ agency, query, startDate, endDate, changeTypes }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!agency) return;
    // Build params object for Axios
    const params = {
      agency,
      query,
    };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (changeTypes && changeTypes.length > 0)
      params.change_types = changeTypes.join(',');

    axios
      .get('http://localhost:8091/analyze', { params })
      .then((response) => {
        const data = response.data;
        setChartData({
          labels: ['Result Count', 'Word Count'],
          datasets: [
            {
              label: `eCFR Metrics (${agency})`,
              data: [data.result_count, data.word_count],
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
              ],
            },
          ],
        });
      })
      .catch((error) =>
        console.error('Error fetching analysis data:', error)
      );
  }, [agency, query, startDate, endDate, changeTypes]);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Basic Analysis for {agency}</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default ChartComponent;
