// src/components/LoadingSpinner.js
import React from 'react';
import { CircularProgress, Box } from '@mui/material';

export default function LoadingSpinner() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
      }}
    >
      <CircularProgress />
    </Box>
  );
}
