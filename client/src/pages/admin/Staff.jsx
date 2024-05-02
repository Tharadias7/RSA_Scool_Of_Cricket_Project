import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import { DataGrid } from '@mui/x-data-grid';

function Staff() {
  const [listOfStaff, setListOfStaff] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/staff").then((response) => {
      setListOfStaff(response.data);
    });
  }, []);

  const columns = [
    { field: 'employee_no', headerName: 'Employee No', width: 200 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'designation', headerName: 'Designation', width: 200 },
    { field: 'contact_no', headerName: 'Contact Number', width: 200 },
  ];

  return (
    <div style={{ height: 400, width: '100%', display:"flex" }}>
      <SideBar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ height: 400, width: 'auto' }}>
        <DataGrid
          rows={listOfStaff}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.employee_no}
        />
      </div>
    </div>
    </div>
  );
}

export default Staff;