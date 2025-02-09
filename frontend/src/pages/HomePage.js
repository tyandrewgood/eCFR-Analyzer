// src/pages/HomePage.js

import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      {/* Outer Box to center content */}
      <Box textAlign="center">
        {/* Main Title */}
        <Typography variant="h3" gutterBottom>
          Welcome to the eCFR Analyzer
        </Typography>

        {/* Subtitle or Tagline */}
        <Typography variant="h5" color="text.secondary" paragraph>
          Explore and Analyze Federal Regulations from the electronic Code of Federal Regulations
        </Typography>

        {/* Description */}
        <Typography variant="body1" paragraph>
          Discover valuable insights into Federal Regulations through interactive dashboards and 
          advanced text analytics. Dive deep into agency-specific metrics, historical trends, and 
          keyword extractions to understand the impact of regulatory changes over time.
        </Typography>

        {/* Call to Action Buttons */}
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/dashboard"
            sx={{ mr: 2 }}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            component={Link}
            to="/about"
          >
            Learn More
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
