import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import '../../App.css';
import { Link } from 'react-router-dom';



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

  const handleEditStaff = () => {
    // Handle edit staff logic here
  };

  const handleRemoveStaff = () => {
    // Handle remove staff logic here
  };

  return (
    <div style={{ width: '100%', display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'right', width: '100%', marginBottom: '20px', marginRight:'500px' }}>
        <Link to="/Signup" style={{ textDecoration: 'none' }}>
            <Button className="button button-margin-right" variant="outlined" startIcon={<ControlPointIcon />}>
              Add
            </Button>
          </Link>
          <Button className="button button-margin-right" variant="outlined" startIcon={<EditIcon />} onClick={handleEditStaff}>
            Edit
          </Button>
          <Button className="button" variant="outlined" startIcon={<DeleteIcon />} onClick={handleRemoveStaff}>
            Delete
          </Button>
        </div>
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
