import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function InfoCard({ title, value, bgColor }) {
  return (
    <Paper sx={{ 
      backgroundColor: bgColor, 
      padding: 2, 
      margin: 1, 
      borderRadius: 2, 
      textAlign: 'center', 
      width: 200, // Fixed width
      height: 100 // Fixed height
    }}>
      <Typography >{title}</Typography>
      <Typography >{value}</Typography>
    </Paper>
  );
}
