// src/components/DetailedAnalysis.js
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import TimeSeriesChart from './TimeSeriesChart';

export default function DetailedAnalysis() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  const [metrics, setMetrics] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // parse filters from query string
  const query = searchParams.get('query') || 'Regulations';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const changeTypesString = searchParams.get('changeTypes') || '';

  // memoize array creation to avoid re-triggering on every render
  const changeTypes = useMemo(() => {
    return changeTypesString ? changeTypesString.split(',') : [];
  }, [changeTypesString]);

  // 1. Fetch Extended Metrics from /metrics
  useEffect(() => {
    setLoadingMetrics(true);
    const params = { agency: slug, query };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (changeTypes.length > 0) params.change_types = changeTypes.join(',');

    axios
      .get('http://localhost:8091/metrics', { params })
      .then((res) => {
        setMetrics(res.data);
      })
      .catch((err) => console.error('Error fetching extended metrics:', err))
      .finally(() => setLoadingMetrics(false));
  }, [slug, query, startDate, endDate, changeTypes]);

  // 2. Fetch Historical Data from /history (time-series)
  useEffect(() => {
    setLoadingHistory(true);
    const params = { agency: slug, query };
    // you can also pass startDate/endDate if your /history endpoint supports it
    axios
      .get('http://localhost:8091/history', { params })
      .then((res) => {
        setHistoryData(res.data); // expect array of { date, wordCount }
      })
      .catch((err) => console.error('Error fetching history data:', err))
      .finally(() => setLoadingHistory(false));
  }, [slug, query]);

  // display spinners if either is loading
  if (loadingMetrics || loadingHistory) {
    return <p>Loading Detailed Analysis...</p>;
  }

  // If no metrics returned, show error
  if (!metrics) {
    return <p>Could not load extended metrics for {slug}.</p>;
  }

  // destructure the advanced metrics
  const {
    result_count,
    word_count,
    average_sentence_length,
    readability,
    keywords,
  } = metrics;

  return (
    <div style={{ padding: 20 }}>
      <h2>Detailed Analysis: {slug}</h2>
      <p>
        <strong>Result Count:</strong> {result_count}
      </p>
      <p>
        <strong>Word Count:</strong> {word_count}
      </p>
      <p>
        <strong>Average Sentence Length:</strong> {average_sentence_length?.toFixed(2)}
      </p>

      {readability && (
        <>
          <h3>Readability Metrics:</h3>
          <p>
            <strong>Flesch Reading Ease:</strong> {readability.flesch_reading_ease?.toFixed(2)}
          </p>
          <p>
            <strong>Flesch-Kincaid Grade:</strong> {readability.flesch_kincaid_grade?.toFixed(2)}
          </p>
        </>
      )}

      {keywords && keywords.length > 0 && (
        <>
          <h3>Top Keywords:</h3>
          <ul>
            {keywords.map(([word, count], idx) => (
              <li key={idx}>
                {word}: {count}
              </li>
            ))}
          </ul>
        </>
      )}

      <h3>Historical Trend</h3>
      {historyData.length > 0 ? (
        <TimeSeriesChart data={historyData} />
      ) : (
        <p>No historical data available</p>
      )}
    </div>
  );
}
