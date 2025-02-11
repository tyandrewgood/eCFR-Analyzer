// src/components/DetailedAnalysis.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Grid,
  CircularProgress,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import { AccessTime, School, TextFields, HelpOutline } from '@mui/icons-material';
import TimeSeriesChart from './TimeSeriesChart';
import KeywordChart from './KeywordChart'; // Import the KeywordChart component

export default function DetailedAnalysis() {
  const { slug } = useParams();
  const [query, setQuery] = useState('');
  const [currentQuery, setCurrentQuery] = useState('Regulations');
  const [metrics, setMetrics] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Function to fetch metrics data from the backend
  const fetchMetrics = () => {
    setLoadingMetrics(true);
    axios
      .get('http://localhost:8091/metrics', { params: { agency: slug, query: currentQuery } })
      .then((res) => setMetrics(res.data))
      .catch((err) => console.error('Error fetching metrics:', err))
      .finally(() => setLoadingMetrics(false));
  };

  // Function to fetch historical data from the backend
  const fetchHistory = () => {
    setLoadingHistory(true);
    axios
      .get('http://localhost:8091/history', { params: { agency: slug, query: currentQuery } })
      .then((res) => setHistoryData(res.data))
      .catch((err) => console.error('Error fetching history:', err))
      .finally(() => setLoadingHistory(false));
  };

  // Fetch data when the component mounts or when slug/currentQuery changes
  useEffect(() => {
    fetchMetrics();
    fetchHistory();
  }, [slug, currentQuery]);

  // Update the query to trigger new API requests
  const handleQuerySubmit = () => {
    setCurrentQuery(query || 'Regulations');
  };

  // Show a loading spinner while data is loading
  if (loadingMetrics || loadingHistory) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show an error message if metrics are not available
  if (!metrics) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">
          Could not load metrics for agency: {slug}
        </Typography>
      </Box>
    );
  }

  // Destructure the metrics for easier use in the UI
  const {
    result_count,
    word_count,
    average_sentence_length,
    readability,
    keywords,
  } = metrics;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Page Header */}
      <Typography variant="h4" gutterBottom>
        Detailed Analysis: {slug}
      </Typography>

      {/* Query Input and Submission */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <TextField
          label="Word/Phrase to Analyze"
          variant="outlined"
          placeholder="e.g., Regulations"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleQuerySubmit} sx={{ mt: 2 }}>
          Analyze
        </Button>
      </Paper>

      {/* Total Word Count Section */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Total Word Count
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h3" color="primary">
          {word_count}
        </Typography>
      </Paper>

      {/* Result Count Section */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Search and Result Count
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1">
          <strong>Result Count:</strong> {result_count}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Use the form above to analyze specific words or phrases within this dataset.
        </Typography>
      </Paper>

      {/* Advanced Metrics Section */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Advanced Text Metrics
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTime />
            <Typography>
              <strong>Average Sentence Length:</strong> {average_sentence_length?.toFixed(2)}
            </Typography>
            <Tooltip title="Average words per sentence. Higher values often indicate complexity." arrow>
              <IconButton size="small" color="primary" aria-label="info">
                <HelpOutline />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <School />
            <Typography>
              <strong>Flesch Reading Ease:</strong> {readability?.flesch_reading_ease?.toFixed(2)}
            </Typography>
            <Tooltip title="Measures readability: Higher scores are easier to read. Negative values indicate complexity." arrow>
              <IconButton size="small" color="primary" aria-label="info">
                <HelpOutline />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextFields />
            <Typography>
              <strong>Flesch-Kincaid Grade:</strong> {readability?.flesch_kincaid_grade?.toFixed(2)}
            </Typography>
            <Tooltip title="Approximate U.S. grade level required to understand the text." arrow>
              <IconButton size="small" color="primary" aria-label="info">
                <HelpOutline />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Paper>

      {/* Top Keywords Section */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Top Keywords
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {keywords.map(([word, count], idx) => (
            <Grid item xs={6} sm={4} md={3} key={idx}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">{word}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {count} occurrences
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Optional: Keywords Visualization Section */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Keywords Visualization
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <KeywordChart keywords={keywords} />
      </Paper>

      {/* Historical Trends Section */}
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Historical Trends
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {historyData.length > 0 ? (
          <TimeSeriesChart data={historyData} />
        ) : (
          <Typography color="text.secondary">
            No historical data available.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
