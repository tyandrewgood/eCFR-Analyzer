// src/components/AgencyDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Box, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';
import AgencyCard from './AgencyCard';
import { API_BASE_URL } from '../config';

export default function AgencyDashboard() {
  const navigate = useNavigate();

  const [agencies, setAgencies] = useState([]);
  const [filteredAgencies, setFilteredAgencies] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(''); // Local keyword filter

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/agencies`)
      .then((res) => {
        const list = res.data.agencies || [];
        setAgencies(list);
        setFilteredAgencies(list);
      })
      .catch((err) => console.error('Error fetching agencies:', err));
  }, []);

  // Update filtered agencies when the user types a search keyword
  useEffect(() => {
    const keyword = searchKeyword.toLowerCase();
    const filtered = agencies.filter((agency) => {
      const name = (agency.display_name || agency.slug || '').toLowerCase();
      return name.includes(keyword);
    });
    setFilteredAgencies(filtered);
  }, [searchKeyword, agencies]);

  const handleJumpToAgency = (event, selected) => {
    if (selected) {
      navigate(`/agency/${selected.slug}`);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Agency Dashboard
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Filter agencies by name or jump directly to a known agency. Click on an agency to view detailed analytics.
      </Typography>

      {/* Search Input */}
      <Box sx={{ mt: 3, mb: 3, maxWidth: 400 }}>
        <TextField
          label="Filter Agencies by Keyword"
          variant="outlined"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          fullWidth
        />
      </Box>

      {/* Jump to Agency Autocomplete */}
      <Box sx={{ mb: 3, maxWidth: 400 }}>
        <Autocomplete
          options={agencies}
          getOptionLabel={(option) => option.display_name || option.slug || ''}
          onChange={handleJumpToAgency}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Jump to Agency"
              variant="outlined"
              placeholder="Type agency name..."
            />
          )}
        />
      </Box>

      {/* Render Filtered Agencies */}
      <Grid container spacing={3}>
        {filteredAgencies.map((agency) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={agency.slug}>
            <AgencyCard agency={agency} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
