import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SideBar from "../../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, Box, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../App.css";
import Profile from "../../components/profile";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DownloadIcon from '@mui/icons-material/Download';

function Uniform() {
  const [listOfUniforms, setListOfUniforms] = useState([]);
  const [listOfCoaches, setListOfCoaches] = useState([]);
  const [listOfActivePlayers, setListOfActivePlayers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUniform, setSelectedUniform] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [playerId, setPlayerId] = useState("");
  const navigate = useNavigate();
  const pdfRef = useRef();

  useEffect(() => {
    axios.get("http://localhost:3001/uniform")
      .then((response) => {
        setListOfUniforms(response.data);
      })
      .catch(error => {
        console.error("Error fetching uniforms:", error);
      });

    axios.get("http://localhost:3001/coach")
      .then((response) => {
        setListOfCoaches(response.data);
      })
      .catch(error => {
        console.error("Error fetching coaches:", error);
      });

    axios.get("http://localhost:3001/player")
      .then((response) => {
        setListOfActivePlayers(response.data);
      })
      .catch(error => {
        console.error("Error fetching active players:", error);
      });
  }, []); // Empty dependency array to ensure this runs only once

  const handleOpen = (uniform) => {
    setSelectedUniform(uniform);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setQuantity("");
    setPlayerId("");
  };

  const handleIssueConfirm = () => {
  const payload = {
    stockId: selectedUniform.stockId,
    playerId: playerId,
    quantity: parseInt(quantity, 10), // Ensure quantity is an integer
    date: new Date().toISOString(), // Ensure the date is in a valid format
    unitPrice: parseFloat(selectedUniform.unitPrice).toFixed(2) // Ensure unitPrice is a float with two decimal places
  };

  console.log("Payload:", payload); // Log the payload for debugging

  axios.post("http://localhost:3001/purchase", payload)
    .then(() => {
      handleClose();
      Swal.fire({
        title: 'Success!',
        text: 'Issue successful',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      // Update the stock in the frontend
      setListOfUniforms(prevUniforms =>
        prevUniforms.map(uniform =>
          uniform.stockId === selectedUniform.stockId
            ? { ...uniform, currentStock: uniform.currentStock - payload.quantity }
            : uniform
        )
      );
    })
    .catch(error => {
      handleClose();
      console.error("Error issuing uniform:", error.response?.data || error.message);
      Swal.fire({
        title: 'Failed!',
        text: 'Something went !',
        // text: error.response?.data?.message || 'Something went wrong!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    });
};
  

  const handleAddUniform = () => {
    navigate("/addUniform");
  };

  const handlePurchaseData = () => {
    navigate("/purchases");
  };

  const handleEditUniform = (uniform) => {
    navigate('/editUniform', { state: { uniform } });
  };

  const columns = [
    { field: "stockId", headerName: "Stock ID", width: 150 },
    { field: "item", headerName: "Item", width: 150 },
    { field: "size", headerName: "Size", width: 150 },
    { field: "unitPrice", headerName: "Unit Price (Rs.)", width: 150 },
    { field: "currentStock", headerName: "Current Stock", width: 150 },
    {
      field: "issue",
      headerName: "Issue",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleOpen(params.row)}
        >
          Issue
        </Button>
      ),
    },
    {
      field: 'actions',
      headerName: 'Edit Stock',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => handleEditUniform(params.row)}
            style={{ marginRight: '10px' }}
          >
          </Button>
        </>
      )
    }
  ];

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
        pdf.save('uniform.pdf');
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
          marginTop: "60px",
          overflow: "hidden",
        }}
        ref={pdfRef}
      >
      <div className='topic' style={{marginBottom: '40px'}}>
      Uniform Inventory Records 
      </div>
        <div
          style={{
            display: "flex",
            justifyContent: "right",
            width: "80%",
            marginBottom: "20px",
          }}
        >
          <Button
            className="button button-margin-right"
            variant="outlined"
            onClick={handlePurchaseData}
          >
            Purchase Data
          </Button>
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<ControlPointIcon />}
            onClick={handleAddUniform}
          >
            Add
          </Button>
          <Button 
          className='button button-margin-right'
          variant="outlined"
          onClick={downloadPDF}
          startIcon={<DownloadIcon />}
          >
          Uniform Report 
          </Button>
        </div>
        <div style={{ height: 400, width: "auto", margin: "20px" }}>
          <DataGrid
            rows={listOfUniforms}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row.stockId}
          />
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="issue-uniform-modal-title"
        aria-describedby="issue-uniform-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography id="issue-uniform-modal-title" variant="h6" component="h2">
            ISSUE UNIFORM
          </Typography>
          <TextField
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            margin="normal"
            fullWidth
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="player-id-label">Player ID</InputLabel>
            <Select
              labelId="player-id-label"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              label="Player ID"
            >
              {listOfActivePlayers.map((player) => (
                <MenuItem key={player.playerId} value={player.playerId}>
                  {player.playerId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleIssueConfirm}
            style={{ backgroundColor: "#791414", color: "white" }}
          >
            Confirm
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Uniform;
