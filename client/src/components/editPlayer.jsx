import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Button, TextField, Typography, Box, Snackbar, Alert } from '@mui/material';
import logoImage from '../assets/logo.png';
import SideBar from './SideBar';
import Swal from 'sweetalert2';
import Profile from './profile';

const PlayerSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  date_of_birth: Yup.date().required('Date of Birth is required'),
  contact_no: Yup.string().required('Contact Number is required'),
  address: Yup.string().required('Address is required'),
  employee_no: Yup.string().required('Assigned Coach is required'),
  joined_date: Yup.date().required('Joined Date is required'),
});

const EditPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { player } = location.state || {};
  const [playerData, setPlayerData] = useState({});
  // const [openSnackbar, setOpenSnackbar] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState('');
  // const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/player/${player.playerId}`);
        setPlayerData(response.data);
        console.log("Player data:", response.data);
      } catch (error) {
        console.error('Error fetching player data', error);
      }
    };
    fetchData();
  }, [player.playerId]);

  const handleSubmit = async (values) => {
    try {
      await axios.put(`http://localhost:3001/player/${values.playerId}`, values);

      // Show success message using SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Player data updated successfully!',
        confirmButtonColor: '#791414',
      });

      navigate('/player');
    } catch (error) {
      console.error('Error updating player', error);
      
      // Show error message using SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error updating player data.',
        confirmButtonColor: '#791414',
      });
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex' }}>
      <SideBar />
      <div className="profileBox" >
        <Profile />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            bgcolor: 'background.paper',
          }}
        >
          <img src={logoImage} alt="logo" style={{ width: '120px', height: 'auto', marginBottom: '20px' }} />
          <Typography component="h1" variant="h5">
            Edit Player Data
          </Typography>
          <Formik
            initialValues={{
              ...playerData,
              name: playerData.name || '',
              date_of_birth: playerData.date_of_birth || '',
              contact_no: playerData.contact_no || '',
              address: playerData.address || '',
              employee_no: playerData.employee_no || '',
              joined_date: playerData.joined_date || '',
            }}
            validationSchema={PlayerSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched }) => (
              <Form style={{ display: 'flex', flexDirection: 'column', width: '300px', marginTop: '20px' }}>
                <Field
                  as={TextField}
                  name="name"
                  label="Name"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
                <Field
                  as={TextField}
                  type="date"
                  name="date_of_birth"
                  label="Date of Birth"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.date_of_birth && !!errors.date_of_birth}
                  helperText={touched.date_of_birth && errors.date_of_birth}
                />
                <Field
                  as={TextField}
                  name="contact_no"
                  label="Contact Number"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.contact_no && !!errors.contact_no}
                  helperText={touched.contact_no && errors.contact_no}
                />
                <Field
                  as={TextField}
                  name="address"
                  label="Address"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.address && !!errors.address}
                  helperText={touched.address && errors.address}
                />
                <Field
                  as={TextField}
                  name="employee_no"
                  label="Assigned Coach"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.employee_no && !!errors.employee_no}
                  helperText={touched.employee_no && errors.employee_no}
                />
                <Field
                  as={TextField}
                  type="date"
                  name="joined_date"
                  label="Joined Date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.joined_date && !!errors.joined_date}
                  helperText={touched.joined_date && errors.joined_date}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: '20px', backgroundColor: '#791414' }}
                >
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </div>
    </div>
  );
};

export default EditPlayer;
