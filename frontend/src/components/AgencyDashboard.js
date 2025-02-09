// src/components/AgencyDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FilterPanel from './FilterPanel';
import AgencyCard from './AgencyCard';
import './AgencyDashboard.css';
import { Container, Grid } from '@mui/material';

export default function AgencyDashboard() {
  const [agencies, setAgencies] = useState([]);
  const [filters, setFilters] = useState({
    query: 'Regulations',
    startDate: '',
    endDate: '',
    changeTypes: [],
  });

  // Fetch agencies once on mount
  useEffect(() => {
    axios
      .get('http://localhost:8091/agencies')
      .then((res) => {
        const list = res.data.agencies || [];
        setAgencies(list);
      })
      .catch((err) => console.error('Error fetching agencies:', err));
  }, []); // <-- empty array means only on mount

  // Called when user applies new filters
  const handleFilterSubmit = (newFilters) => {
    setFilters(newFilters);
    // If you want to auto fetch again or do something else, add logic here
  };

  return (
    <Container maxWidth="lg" className="agency-dashboard">
      <h2>Agency Dashboard</h2>
      <FilterPanel onFilterSubmit={handleFilterSubmit} />

      <Grid container spacing={2} className="agency-grid">
        {agencies.map((agency) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={agency.slug}>
            {/* Passing filters if you want the detail page to see them */}
            <AgencyCard agency={agency} filters={filters} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
