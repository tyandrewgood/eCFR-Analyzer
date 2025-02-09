// src/components/FilterPanel.js
import React, { useState } from 'react';

const POSSIBLE_CHANGE_TYPES = ['effective', 'cross_reference', 'initial'];

export default function FilterPanel({ onFilterSubmit }) {
  const [query, setQuery] = useState('Regulations');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedChangeTypes, setSelectedChangeTypes] = useState([]);

  const handleChangeTypeToggle = (type) => {
    if (selectedChangeTypes.includes(type)) {
      setSelectedChangeTypes(selectedChangeTypes.filter((t) => t !== type));
    } else {
      setSelectedChangeTypes([...selectedChangeTypes, type]);
    }
  };

  const handleSubmit = () => {
    onFilterSubmit({
      query,
      startDate,
      endDate,
      changeTypes: selectedChangeTypes,
    });
  };

  return (
    <div className="filter-panel">
      <label>
        Search Query:
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <label>
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      <div>
        <p>Select Change Types:</p>
        {POSSIBLE_CHANGE_TYPES.map((type) => (
          <label key={type} style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              value={type}
              checked={selectedChangeTypes.includes(type)}
              onChange={() => handleChangeTypeToggle(type)}
            />
            {type}
          </label>
        ))}
      </div>
      <button onClick={handleSubmit}>Apply Filters</button>
    </div>
  );
}
