import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import QrCodeIcon from '@mui/icons-material/QrCode';
import "../../App.css";
import { useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import Profile from "../../components/profile";

function Player() {
  const [listOfPlayers, setListOfPlayers] = useState([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole'); // Retrieve user role from local storage

  useEffect(() => {
    axios.get("http://localhost:3001/player")
      .then((response) => {
        console.log('Fetched player data:', response.data); // Debug log
        setListOfPlayers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching player data:', error); // Debug log
      });
  }, []);

  const handleAddPlayer = () => {
    navigate('/playerRegistration');
  };

  const handleEditPlayer = (player) => {
    navigate('/editPlayer', { state: { player } });
  };

  const handleTogglePlayerStatus = (playerId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'activate' : 'deactivate';
    Swal.fire({
      title: `Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this player?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: '#791414',
      confirmButtonText: `Yes, ${newStatus ? 'activate' : 'deactivate'} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`http://localhost:3001/player/${playerId}/${action}`)
          .then((response) => {
            if (response.data.success) {
              setListOfPlayers(prevList => prevList.map(player =>
                player.playerId === playerId ? { ...player, active: newStatus } : player
              ));
              Swal.fire({
                title: `${newStatus ? 'Activated' : 'Deactivated'}!`,
                text: `Player has been ${newStatus ? 'activated' : 'deactivated'}.`,
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
            console.error(`Error ${newStatus ? 'activating' : 'deactivating'} player:`, error);
          });
      }
    });
  };

  const columns = [
    { field: "playerId", headerName: "Player ID", width: 100 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "date_of_birth", headerName: "Date of Birth", width: 130 },
    { field: "contact_no", headerName: "Contact Number", width: 130 },
    { field: "address", headerName: "Address", width: 250 },
    { field: "employee_no", headerName: "Assigned Coach", width: 130 },
    { field: "joined_date", headerName: "Joined Date", width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 400,
      sortable: false,
      renderCell: (params) => (
        <>
          {userRole !== 'inventoryManager' && (
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
                onClick={() => handleTogglePlayerStatus(params.row.playerId, params.row.active)}
              >
                {params.row.active ? 'Deactivate' : 'Activate'}
              </Button>
            </>
          )}
        </>
      )
    }
  ];

  return (
    <div style={{ width: "100%", display: "flex" }}>
      <SideBar />
      <div className="profileBox" >
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
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "80%",
            marginBottom: "20px",
            marginTop: "60px",
          }}
        >
          {userRole !== 'inventoryManager' && (
            <>
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
            </>
          )}
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
