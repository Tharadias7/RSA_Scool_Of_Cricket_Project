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
import { useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2';

function Player() {
  const [listOfPlayers, setListOfPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/player").then((response) => {
      setListOfPlayers(response.data);
    });
  }, []);

  const handleAddPlayer = () => {
    navigate('/playerRegistration');
  };

  const handleEditPlayer = (player) => {
    navigate('/editPlayer', { state: { player } });
  };

  const handleRemovePlayer = (playerId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: '#791414',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`http://localhost:3001/player/${playerId}/deactivate`)
      .then((response) => {
        if (response.data.success) {
          setListOfPlayers(prevList => prevList.filter(player => player.playerId !== playerId));
          Swal.fire({
            title: 'Deleted!',
            text: 'Record has been deleted.',
            icon: 'success',
            confirmButtonColor: '#791414',
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: 'Aw Snap!',
          text: error.response?.data?.message || 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#791414',
        });
        console.error('Error removing player:', error);
      });
  }
});
};

  const columns = [
    { field: "playerId", headerName: "Player ID", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "date_of_birth", headerName: "Date of Birth", width: 150 },
    { field: "contact_no", headerName: "Contact Number", width: 150 },
    { field: "address", headerName: "Address", width: 250 },
    { field: "employee_no", headerName: "Assigned Coach", width: 150 },
    { field: "joined_date", headerName: "Joined Date", width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => handleEditPlayer(params.row)}
            style={{ marginRight: '10px' }}
          >
          </Button>
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => handleRemovePlayer(params.row.playerId)}
          >
          </Button>
        </>
      )
    }
  ];

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
            justifyContent: "flex-end",
            width: "80%",
            marginBottom: "20px",
          }}
        >
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<ControlPointIcon />}
            onClick={handleAddPlayer}
            style={{ marginRight: '10px' }}
          >
            Add
          </Button>
          <Link to="/qrGeneration" style={{ textDecoration: "none" }}>
            <Button
              className="button"
              variant="outlined"
              startIcon={<QrCodeIcon />}
            >
              QR Code
            </Button>
          </Link>
        </div>
        <div style={{ height: 400, width: "100%" }}>
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
