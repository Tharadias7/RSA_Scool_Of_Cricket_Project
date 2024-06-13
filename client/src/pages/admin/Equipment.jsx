import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../App.css";
import Profile from "../../components/profile";

function Equipment() {
  const [listOfEquipments, setListOfEquipments] = useState([]);
  const [listOfCoaches, setListOfCoaches] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [coachId, setCoachId] = useState("");
  const [currentStockId, setCurrentStockId] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    refreshEquipments();

    axios
      .get("http://localhost:3001/coach")
      .then((response) => {
        setListOfCoaches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching coaches:", error);
      });
  }, []);

  const refreshEquipments = () => {
    axios
      .get("http://localhost:3001/equipment")
      .then((response) => {
        const filteredEquipments = response.data.filter(
          (equipment) => equipment.totalItems > 0
        );
        setListOfEquipments(filteredEquipments);
      })
      .catch((error) => {
        console.error("Error fetching equipment:", error);
      });
  };

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
    if (selectedEquipment.availableItems >= quantity) {
      const payload = {
        stockId: selectedEquipment.stockId,
        employee_no: coachId,
        issuedAmount: parseInt(quantity, 10),
        issuedDate: new Date().toISOString(),
        collectedDate: null,
      };

      axios
        .post("http://localhost:3001/lending", payload)
        .then(() => {
          refreshEquipments();
          handleClose();
          Swal.fire({
            title: "Success!",
            text: "Issue successful",
            icon: "success",
            confirmButtonText: "OK",
          });
        })
        .catch((error) => {
          handleClose();
          Swal.fire({
            title: "Failed!",
            text: "Something went wrong",
            icon: "error",
            confirmButtonText: "OK",
          });
          console.error("Error issuing equipment:", error);
        });
    } else {
      handleClose();
      Swal.fire({
        title: "Error!",
        text: "Not enough items available",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleAddEquipment = () => {
    navigate("/addEquipment");
  };

  const handleEditEquipment = (equipment) => {
    navigate("/editEquipment", { state: { equipment } });
  };

  const handleRemoveEquipment = (stockId, totalItems) => {
    setCurrentStockId(stockId);
    setTotalItems(totalItems);
    setDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false);
    setCurrentStockId(null);
    setTotalItems(0);
  };

  const handleLendingRecords = () => {
    navigate("/lendings");
  };

  const columns = [
    { field: "stockId", headerName: "Stock ID", width: 100 },
    { field: "item", headerName: "Item", width: 125 },
    { field: "brand", headerName: "Brand", width: 150 },
    { field: "totalItems", headerName: "Total Items", width: 100 },
    { field: "availableItems", headerName: "Available Items", width: 150 },
    {
      field: "issue",
      headerName: "Issue",
      width: 150,
      renderCell: (params) => (
        <Button variant="outlined" onClick={() => handleOpen(params.row)}>
          Issue
        </Button>
      ),
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => handleEditEquipment(params.row)}
            style={{ marginRight: "10px" }}
          ></Button>
          <Button
            className="button button-margin-right"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() =>
              handleRemoveEquipment(params.row.stockId, params.row.totalItems)
            }
          ></Button>
        </>
      ),
    },
  ];

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
            onClick={handleLendingRecords}
          >
            Lending Records
          </Button>
          <Button
            className="button button-margin-right"
            variant="outlined"
            onClick={() => navigate("/deletedItem")}
          >
            Removed Items
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
        aria-labelledby="issue-equipment-modal-title"
        aria-describedby="issue-equipment-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Typography
            id="issue-equipment-modal-title"
            variant="h6"
            component="h2"
          >
            Issue Equipment
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="coach-select-label">Select Coach</InputLabel>
            <Select
              labelId="coach-select-label"
              id="coach-select"
              value={coachId}
              label="Select Coach"
              onChange={(e) => setCoachId(e.target.value)}
            >
              {listOfCoaches.map((coach) => (
                <MenuItem key={coach.employee_no} value={coach.employee_no}>
                  {coach.employee_no}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id="quantity-input"
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleIssueConfirm}
            style={{ backgroundColor: "#791414", color: "white" }}
          >
            Confirm
          </Button>
        </Box>
      </Modal>
      <DeleteModal
        open={deleteOpen}
        handleClose={handleCloseDeleteModal}
        stockId={currentStockId}
        totalItems={totalItems}
        refreshEquipments={refreshEquipments}
      />
    </div>
  );
}

//DELETE POP UP MODEL
function DeleteModal({ open, handleClose, stockId, totalItems, refreshEquipments }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleDeleteConfirm = async () => {
    const payload = {
      stockId: stockId,
      amount: parseInt(amount, 10),
      description: description,
    };
  
    console.log("log 1");
    console.log(payload);
  
    try {
      await axios.post("http://localhost:3001/deletedItem", payload);
      console.log("log 2");
      await axios.put("http://localhost:3001/equipment/update-equipment", payload);
      
      handleClose();
      refreshEquipments(); // Refresh the equipments after deletion
      console.log("log 3");
      Swal.fire({
        title: "Success!",
        text: "Delete successful",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      handleClose();
      Swal.fire({
        title: "Failed!",
        text: "Something went wrong",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error deleting equipment:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-equipment-modal-title"
      aria-describedby="delete-equipment-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Typography
          id="delete-equipment-modal-title"
          variant="h6"
          component="h2"
        >
          Remove Equipment
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Total items in stock: {totalItems}
        </Typography>
        <TextField
          id="amount-input"
          label="Removing Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
        />
        <TextField
          id="description-input"
          label="Reason for Remove"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleDeleteConfirm}
          style={{ backgroundColor: "#791414", color: "white" }}
        >
          Confirm
        </Button>
      </Box>
    </Modal>
  );
}

export default Equipment;
