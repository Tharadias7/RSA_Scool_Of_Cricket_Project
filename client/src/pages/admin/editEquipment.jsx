import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Button, TextField, Typography, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import logoImage from '../../assets/logo.png';
import SideBar from '../../components/SideBar';
import Swal from 'sweetalert2';

const EquipmentSchema = Yup.object().shape({
  stockId: Yup.string().required('Stock ID is required'),
  item: Yup.string().required('Item is required'),
  brand: Yup.string().required('Brand is required'),
  totalItems: Yup.number().required('Total Items is required').integer('Must be an integer').positive('Must be positive'),
});

const EditEquipment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { equipment } = location.state || {};
  const [equipmentData, setEquipmentData] = useState(equipment);

  useEffect(() => {
    if (!equipment) {
      navigate('/equipment'); // Redirect to equipment list if no equipment data is found
    }
  }, [equipment, navigate]);

  const handleSubmit = async (values) => {
    try {
      await axios.put(`http://localhost:3001/equipment/${values.stockId}`, values);

      // Show success message using SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Equipment data updated successfully!',
        confirmButtonColor: '#791414',
      });

      navigate('/equipment');
    } catch (error) {
      console.error('Error updating equipment', error);
      
      // Show error message using SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error updating equipment data.',
        confirmButtonColor: '#791414',
      });
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex' }}>
      <SideBar />
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
          <img src={logoImage} alt="logo" style={{ width: '200px', height: 'auto', marginBottom: '20px' }} />
          <Typography component="h1" variant="h5">
            Edit Equipment Data
          </Typography>
          <Formik
            initialValues={{
              stockId: equipmentData?.stockId || '',
              item: equipmentData?.item || '',
              brand: equipmentData?.brand || '',
              totalItems: equipmentData?.totalItems || '',
            }}
            validationSchema={EquipmentSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched }) => (
              <Form style={{ display: 'flex', flexDirection: 'column', width: '300px', marginTop: '20px' }}>
                <Field
                  as={TextField}
                  name="stockId"
                  label="Stock ID"
                  variant="outlined"
                  margin="normal"
                  disabled
                  fullWidth
                  error={touched.stockId && !!errors.stockId}
                  helperText={touched.stockId && errors.stockId}
                />
                <FormControl variant="outlined" margin="normal" fullWidth>
                  <InputLabel id="item-label">Item</InputLabel>
                  <Field
                    as={Select}
                    labelId="item-label"
                    id="item"
                    name="item"
                    label="Item"
                    value={equipmentData?.item || ''}
                    onChange={(e) => setEquipmentData({ ...equipmentData, item: e.target.value })}
                    error={touched.item && !!errors.item}
                  >
                    <MenuItem value="Bat">Bat</MenuItem>
                    <MenuItem value="Ball">Ball</MenuItem>
                    <MenuItem value="Gloves">Gloves</MenuItem>
                    <MenuItem value="Helmet">Helmet</MenuItem>
                    <MenuItem value="Wicket stumps">Wicket stumps</MenuItem>
                    <MenuItem value="Bails">Bails</MenuItem>
                    <MenuItem value="Cricket nets">Cricket nets</MenuItem>
                    <MenuItem value="Mobile Cages">Mobile Cages</MenuItem>
                    <MenuItem value="Cricket Bag">Cricket Bag</MenuItem>
                    <MenuItem value="Grip Tape">Grip Tape</MenuItem>
                    <MenuItem value="Abdo Guard">Abdo Guard</MenuItem>
                    <MenuItem value="Cricket Pads">Cricket Pads</MenuItem>
                    <MenuItem value="Cricket Boots">Cricket Boots</MenuItem>
                  </Field>
                  <ErrorMessage name="item" component="div" style={{ color: 'red', marginTop: '10px' }} />
                </FormControl>
                <Field
                  as={TextField}
                  name="brand"
                  label="Brand"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.brand && !!errors.brand}
                  helperText={touched.brand && errors.brand}
                />
                <Field
                  as={TextField}
                  name="totalItems"
                  label="Total Items"
                  type="number"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.totalItems && !!errors.totalItems}
                  helperText={touched.totalItems && errors.totalItems}
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

export default EditEquipment;
