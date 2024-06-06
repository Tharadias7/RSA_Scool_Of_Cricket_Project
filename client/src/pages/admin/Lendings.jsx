import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import "../../App.css";

function Lendings() {
  const [listOfLendings, setListOfLendings] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/lending")
      .then((response) => {
        const updatedLendings = response.data.map((lending, index) => ({
          ...lending,
          id: lending.issueId, // Ensure correct ID mapping
          item: lending.Equipment.item,
          brand: lending.Equipment.brand,
        }));
        setListOfLendings(updatedLendings);
      })
      .catch(error => {
        console.error("Error fetching lendings:", error);
      });
  }, []);

  const handleCollect = (lending) => {
    axios.put(`http://localhost:3001/lending/${lending.issueId}/collect`)
      .then(() => {
        setListOfLendings((prevList) =>
          prevList.map((item) =>
            item.issueId === lending.issueId ? { ...item, collectedDate: new Date().toISOString() } : item
          )
        );
        Swal.fire({
          title: 'Success!',
          text: 'Collection recorded successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      })
      .catch(error => {
        Swal.fire({
          title: 'Oh Snap!',
          text: error.response?.data?.message || 'Something went wrong!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        console.error("Error recording collection:", error);
      });
  };

  const columns = [
    { field: "item", headerName: "Item", width: 125 },
    { field: "brand", headerName: "Brand", width: 150 },
    { field: "employee_no", headerName: "Employee No", width: 150 },
    { field: "issuedAmount", headerName: "Issued Amount", width: 150 },
    {
      field: "issuedDate",
      headerName: "Issued Date",
      width: 200,
      renderCell: (params) => (
        <span>{new Date(params.value).toLocaleDateString()}</span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        params.row.collectedDate ? (
          <span>Collected</span>
        ) : (
          <Button
            variant="outlined"
            onClick={() => handleCollect(params.row)}
          >
            Collect
          </Button>
        )
      ),
    },
    {
      field: "collectedDate",
      headerName: "Collected Date",
      width: 200,
      renderCell: (params) => (
        params.value ? new Date(params.value).toLocaleDateString() : ""
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
        <div style={{ height: 400, width: "auto", margin: "20px" }}>
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
