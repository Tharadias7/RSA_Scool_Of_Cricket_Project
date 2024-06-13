import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Button, TextField, Typography, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import logoImage from '../../assets/logo.png';
import SideBar from '../../components/SideBar';
import Swal from 'sweetalert2';
import Profile from '../../components/profile';

const UniformSchema = Yup.object().shape({
  stockId: Yup.string().required('Stock ID is required'),
  item: Yup.string().required('Item is required'),
  size: Yup.string().required('Size is required'),
  unitPrice: Yup.number().required('Unit Price is required').positive('Must be positive'),
  currentStock: Yup.number().required('Current Stock is required').integer('Must be an integer').positive('Must be positive'),
});

const EditUniform = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { uniform } = location.state || {};
  const [uniformData, setUniformData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/uniform/${uniform.stockId}`);
        setUniformData(response.data);
        console.log("Uniform data:", response.data);
      } catch (error) {
        console.error('Error fetching uniform data', error);
      }
    };
    fetchData();
  }, [uniform.stockId]);

  const handleSubmit = async (values) => {
    try {
      await axios.put(`http://localhost:3001/uniform/${values.stockId}`, values);

      // Show success message using SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Uniform data updated successfully!',
        confirmButtonColor: '#791414',
      });

      navigate('/uniform');
    } catch (error) {
      console.error('Error updating uniform', error);
      
      // Show error message using SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error updating uniform data.',
        confirmButtonColor: '#791414',
      });
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex' }}>
      <SideBar />
      <div className="profileBox">
        <Profile />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '40px', }}>
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
            Edit Uniform Data
          </Typography>
          <Formik
            initialValues={{
              ...uniformData,
              stockId: uniformData.stockId || '',
              item: uniformData.item || '',
              size: uniformData.size || '',
              unitPrice: uniformData.unitPrice || '',
              currentStock: uniformData.currentStock || '',
            }}
            validationSchema={UniformSchema}
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
                    error={touched.item && !!errors.item}
                  >
                    <MenuItem value="Jersey">Jersey</MenuItem>
                    <MenuItem value="Pants">Pants</MenuItem>
                    <MenuItem value="Cap">Cap</MenuItem>
                    <MenuItem value="Socks">Socks</MenuItem>
                    <MenuItem value="Shoes">Shoes</MenuItem>
                  </Field>
                  <ErrorMessage name="item" component="div" style={{ color: 'red', marginTop: '10px' }} />
                </FormControl>
                <FormControl variant="outlined" margin="normal" fullWidth>
                  <InputLabel id="size-label">Size</InputLabel>
                  <Field
                    as={Select}
                    labelId="size-label"
                    id="size"
                    name="size"
                    label="Size"
                    error={touched.size && !!errors.size}
                  >
                    <MenuItem value="XS">XS</MenuItem>
                    <MenuItem value="S">S</MenuItem>
                    <MenuItem value="M">M</MenuItem>
                    <MenuItem value="L">L</MenuItem>
                    <MenuItem value="XL">XL</MenuItem>
                  </Field>
                  <ErrorMessage name="size" component="div" style={{ color: 'red', marginTop: '10px' }} />
                </FormControl>
                <Field
                  as={TextField}
                  name="unitPrice"
                  label="Unit Price (Rs.)"
                  type="number"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.unitPrice && !!errors.unitPrice}
                  helperText={touched.unitPrice && errors.unitPrice}
                />
                <Field
                  as={TextField}
                  name="currentStock"
                  label="Current Stock"
                  type="number"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.currentStock && !!errors.currentStock}
                  helperText={touched.currentStock && errors.currentStock}
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

export default EditUniform;
