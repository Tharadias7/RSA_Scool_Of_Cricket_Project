import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import "../../App.css";

function Lendings() {
  const [listOfLendings, setListOfLendings] = useState([]);

  useEffect(() => {
    fetchLendings();
  }, []);

  const fetchLendings = async () => {
    try {
      const response = await axios.get("http://localhost:3001/lendings");
      setListOfLendings(response.data);
    } catch (error) {
      console.error("Error fetching lendings", error);
    }
  };

  const handleStatusChange = async (params) => {
    const updatedLending = {
      ...params.row,
      collectedDate: new Date().toISOString().split("T")[0],
    };

    try {
      await axios.put(`http://localhost:3001/lendings/${params.row.stockId}/${params.row.employee_no}`, updatedLending);
      fetchLendings();  // Refresh the data
    } catch (error) {
      console.error("Error updating lending", error);
    }
  };

  const columns = [
    { field: "stockId", headerName: "Stock ID", width: 150 },
    { field: "employee_no", headerName: "Employee No", width: 150 },
    { field: "issuedAmount", headerName: "Issued Amount", width: 150 },
    { field: "issuedDate", headerName: "Issued Date", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleStatusChange(params)}
          disabled={!!params.row.collectedDate}
        >
          {params.row.collectedDate ? "Collected" : "Issued"}
        </Button>
      ),
    },
    { field: "collectedDate", headerName: "Collected Date", width: 150 },
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
            getRowId={(row) => row.stockId + '-' + row.employee_no}
          />
        </div>
      </div>
    </div>
  );
}

export default Lendings;
