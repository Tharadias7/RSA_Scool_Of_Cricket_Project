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

// Define months
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Generate columns dynamically
const columns = [
  { field: 'playerId', headerName: 'Player ID', width: 150, headerClassName: 'super-app-theme--header' },
  { field: 'assignedCoach', headerName: 'Assigned Coach', width: 150, headerClassName: 'super-app-theme--header' },
  ...months.map((month) => ({
    field: month,
    headerName: month,
    width: 100,  // Adjust width as needed
    headerClassName: 'super-app-theme--header'
  }))
];

// Custom header styling
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.black,
  },
}));

export default function Payment() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();  // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching data from API
        const playersResponse = await axios.get('http://localhost:3001/player');
        const paymentsResponse = await axios.get('http://localhost:3001/payments');
        const players = playersResponse.data;
        const paymentRecords = paymentsResponse.data;

        const rowsData = players.map(player => {
          const playerPayments = paymentRecords.filter(record => record.playerId === player.playerId);
          const paymentData = playerPayments.reduce((acc, record) => {
            const month = new Date(record.date).toLocaleString('default', { month: 'long' });
            acc[month] = record.paymentStatus;
            return acc;
          }, {});

          return {
            id: player.playerId,
            playerId: player.playerId,
            assignedCoach: player.employee_no,
            ...paymentData,
          };
        });

        setRows(rowsData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const handleEditPayment = () => {
    // Handle edit payment logic here
  };

  const handleRemovePayment = () => {
    // Handle remove payment logic here
  };

  const handleAddPayment = () => {
    navigate('/takeAttendance');
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
            onClick={handleAddPayment}  // Change onClick handler
          >
            Add
          </Button>
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditPayment}
          >
            Edit
          </Button>
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleRemovePayment}
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
