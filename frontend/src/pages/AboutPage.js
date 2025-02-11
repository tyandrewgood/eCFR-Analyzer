// src/AboutPage.js
import React from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom>
          Learn More About the eCFR Analyzer
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Discover how our tool provides insights into Federal Regulations through interactive dashboards and aggregated metrics.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Feature 1: Agency Overview */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Agency Overview
              </Typography>
              <Typography variant="body2" paragraph>
                Explore an interactive dashboard with a quick summary for each agency.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Feature 2: Advanced Metrics */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Advanced Metrics
              </Typography>
              <Typography variant="body2" paragraph>
                Analyze readability, average sentence length, and keyword data for detailed insights.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Feature 3: Aggregated Statistics */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Aggregated Statistics
              </Typography>
              <Typography variant="body2" paragraph>
                View overall metrics—total words, top 10 words, and average counts. Last updated info and refresh option included.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={6}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/dashboard"
          sx={{ mr: 2 }}
        >
          View Dashboard
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          component={Link}
          to="/statistics"
        >
          View Statistics
        </Button>
      </Box>
    </Container>
  );
}
