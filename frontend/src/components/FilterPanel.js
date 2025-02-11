// FilterPanel.js
import React, { useState } from 'react';
import { Box, Stack, TextField, Button } from '@mui/material';

export default function FilterPanel({ onFilterSubmit }) {
  const [query, setQuery] = useState('Regulations');

  const handleSubmit = () => {
    onFilterSubmit({ query });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Search Query"
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ minWidth: 250 }}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Apply Filters
        </Button>
      </Stack>
    </Box>
  );
}
