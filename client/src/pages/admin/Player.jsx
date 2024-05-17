import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import QrCodeIcon from '@mui/icons-material/QrCode';
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
    { field: "playerId", headerName: "Player ID", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "date_of_birth", headerName: "Date of Birth", width: 150 },
    { field: "contact_no", headerName: "Contact Number", width: 150 },
    { field: "address", headerName: "Address", width: 250 },
    { field: "assigned_team", headerName: "Assigned Team", width: 150 },
    { field: "joined_date", headerName: "Joined Date", width: 150 },
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
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center", 
          marginLeft:"20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginBottom: "20px",
            marginLeft:"500px",
          }}
        >
          <Link to="/playerRegistration" style={{ textDecoration: "none" }}>
            <Button
              className="button button-margin-right"
              variant="outlined"
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
            className="button button-margin-right"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleRemoveStudent}
          >
            Delete
          </Button>
          {/* <Link to="/qrGeneration" style={{ textDecoration: "none" }}> */}
          <Button
            className="button"
            variant="outlined"
            startIcon={<QrCodeIcon />}
          >
          QR Code
          </Button>
          {/* </Link> */}
        </div>
        <div style={{ height: 400, width: "auto", margin: "20px"}}>
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
