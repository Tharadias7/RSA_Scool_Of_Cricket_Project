import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Modal,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
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
    axios
      .get("http://localhost:3001/equipment")
      .then((response) => {
        setListOfEquipments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching equipment:", error);
      });

    axios
      .get("http://localhost:3001/coach")
      .then((response) => {
        setListOfCoaches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching coaches:", error);
      });
  }, []);

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
          axios
            .get("http://localhost:3001/equipment")
            .then((response) => {
              setListOfEquipments(response.data);
              handleClose();
              Swal.fire({
                title: "Success!",
                text: "Issue successful",
                icon: "success",
                confirmButtonText: "OK",
              });
            })
            .catch((error) => {
              console.error("Error fetching equipment:", error);
            });
        })
        .catch((error) => {
          handleClose();
          Swal.fire({
            title: "Oops.",
            text: "Something went wrong",
            icon: "error",
            confirmButtonText: "OK",
          });
          console.error("Error issuing equipment:", error);
        });
    } else {
      handleClose();
      Swal.fire({
        title: "Oh Snap!",
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
        fetchEquipments={() => {
          axios
            .get("http://localhost:3001/equipment")
            .then((response) => {
              setListOfEquipments(response.data);
            })
            .catch((error) => {
              console.error("Error fetching equipment:", error);
            });
        }}
      />
    </div>
  );
}

function DeleteModal({
  open,
  handleClose,
  stockId,
  totalItems,
  fetchEquipments,
}) {
  const [deleteOption, setDeleteOption] = useState("all");
  const [deleteAmount, setDeleteAmount] = useState("");

  const handleConfirm = () => {
    if (deleteOption === "all") {
      axios
        .delete(`http://localhost:3001/equipment/${stockId}`)
        .then(() => {
          fetchEquipments();
          handleClose();
          Swal.fire({
            title: "Success!",
            text: "Equipment deleted successfully",
            icon: "success",
            confirmButtonText: "OK",
          });
        })
        .catch((error) => {
          console.error("Error deleting equipment:", error);
          handleClose();
          Swal.fire({
            title: "Fail!",
            text: "This stock still have issued item to collect",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    } else {
      const amount = parseInt(deleteAmount, 10);
      if (amount <= totalItems) {
        axios
          .put(`http://localhost:3001/equipment/reduce/${stockId}`, { amount })
          .then(() => {
            fetchEquipments();
            handleClose();
            Swal.fire({
              title: "Success!",
              text: "Amount reduced successfully",
              icon: "success",
              confirmButtonText: "OK",
            });
          })
          .catch((error) => {
            console.error("Error reducing equipment amount:", error);
            handleClose();
            Swal.fire({
              title: "Fail!",
              text: "Something went wrong",
              icon: "error",
              confirmButtonText: "OK",
            });
          });
      } else {
        handleClose();
        Swal.fire({
          title: "Error!",
          text: "Entered amount is greater than total items",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };
    

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
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
        <Typography id="delete-modal-title" variant="h6" component="h2">
          Removing Amount
        </Typography>
        <RadioGroup
          aria-label="delete-option"
          name="delete-option"
          value={deleteOption}
          onChange={(e) => setDeleteOption(e.target.value)}
        >
          <FormControlLabel value="all" control={<Radio />} label="All" />
          <FormControlLabel
            value="amount"
            control={<Radio />}
            label="Other amount"
          />
        </RadioGroup>
        {deleteOption === "amount" && (
          <TextField
            id="delete-amount-input"
            label="Enter amount"
            type="number"
            value={deleteAmount}
            onChange={(e) => setDeleteAmount(e.target.value)}
            fullWidth
          />
        )}
        <Button
          variant="contained"
          onClick={handleConfirm}
          style={{ backgroundColor: "#791414", color: "white" }}
        >
          Confirm
        </Button>
      </Box>
    </Modal>
  );
}

export default Equipment;
