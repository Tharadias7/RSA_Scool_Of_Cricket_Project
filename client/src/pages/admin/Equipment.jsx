import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, Box, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../App.css";

function Equipment() {
  const [listOfEquipments, setListOfEquipments] = useState([]);
  const [listOfCoaches, setListOfCoaches] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [coachId, setCoachId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/equipment")
      .then((response) => {
        setListOfEquipments(response.data);
      })
      .catch(error => {
        console.error("Error fetching equipment:", error);
      });

    axios.get("http://localhost:3001/coach")
      .then((response) => {
        setListOfCoaches(response.data);
      })
      .catch(error => {
        console.error("Error fetching coaches:", error);
      });
  }, []); // Empty dependency array to ensure this runs only once

  const handleOpen = (equipment) => {
    setSelectedEquipment(equipment);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setQuantity("");
    setCoachId("");
  };

  const handleIssueConfirm = () => {
    const payload = {
      stockId: selectedEquipment.stockId,
      employee_no: coachId,
      issuedAmount: parseInt(quantity, 10), // Ensure quantity is an integer
      issuedDate: new Date().toISOString(), // Ensure the date is in a valid format
      collectedDate: null,
    };
    console.log("Payload:", payload);
  
    axios.post("http://localhost:3001/lending", payload)
      .then(() => {
        handleClose();
        Swal.fire({
          title: 'Success!',
          text: 'Issue successful',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      })
      .catch(error => {
        handleClose();
        Swal.fire({
          title: 'Oh Snap!',
          text: error.response?.data?.message || 'Something went wrong!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        console.error("Error issuing equipment:", error);
      });
  };
  

  const columns = [
    { field: "stockId", headerName: "Stock ID", width: 150 },
    { field: "item", headerName: "Item", width: 150 },
    { field: "brand", headerName: "Brand", width: 150 },
    { field: "totalItems", headerName: "Total Items", width: 150 },
    { field: "availableItems", headerName: "Available Items", width: 150 },
    {
      field: "action",
      headerName: "Actions",
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
  ];

  const handleAddEquipment = () => {
    navigate("/addEquipment");
  };

  const handleEditEquipment = () => {
    // Handle edit equipment logic here
  };

  const handleRemoveEquipment = () => {
    // Handle remove equipment logic here
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
            justifyContent: "center",
            width: "100%",
            marginBottom: "20px",
            marginLeft: "500px",
          }}
        >
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<ControlPointIcon />}
            onClick={handleAddEquipment}
          >
            Add
          </Button>
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditEquipment}
          >
            Edit
          </Button>
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleRemoveEquipment}
          >
            Delete
          </Button>
        </div>
        <div style={{ height: 400, width: "auto", margin: "20px" }}>
          <DataGrid
            rows={listOfEquipments}
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
            <InputLabel id="coach-id-label">Coach ID</InputLabel>
            <Select
              labelId="coach-id-label"
              value={coachId}
              onChange={(e) => setCoachId(e.target.value)}
              label="Coach ID"
            >
              {listOfCoaches.map((coach) => (
                <MenuItem key={coach.employee_no} value={coach.employee_no}>
                  {coach.employee_no}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            className="issueConBtn"
            variant="contained"
            onClick={handleIssueConfirm}
            sx={{ mt: 2 }}
          >
            CONFIRM
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Equipment;
