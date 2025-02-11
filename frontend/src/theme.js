// src/theme.js

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#003366',  // Navy
    },
    secondary: {
      main: '#666666',  // Medium-dark gray
    },
    background: {
      default: '#f7f7f7',
      paper: '#ffffff',
    },
    text: {
      // you can tweak default or secondary text if you want 
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '3rem' },
    h2: { fontWeight: 600, fontSize: '2.25rem' },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
        },
      },
    },
  },
});

export default theme;
