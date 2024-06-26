import React, { useEffect, useRef, useState } from 'react';
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
  ...months.flatMap((month) => (
    [...Array(5).keys()].map((week) => ({
      field: `${month.slice(0, 3)}W${week + 1}`,
      headerName: `${month.slice(0, 3)}-W${week + 1}`,
      width: 75,  
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <div style={{ color: params.value === true ? 'green' : 'inherit' }}>
          {params.value === true ? 'Present' : params.value}
        </div>
      )
    }))
  ))
];

const getWeekField = (date) => {
  const month = date.getMonth();
  const day = date.getDate();
  let week = '';

  if (day >= 1 && day <= 7) week = 'W1';
  else if (day >= 8 && day <= 14) week = 'W2';
  else if (day >= 15 && day <= 21) week = 'W3';
  else if (day >= 22 && day <= 28) week = 'W4';
  else week = 'W5';

  return `${months[month].slice(0, 3)}${week}`;
};

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.black,
  },
}));

export default function DataGridDemo() {
  const [rows, setRows] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();
  const pdfRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playersResponse = await axios.get('http://localhost:3001/player');
        const attendanceResponse = await axios.get('http://localhost:3001/attendance');
        const players = playersResponse.data;
        const attendanceRecords = attendanceResponse.data.filter(record => new Date(record.date).getFullYear() === year);

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
  }, [year]);

  const handleAddAttendance = () => {
    navigate('/takeAttendance');
  };

  const handleYearChange = (event, newValue) => {
    setYear(newValue ? parseInt(newValue) : '');
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
        pdf.save('attendance.pdf');
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
          overflow: "hidden",
        }}
        ref={pdfRef}
      >
        <div className='topic'>Player Attendance</div>
        <div
          style={{
            display: "flex",
            width: "100%",
            marginBottom: "20px",
            marginTop: "60px",
            justifyContent: "space-between",
          }}
        >
          <Autocomplete
            freeSolo
            value={year.toString()}  // Treat year as string
            onChange={handleYearChange}
            onInputChange={(event, newInputValue) => handleYearChange(event, newInputValue)}
            options={[...Array(10)].map((_, i) => (new Date().getFullYear() - i).toString())}
            renderInput={(params) => <TextField {...params} label="Enter Year" variant="outlined" />}
            style={{ width: '200px' }}
          />
          <div style={{ marginRight: '70px' }}>
            <Button
              className="button button-margin-right"
              variant="outlined"
              startIcon={<ControlPointIcon />}
              onClick={handleAddAttendance}
            >
              Add
            </Button>
            <Button
              className='button button-margin-right'
              variant="outlined"
              onClick={downloadPDF}
              startIcon={<DownloadIcon />}
            >
              Attendance Report
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
// import ControlPointIcon from "@mui/icons-material/ControlPoint";
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import Profile from "../../components/profile";


// const months = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ];

// const columns = [
//   { field: 'playerId', headerName: 'Player ID', width: 150, headerClassName: 'super-app-theme--header' },
//   { field: 'assignedCoach', headerName: 'Assigned Coach', width: 150, headerClassName: 'super-app-theme--header' },
//   ...months.flatMap((month) => (
//     [...Array(5).keys()].map((week) => ({
//       field: `${month.slice(0, 3)}W${week + 1}`,
//       headerName: `${month.slice(0, 3)}-W${week + 1}`,
//       width: 75,  
//       headerClassName: 'super-app-theme--header',
//       renderCell: (params) => (
//         <div style={{ color: params.value === true ? 'green' : 'inherit' }}>
//           {params.value === true ? 'Present' : params.value}
//         </div>
//       )
//     }))
//   ))
// ];

// const getWeekField = (date) => {
//   const month = date.getMonth();
//   const day = date.getDate();
//   let week = '';

//   if (day >= 1 && day <= 7) week = 'W1';
//   else if (day >= 8 && day <= 14) week = 'W2';
//   else if (day >= 15 && day <= 21) week = 'W3';
//   else if (day >= 22 && day <= 28) week = 'W4';
//   else week = 'W5';

//   return `${months[month].slice(0, 3)}${week}`;
// };

// const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
//   '& .MuiDataGrid-columnHeaders': {
//     backgroundColor: theme.palette.primary.main,
//     color: theme.palette.common.black,
//   },
// }));

// export default function DataGridDemo() {
//   const [rows, setRows] = useState([]);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const playersResponse = await axios.get('http://localhost:3001/player');
//         const attendanceResponse = await axios.get('http://localhost:3001/attendance');
//         const players = playersResponse.data;
//         const attendanceRecords = attendanceResponse.data.filter(record => new Date(record.date).getFullYear() === year);

//         console.log("Players:", players); // Debugging log
//         console.log("Attendance Records:", attendanceRecords); // Debugging log

//         const rowsData = players.map(player => {
//           const playerAttendance = attendanceRecords.filter(record => record.playerId === player.playerId);
//           const attendanceData = playerAttendance.reduce((acc, record) => {
//             const weekField = getWeekField(new Date(record.date));
//             acc[weekField] = record.attendanceStatus;
//             return acc;
//           }, {});

//           console.log("Attendance Data for Player:", player.playerId, attendanceData); // Debugging log

//           return {
//             id: player.playerId,
//             playerId: player.playerId,
//             assignedCoach: player.employee_no,
//             ...attendanceData,
//           };
//         });

//         console.log("Rows Data:", rowsData); // Debugging log
//         setRows(rowsData);
//       } catch (error) {
//         console.error('Error fetching data', error);
//       }
//     };

//     fetchData();
//   }, [year]);

//   const handleAddAttendance = () => {
//     navigate('/takeAttendance');
//   };

//   const handleYearChange = (event, newValue) => {
//     setYear(newValue ? parseInt(newValue) : '');
//   };

//   return (
//     <div style={{ width: "100%", display: "flex" }}>
//       <SideBar />
//       <div className="profileBox" >
//         <Profile />
//       </div>
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
//       ><div className='topic'>Player Attendance </div>
//         <div
//           style={{
//             display: "flex",
//             width: "100%",
//             marginBottom: "20px",
//             marginTop: "60px",
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
//           <div style={{marginRight: '70px'}}>
//             <Button
//               className="button button-margin-right"
//               variant="outlined"
//               startIcon={<ControlPointIcon />}
//               onClick={handleAddAttendance}
//             >
//               Add
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
