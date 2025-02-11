// src/components/AgencyCard.js
import React from 'react';
import { Card, CardContent, Tooltip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function AgencyCard({ agency, filters }) {
  const { display_name, name, short_name, slug } = agency;

  // tooltip text
  const tooltipText = short_name
    ? `Agency short name: ${short_name}. Click for metrics.`
    : 'Click for metrics.';

  // detail URL uses slug
  const detailUrl = `/agency/${slug}`;

  return (
    <Tooltip title={tooltipText} arrow>
      <Card variant="outlined" sx={{ cursor: 'pointer', height: '100%' }}>
        <Link to={detailUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {display_name || name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Learn more about this agency’s regulations...
            </Typography>
          </CardContent>
        </Link>
      </Card>
    </Tooltip>
  );
}
