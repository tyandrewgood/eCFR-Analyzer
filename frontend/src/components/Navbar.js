import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* 
          "eCFR Analyzer" as a clickable link to Home.
          We style it like a brand/heading but keep it as a Link under the hood.
        */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            eCFR Analyzer
          </Link>
        </Typography>

        {/* Other nav buttons */}
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/about">
          About
        </Button>
      </Toolbar>
    </AppBar>
  );
}
