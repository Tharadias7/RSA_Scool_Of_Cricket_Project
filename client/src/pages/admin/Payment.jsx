import React, { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import SideBar from "../../components/SideBar";
import Button from "@mui/material/Button";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Profile from "../../components/profile";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DownloadIcon from '@mui/icons-material/Download';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const columns = [
  { field: 'playerId', headerName: 'Player ID', width: 150, headerClassName: 'super-app-theme--header' },
  { field: 'assignedCoach', headerName: 'Assigned Coach', width: 150, headerClassName: 'super-app-theme--header' },
  ...months.map((month) => ({
    field: month,
    headerName: month,
    width: 150,
    headerClassName: 'super-app-theme--header',
    editable: true,
    renderCell: (params) => (
      <div>
        <div>{params.value?.amount}</div>
        <div>{params.value?.date}</div>
      </div>
    )
  }))
];

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.black,
  },
}));


export default function Payment() {
  const [rows, setRows] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const navigate = useNavigate();
  const pdfRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playersResponse = await axios.get('http://localhost:3001/player');
        const paymentsResponse = await axios.get(`http://localhost:3001/payment/${year}`);
        const players = playersResponse.data;
        const paymentRecords = paymentsResponse.data;

        const rowsData = players.map(player => {
          const playerPayments = paymentRecords.filter(record => record.playerId === player.playerId);
          const paymentData = playerPayments.reduce((acc, record) => {
            acc[record.month] = { amount: record.amount, date: record.date };
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
  }, [year]);

  const handleAddPayment = () => {
    navigate('/collectPayment');
  };

  const handleYearChange = (event, newValue) => {
    setYear(newValue ? newValue : '');
  };

  const processRowUpdate = async (updatedRow, originalRow) => {
    try {
      await axios.put(`http://localhost:3001/payment/${updatedRow.id}`, {
        playerId: updatedRow.playerId,
        month: Object.keys(updatedRow).find(month => updatedRow[month]?.amount !== originalRow[month]?.amount),
        amount: Object.values(updatedRow).find(value => value?.amount !== originalRow[value?.amount]),
        date: new Date().toISOString(),
      });
      return updatedRow;
    } catch (error) {
      console.error('Error updating payment', error);
      throw error; // This will trigger onProcessRowUpdateError
    }
  };

  const handleProcessRowUpdateError = (error) => {
    console.error('Error processing row update', error);
  };

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4', true);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 30;
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save('payment.pdf');
    });
};

  return (
    <div style={{ width: "100%", display: "flex" }}>
      <SideBar />
      <div className="profileBox">
        <Profile />
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "20px",
          marginTop: "40px",
          overflow: "hidden",
        }}
        ref={pdfRef}
      >
      <div className='topic'>
      Monthly Payment Records 
      </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            marginBottom: "20px",
            marginTop: "20px",
            justifyContent: "space-between",
          }}
        >
          <Autocomplete
            freeSolo
            value={year}
            onChange={handleYearChange}
            onInputChange={(event, newInputValue) => handleYearChange(event, newInputValue)}
            options={[...Array(10)].map((_, i) => (new Date().getFullYear() - i).toString())}
            getOptionLabel={(option) => option.toString()}
            renderInput={(params) => <TextField {...params} label="Enter Year" variant="outlined" />}
            style={{ width: '200px'}}
          />
          <div style={{marginRight: '70px'}}>
            <Button
              className="button button-margin-right"
              variant="outlined"
              startIcon={<ControlPointIcon />}
              onClick={handleAddPayment}
            >
              Add
            </Button>
            <Button 
          className='button button-margin-right'
          variant="outlined"
          onClick={downloadPDF}
          startIcon={<DownloadIcon />}
          >
          Payment Report 
          </Button>
            <br></br><br></br>
            {/* <div style={{fontSize: "12px", color: "#791414"}}>*To edit a cell, double click or press 'Enter' </div> */}
          </div>
        </div>
        <Box sx={{ height: 520, width: '100%', overflowX: 'auto' }} className="dataGridContainer">
          <StyledDataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            components={{ Toolbar: GridToolbar }}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            autoHeight={true}
          />
        </Box>
      </div>
    </div>
  );
}
