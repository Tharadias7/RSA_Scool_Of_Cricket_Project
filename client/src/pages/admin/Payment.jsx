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
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

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
    width: 200,
    headerClassName: 'super-app-theme--header',
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
  const [year, setYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playersResponse = await axios.get('http://localhost:3001/player');
        const paymentsResponse = await axios.get('http://localhost:3001/payment');
        const players = playersResponse.data;
        const paymentRecords = paymentsResponse.data.filter(record => new Date(record.date).getFullYear() === year);
    
        const rowsData = players.map(player => {
          const playerPayments = paymentRecords.filter(record => record.playerId === player.playerId);
          const paymentData = playerPayments.reduce((acc, record) => {
            acc[record.month] = { amount: record.amount, date: record.date }; // Map by month string
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

  const handleEditPayment = () => {
    // Handle edit payment logic here
  };

  const handleRemovePayment = () => {
    // Handle remove payment logic here
  };

  const handleAddPayment = () => {
    navigate('/collectPayment');
  };

  const handleYearChange = (event, newValue) => {
    setYear(newValue ? parseInt(newValue) : '');
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
            renderInput={(params) => <TextField {...params} label="Enter Year" variant="outlined" />}
            style={{ width: '200px'}}
          />
          <div>
            <Button
              className="button button-margin-right"
              variant="outlined"
              startIcon={<ControlPointIcon />}
              onClick={handleAddPayment}
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


// import React, { useEffect, useState } from 'react';
// import Box from '@mui/material/Box';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { styled } from '@mui/material/styles';
// import SideBar from "../../components/SideBar";
// import Button from "@mui/material/Button";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import ControlPointIcon from "@mui/icons-material/ControlPoint";
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';

// const months = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ];

// const columns = [
//   { field: 'playerId', headerName: 'Player ID', width: 150, headerClassName: 'super-app-theme--header' },
//   { field: 'assignedCoach', headerName: 'Assigned Coach', width: 150, headerClassName: 'super-app-theme--header' },
//   ...months.map((month) => ({
//     field: month,
//     headerName: month,
//     width: 200,
//     headerClassName: 'super-app-theme--header',
//     renderCell: (params) => (
//       <div>
//         <div>{params.value?.amount}</div>
//         <div>{params.value?.date}</div>
//       </div>
//     )
//   }))
// ];

// const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
//   '& .MuiDataGrid-columnHeaders': {
//     backgroundColor: theme.palette.primary.main,
//     color: theme.palette.common.black,
//   },
// }));

// export default function Payment() {
//   const [rows, setRows] = useState([]);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const playersResponse = await axios.get('http://localhost:3001/player');
//         const paymentsResponse = await axios.get('http://localhost:3001/payment');
//         const players = playersResponse.data;
//         const paymentRecords = paymentsResponse.data.filter(record => new Date(record.date).getFullYear() === year);

//         const rowsData = players.map(player => {
//           const playerPayments = paymentRecords.filter(record => record.playerId === player.playerId);
//           const paymentData = playerPayments.reduce((acc, record) => {
//             const month = new Date(record.date).toLocaleString('default', { month: 'long' });
//             acc[month] = { amount: record.amount, date: record.date };
//             return acc;
//           }, {});

//           return {
//             id: player.playerId,
//             playerId: player.playerId,
//             assignedCoach: player.employee_no,
//             ...paymentData,
//           };
//         });

//         setRows(rowsData);
//       } catch (error) {
//         console.error('Error fetching data', error);
//       }
//     };

//     fetchData();
//   }, [year]);

//   const handleEditPayment = () => {
//     // Handle edit payment logic here
//   };

//   const handleRemovePayment = () => {
//     // Handle remove payment logic here
//   };

//   const handleAddPayment = () => {
//     navigate('/collectPayment');
//   };

//   const handleYearChange = (event, newValue) => {
//     setYear(newValue ? parseInt(newValue) : '');
//   };

//   return (
//     <div style={{ width: "100%", display: "flex" }}>
//       <SideBar />
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           marginLeft: "20px",
//           overflow: "hidden",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             width: "100%",
//             marginBottom: "20px",
//             marginTop: "20px",
//             justifyContent: "space-between",
//           }}
//         >
//           <Autocomplete
//             freeSolo
//             value={year}
//             onChange={handleYearChange}
//             onInputChange={(event, newInputValue) => handleYearChange(event, newInputValue)}
//             options={[...Array(10)].map((_, i) => (new Date().getFullYear() - i).toString())}
//             renderInput={(params) => <TextField {...params} label="Enter Year" variant="outlined" />}
//             style={{ width: '200px'}}
//           />
//           <div>
//             <Button
//               className="button button-margin-right"
//               variant="outlined"
//               startIcon={<ControlPointIcon />}
//               onClick={handleAddPayment}
//             >
//               Add
//             </Button>
//             <Button
//               className="button button-margin-right"
//               variant="outlined"
//               startIcon={<EditIcon />}
//               onClick={handleEditPayment}
//             >
//               Edit
//             </Button>
//             <Button
//               className="button button-margin-right"
//               variant="outlined"
//               startIcon={<DeleteIcon />}
//               onClick={handleRemovePayment}
//             >
//               Delete
//             </Button>
//           </div>
//         </div>
//         <Box sx={{ height: 520, width: '100%', overflowX: 'auto' }} className="dataGridContainer">
//           <StyledDataGrid
//             rows={rows}
//             columns={columns}
//             pageSize={5}
//             rowsPerPageOptions={[5]}
//             disableSelectionOnClick
//             components={{ Toolbar: GridToolbar }}
//             autoHeight={true}
//           />
//         </Box>
//       </div>
//     </div>
//   );
// }
