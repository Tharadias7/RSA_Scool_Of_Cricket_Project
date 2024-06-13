import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function InfoCard({ title, value, bgColor }) {
  return (
    <Paper sx={{ 
      backgroundColor: '#ffffff', 
      padding: 2, 
      margin: 1, 
      border: 2,
      borderColor: '#791414',
      borderRadius: 2, 
      textAlign: 'center',
      width: 200, // Fixed width
      height: 120 // Fixed height
    }}>
      <Typography variant="h6" fontWeight="bold">{title}</Typography>
      <Typography variant="body1" fontWeight="bold">{value}</Typography>
    </Paper>
  );
}
