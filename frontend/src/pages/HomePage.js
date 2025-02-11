// src/HomePage.js
import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: 'calc(100vh - 64px)', // adjust if Navbar height changes
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          eCFR Analyzer
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Dive into Federal Regulations with interactive dashboards and advanced analytics.
          Explore agency overviews, detailed metrics, and aggregated statistics that reveal
          trends and insights across all agencies.
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/dashboard"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            component={Link}
            to="/statistics"
          >
            View Statistics
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            component={Link}
            to="/about"
          >
            Learn More
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
