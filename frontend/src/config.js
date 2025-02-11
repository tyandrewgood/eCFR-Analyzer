// src/config.js
// This file exports the API base URL, which can be overridden via the REACT_APP_API_URL environment variable.
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";
