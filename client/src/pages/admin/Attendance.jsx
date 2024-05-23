import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import SideBar from "../../components/SideBar";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

// Define months and weeks
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Generate columns dynamically
const columns = [
  { field: 'playerId', headerName: 'Player ID', width: 150, headerClassName: 'super-app-theme--header' },
  { field: 'assignedCoach', headerName: 'Assigned Coach', width: 150, headerClassName: 'super-app-theme--header' },
  ...months.flatMap((month) => (
    [...Array(5).keys()].map((week) => ({
      field: `${month.slice(0, 3)}W${week + 1}`,
      headerName: `${month.slice(0, 3)}-W${week + 1}`,
      width: 75,  // Adjust width as needed
      headerClassName: 'super-app-theme--header'
    }))
  ))
];

// Function to determine the week based on the date
const getWeekField = (date) => {
  const month = date.getMonth(); // 0-based
  const day = date.getDate();
  let week = '';

  if (day >= 1 && day <= 7) week = 'W1';
  else if (day >= 8 && day <= 14) week = 'W2';
  else if (day >= 15 && day <= 21) week = 'W3';
  else if (day >= 22 && day <= 28) week = 'W4';
  else week = 'W5';

  return `${months[month].slice(0, 3)}${week}`;
};

// Custom header styling
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.black,
  },
}));

export default function DataGridDemo() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();  // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching data from API
        const playersResponse = await axios.get('http://localhost:3001/player');
        const attendanceResponse = await axios.get('http://localhost:3001/attendance'); 
        const players = playersResponse.data;
        const attendanceRecords = attendanceResponse.data;

        const rowsData = players.map(player => {
          const playerAttendance = attendanceRecords.filter(record => record.playerId === player.playerId);
          const attendanceData = playerAttendance.reduce((acc, record) => {
            const weekField = getWeekField(new Date(record.date));
            acc[weekField] = record.attendanceStatus;
            return acc;
          }, {});

          return {
            id: player.playerId,
            playerId: player.playerId,
            assignedCoach: player.employee_no,
            ...attendanceData,
          };
        });

        setRows(rowsData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const handleEditAttendance = () => {
    // Handle edit attendance logic here
  };

  const handleRemoveAttendance = () => {
    // Handle remove attendance logic here
  };

  const handleAddAttendance = () => {
    navigate('/takeAttendance');  // Navigate to takeAttendance page
  };

  return (
    <div style={{ width: "100%", display: "flex" }}>
      <SideBar />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "20px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            marginBottom: "20px",
            marginLeft: '110%',
          }}
        >
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<ControlPointIcon />}
            onClick={handleAddAttendance}  // Change onClick handler
          >
            Add
          </Button>
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditAttendance}
          >
            Edit
          </Button>
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleRemoveAttendance}
          >
            Delete
          </Button>
        </div>
        <Box sx={{ height: 520, width: '100%', overflowX: 'auto' }} className="dataGridContainer">
          <StyledDataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            components={{ Toolbar: GridToolbar }}
            autoHeight={true}
          />
        </Box>
      </div>
    </div>
  );
}
