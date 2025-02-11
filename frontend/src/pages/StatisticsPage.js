// src/pages/StatisticsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Grid,
  Box,
  Button,
} from '@mui/material';
import KeywordChart from '../components/KeywordChart';
import AgencyWordCountChart from '../components/AgencyWordCountChart';
import { API_BASE_URL } from '../config';  // Import API_BASE_URL from your config file

export default function StatisticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refresh handler calls the refresh endpoint and reloads the page upon success.
  // (If you decide not to use the refresh functionality, you can keep this commented out.)
  const handleRefresh = () => {
    if (window.confirm('Refreshing may take some time. Continue?')) {
      axios
        .post(`${API_BASE_URL}/refresh_statistics`, null, {
          params: { query: 'Regulations' },
        })
        .then((res) => {
          alert('Statistics refreshed!');
          window.location.reload();
        })
        .catch((err) => {
          console.error('Error refreshing statistics:', err);
          alert('Failed to refresh statistics.');
        });
    }
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/statistics`, { params: { query: 'Regulations' } })
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching statistics:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', p: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!stats || stats.error) {
    return (
      <Container sx={{ textAlign: 'center', p: 4 }}>
        <Typography color="error">Unable to load statistics.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ p: 4 }}>
      {/* Header with Refresh Button (if desired) */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3">Statistics</Typography>
        {/* Uncomment the refresh button if you want to allow refreshing data:
        <Button variant="outlined" color="primary" onClick={handleRefresh}>
          Refresh Data
        </Button> */}
      </Box>

      {/* Aggregated Statistics */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Aggregated Statistics
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">
              <strong>Total Word Count:</strong> {stats.total_word_count.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">
              <strong>Agency Count:</strong> {stats.agency_count}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">
              <strong>Average Word Count:</strong> {stats.average_word_count.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">
              <strong>Median Word Count:</strong> {stats.median_word_count}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">
              <strong>Std. Deviation:</strong> {stats.std_word_count.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">
              <strong>Min Word Count:</strong> {stats.min_word_count} ({stats.min_agency})
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">
              <strong>Max Word Count:</strong> {stats.max_word_count} ({stats.max_agency})
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">
              <strong>Flesch Reading Ease:</strong>{' '}
              {stats.aggregated_readability.flesch_reading_ease
                ? stats.aggregated_readability.flesch_reading_ease.toFixed(2)
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">
              <strong>Flesch-Kincaid Grade:</strong>{' '}
              {stats.aggregated_readability.flesch_kincaid_grade
                ? stats.aggregated_readability.flesch_kincaid_grade.toFixed(2)
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              <strong>Last Updated:</strong> {stats.last_updated}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Top 10 Most Common Words Chart */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Top 10 Most Common Words
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <KeywordChart keywords={stats.top_10_words} />
      </Paper>

      {/* Agency Word Count Chart */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Agency Word Count
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <AgencyWordCountChart />
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          Note: For clarity, only a subset of agency names may be displayed on the x-axis.
        </Typography>
      </Paper>
    </Container>
  );
}
