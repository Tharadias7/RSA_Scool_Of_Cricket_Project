import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../../components/SideBar";
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Profile from "../../components/profile";

function Staff() {
  const [listOfStaff, setListOfStaff] = useState([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    axios.get("http://localhost:3001/staff")
      .then((response) => {
        const transformedData = response.data.map(staff => ({
          employee_no: staff.employee_no,
          name: staff.name,
          designation: staff.designation,
          contact_no: staff.contact_no,
          username: staff.user?.username, // Get username
          active: staff.active,
        }));
        setListOfStaff(transformedData);
      })
      .catch((error) => {
        console.error('Error fetching staff data:', error);
      });
  }, []);

  const handleEditStaff = (staff) => {
    navigate('/editStaff', { state: { staff } });
  };

  const handleToggleStaffStatus = (employeeNo, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'activate' : 'deactivate';
    Swal.fire({
      title: `Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this staff member?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: '#791414',
      confirmButtonText: `Yes, ${newStatus ? 'activate' : 'deactivate'}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`http://localhost:3001/staff/${employeeNo}/${action}`)
          .then((response) => {
            if (response.data.success) {
              setListOfStaff(prevList => prevList.map(staff =>
                staff.employee_no === employeeNo ? { ...staff, active: newStatus } : staff
              ));
              Swal.fire({
                title: `${newStatus ? 'Activated' : 'Deactivated'}!`,
                text: `Staff member has been ${newStatus ? 'activated' : 'deactivated'}.`,
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
            console.error(`Error ${newStatus ? 'activating' : 'deactivating'} staff:`, error);
          });
      }
    });
  };

  const columns = [
    { field: 'employee_no', headerName: 'Employee No', width: 200 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'designation', headerName: 'Designation', width: 200 },
    { field: 'contact_no', headerName: 'Contact Number', width: 200 },
    //{ field: 'username', headerName: 'Username', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      sortable: false,
      renderCell: (params) => (
        <>
          {userRole === 'manager' && (
            <>
              <Button
                className="button button-margin-right"
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => handleEditStaff(params.row)}
                style={{ marginRight: '10px' }}
              >
              </Button>
              <Button
                className="button button-margin-right"
                variant="outlined"
                onClick={() => handleToggleStaffStatus(params.row.employee_no, params.row.active)}
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
    <div style={{ width: '100%', display: "flex" }}>
      <SideBar />
        <div className="profileBox" >
          <Profile />
        </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'right', width: '80%', marginBottom: '20px' }}>
          {userRole === 'manager' && (
            <Link to="/Signup" style={{ textDecoration: 'none' }}>
              <Button className="button button-margin-right" variant="outlined" startIcon={<ControlPointIcon />}>
                Add Staff
              </Button>
            </Link>
          )}
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

