import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import "../../App.css";
import { Link } from "react-router-dom";

function Player() {
  const [listOfPlayers, setListOfPlayers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/player").then((response) => {
      setListOfPlayers(response.data);
    });
  }, []);

  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "month", headerName: "Month", width: 200 },
    { field: "week 1", headerName: "Week 1", width: 200 },
    { field: "week 2", headerName: "Week 2", width: 200 },
    { field: "week 3", headerName: "Week 3", width: 300 },
    { field: "week 4", headerName: "Week 4", width: 200 },

  ];

  const handleEditStudent = () => {
    // Handle edit student logic here
  };

  const handleRemoveStudent = () => {
    // Handle remove student logic here
  };

  return (
    <div style={{ width: "100%", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'right', width: '100%', marginBottom: '20px', marginRight:'500px' }}>
        <Link to="/playerRegistration" style={{ textDecoration: "none" }}>
            <Button
              className="button button-margin-right"variant="outlined"
              startIcon={<ControlPointIcon />}
            >
              Add
            </Button>
          </Link>
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditStudent}
          >
            Edit
          </Button>
          <Button
            className="button"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleRemoveStudent}
          >
            Delete
          </Button>
        </div>
        <div style={{ height: 400, width: "auto" }}>
          <DataGrid
            rows={listOfPlayers}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row.playerId}
          />
        </div>
      </div>
    </div>
  );
}

export default Player;



// import React from "react";
// import SideBar from "../../components/SideBar";
// import Box from "@mui/material/Box";

// export default function Attendance() {
//   return (
//     <>
//       <Box sx={{ display: "flex" }}>
//         <SideBar />
//         <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//           <h1>Attendance</h1>
//           </Box>
//       </Box>
//     </>
//   );
// }