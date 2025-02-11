// src/components/MetricsComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config'; // Import the API base URL

const MetricsComponent = ({ agency, query, startDate, endDate, changeTypes }) => {
  const [metrics, setMetrics] = useState(null);

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
      .get(`${API_BASE_URL}/metrics`, { params })  // Use backticks for proper interpolation
      .then((response) => {
        setMetrics(response.data);
      })
      .catch((error) =>
        console.error('Error fetching extended metrics:', error)
      );
  }, [agency, query, startDate, endDate, changeTypes]);

  if (!metrics) {
    return <div>Loading extended metrics...</div>;
  }

  return (
    <div>
      <h2>Extended Metrics for {metrics.agency}</h2>
      <p>
        <strong>Result Count:</strong> {metrics.result_count}
      </p>
      <p>
        <strong>Word Count:</strong> {metrics.word_count}
      </p>
      <p>
        <strong>Average Sentence Length:</strong>{' '}
        {metrics.average_sentence_length.toFixed(2)}
      </p>
      <h3>Readability Metrics:</h3>
      <p>
        <strong>Flesch Reading Ease:</strong>{' '}
        {metrics.readability.flesch_reading_ease}
      </p>
      <p>
        <strong>Flesch-Kincaid Grade:</strong>{' '}
        {metrics.readability.flesch_kincaid_grade}
      </p>
      <h3>Top Keywords:</h3>
      <ul>
        {metrics.keywords.map((keyword, index) => (
          <li key={index}>
            {keyword[0]}: {keyword[1]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MetricsComponent;
