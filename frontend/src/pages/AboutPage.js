// src/pages/LearnMorePage.js

import React from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function LearnMorePage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom>
          Learn More About the eCFR Analyzer
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Discover how our advanced analytics and interactive dashboards provide insights
          into Federal Regulations.
        </Typography>
      </Box>

      {/* Example of a 3-column layout describing features */}
      <Grid container spacing={4}>
        {/* Feature 1 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Agency Overview
              </Typography>
              <Typography variant="body2" paragraph>
                Explore an interactive dashboard of all eCFR agencies, each with a 
                quick summary and click-through to detailed metrics.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Feature 2 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Advanced Metrics
              </Typography>
              <Typography variant="body2" paragraph>
                Dive deeper with readability scores, average sentence length, and top 
                keyword analysis for each agency’s regulations.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Feature 3 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Historical Trends
              </Typography>
              <Typography variant="body2" paragraph>
                Visualize word count and other metrics over time with our time-series 
                charts, tracking regulatory changes historically.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* CTA Buttons */}
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
        <Button variant="outlined" color="secondary" size="large" component={Link} to="/">
          Return Home
        </Button>
      </Box>
    </Container>
  );
}
