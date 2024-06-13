import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import Profile from "../../components/profile";

function Lendings() {
  const [listOfLendings, setListOfLendings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/lending")
      .then((response) => {
        const updatedLendings = response.data.map((lending) => ({
          ...lending,
          id: lending.issueId, // Ensure correct ID mapping
          item: lending.Equipment.item,
          brand: lending.Equipment.brand,
        }));
        setListOfLendings(updatedLendings);
      })
      .catch((error) => {
        console.error("Error fetching lendings:", error);
      });
  }, []);

  const handleCollect = (lending) => {
    axios
      .put(`http://localhost:3001/lending/${lending.issueId}/collect`)
      .then(() => {
        setListOfLendings((prevList) =>
          prevList.map((item) =>
            item.issueId === lending.issueId
              ? { ...item, collectedDate: new Date().toISOString() }
              : item
          )
        );
        Swal.fire({
          title: "Success!",
          text: "Collection recorded successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Failed!",
          text: error.response?.data?.message || "Something went wrong!",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error recording collection:", error);
      });
  };

  // const handleEditLending = (lending) => {
  //   navigate("/editLendings", { state: { lending } });
  // };

  // const handleDeleteLending = (lendingId) => {
  //   const lending = listOfLendings.find((item) => item.issueId === lendingId);
  //   if (!lending || !lending.collectedDate) {
  //     Swal.fire({
  //       title: "Failed!",
  //       text: "Cannot delete a lending record that has not been collected.",
  //       icon: "warning",
  //       confirmButtonColor: "#791414",
  //     });
  //     return;
  //   }

  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "green",
  //     cancelButtonColor: "#791414",
  //     confirmButtonText: "Yes, delete it!",
  //     cancelButtonText: "No, cancel!",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       axios
  //         .delete(`http://localhost:3001/lending/${lendingId}`)
  //         .then(() => {
  //           setListOfLendings((prevList) =>
  //             prevList.filter((item) => item.issueId !== lendingId)
  //           );
  //           Swal.fire({
  //             title: "Deleted!",
  //             text: "Lending record has been deleted.",
  //             icon: "success",
  //             confirmButtonColor: "#791414",
  //           });
  //         })
  //         .catch((error) => {
  //           Swal.fire({
  //             title: "Failed!",
  //             text: error.response?.data?.message || "Something went wrong!",
  //             icon: "error",
  //             confirmButtonColor: "#791414",
  //           });
  //           console.error("Error deleting lending:", error);
  //         });
  //     }
  //   });
  // };

  const columns = [
    { field: "item", headerName: "Item", width: 125 },
    { field: "brand", headerName: "Brand", width: 150 },
    { field: "employee_no", headerName: "Coach ID", width: 150 },
    { field: "issuedAmount", headerName: "Amount", width: 100 },
    {
      field: "issuedDate",
      headerName: "Issued Date",
      width: 150,
      renderCell: (params) => (
        <span>{new Date(params.value).toLocaleDateString()}</span>
      ),
    },
    {
      field: "collect",
      headerName: "Status",
      width: 150,
      renderCell: (params) =>
        params.row.collectedDate ? (
          <span style={{ color: "green" }}>Collected</span>
        ) : (
          <Button variant="outlined" onClick={() => handleCollect(params.row)}>
            Collect
          </Button>
        ),
    },
    {
      field: "collectedDate",
      headerName: "Collected Date",
      width: 150,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "",
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: 200,
    //   sortable: false,
    //   renderCell: (params) => (
    //     <div style={{ display: "flex", gap: "10px" }}>
    //       {!params.row.collectedDate && ( // Show edit button if item is not collected
    //         <Button
    //           variant="outlined"
    //           startIcon={<EditIcon />}
    //           onClick={() => handleEditLending(params.row)}
    //           title="Edit Lending"
    //         />
    //       )}
    //       {params.row.collectedDate && ( // Show delete button if item is collected
    //         <Button
    //           variant="outlined"
    //           color="error"
    //           startIcon={<DeleteIcon />}
    //           onClick={() => handleDeleteLending(params.row.issueId)}
    //           title="Delete Lending"
    //         />
    //       )}
    //     </div>
    //   ),
    // },
    
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
          marginTop: "60px",
          overflow: "hidden",
        }}
      >
        <div style={{ height: 400, width: "auto", margin: "20px", }}>
          <DataGrid
            rows={listOfLendings}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row.id}
          />
        </div>
      </div>
    </div>
  );
}

export default Lendings;
