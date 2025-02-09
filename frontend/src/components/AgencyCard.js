// src/components/AgencyCard.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function AgencyCard({ agency, filters }) {
  const { query, startDate, endDate, changeTypes } = filters;
  
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (changeTypes.length > 0) {
    params.append('changeTypes', changeTypes.join(','));
  }

  const detailUrl = `/agency/${agency.slug}?${params.toString()}`;

  return (
    <div className="agency-card">
      <Link to={detailUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3>{agency.display_name || agency.name}</h3>
        <p>Click to view detailed metrics...</p>
      </Link>
    </div>
  );
}
