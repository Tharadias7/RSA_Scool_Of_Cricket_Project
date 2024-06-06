// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import { Button, TextField, Typography, Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
// import Swal from "sweetalert2";
// import logoImage from "../../assets/logo.png";
// import SideBar from "../../components/SideBar";

// const PurchaseSchema = Yup.object().shape({
//   playerId: Yup.string().required('Player ID is required'),
//   date: Yup.date().required('Date is required'),
//   unitPrice: Yup.number().required('Unit Price is required').positive('Must be positive'),
//   quantity: Yup.number().required('Quantity is required').integer('Must be an integer').positive('Must be positive'),
//   item: Yup.string().required('Item is required'),
//   size: Yup.string().required('Size is required'),
// });

// const formatDate = (date) => {
//   const d = new Date(date);
//   return d.toISOString().split('T')[0];
// };

// const EditPurchase = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { purchase } = location.state || {};
//   const [purchaseData, setPurchaseData] = useState(purchase);
//   const [activePlayers, setActivePlayers] = useState([]);
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchActivePlayers = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/player");
//         setActivePlayers(response.data);
//       } catch (error) {
//         console.error("Error fetching active players:", error);
//       }
//     };

//     const fetchItems = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/uniform/item");
//         setItems(response.data.map(item => item.item));
//       } catch (error) {
//         console.error("Error fetching items:", error);
//       }
//     };

//     fetchActivePlayers();
//     fetchItems();
//   }, []);

//   const fetchEarliestStock = async (item, size) => {
//     try {
//       const response = await axios.get("http://localhost:3001/uniform/earliest", {
//         params: { item, size },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching stock data:", error);
//       return null;
//     }
//   };

//   const handleItemSizeChange = async (setFieldValue, item, size) => {
//     const stock = await fetchEarliestStock(item, size);
//     if (stock) {
//       setFieldValue('stockId', stock.stockId);
//     } else {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'No stock found for the selected item and size.',
//         confirmButtonColor: '#791414',
//       });
//     }
//   };

//   const handleSubmit = async (values) => {
//     try {
//       await axios.put(`http://localhost:3001/purchase/${values.transactionId}`, values);

//       Swal.fire({
//         icon: 'success',
//         title: 'Success',
//         text: 'Purchase updated successfully!',
//         confirmButtonColor: '#791414',
//       });

//       navigate('/purchases');
//     } catch (error) {
//       console.error('Error updating purchase', error);

//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Error updating purchase data.',
//         confirmButtonColor: '#791414',
//       });
//     }
//   };

//   return (
//     <div style={{ width: '100%', display: 'flex' }}>
//       <SideBar />
//       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             height: '100vh',
//             bgcolor: 'background.paper',
//           }}
//         >
//           <img src={logoImage} alt="logo" style={{ width: '200px', height: 'auto', marginBottom: '20px' }} />
//           <Typography component="h1" variant="h5">
//             Edit Purchase Data
//           </Typography>
//           <Formik
//             initialValues={{
//               transactionId: purchaseData?.transactionId || '',
//               playerId: purchaseData?.playerId || '',
//               date: purchaseData ? formatDate(purchaseData.date) : '',
//               unitPrice: purchaseData?.unitPrice || '',
//               quantity: purchaseData?.quantity || '',
//               stockId: purchaseData?.stockId || '',
//               item: purchaseData?.item || '',
//               size: purchaseData?.size || '',
//             }}
//             validationSchema={PurchaseSchema}
//             onSubmit={handleSubmit}
//             enableReinitialize
//           >
//             {({ errors, touched, setFieldValue, values }) => (
//               <Form style={{ display: 'flex', flexDirection: 'column', width: '300px', marginTop: '20px' }}>
//                 <FormControl variant="outlined" margin="normal" fullWidth>
//                   <InputLabel id="playerId-label">Player ID</InputLabel>
//                   <Field
//                     as={Select}
//                     labelId="playerId-label"
//                     id="playerId"
//                     name="playerId"
//                     label="Player ID"
//                     error={touched.playerId && !!errors.playerId}
//                   >
//                     {activePlayers.map((player) => (
//                       <MenuItem key={player.playerId} value={player.playerId}>
//                         {player.playerId}
//                       </MenuItem>
//                     ))}
//                   </Field>
//                   <ErrorMessage name="playerId" component="div" style={{ color: 'red', marginTop: '10px' }} />
//                 </FormControl>
//                 <Field
//                   as={TextField}
//                   name="unitPrice"
//                   label="Unit Price"
//                   variant="outlined"
//                   margin="normal"
//                   fullWidth
//                   error={touched.unitPrice && !!errors.unitPrice}
//                   helperText={touched.unitPrice && errors.unitPrice}
//                 />
//                 <Field
//                   as={TextField}
//                   name="quantity"
//                   label="Quantity"
//                   variant="outlined"
//                   margin="normal"
//                   fullWidth
//                   error={touched.quantity && !!errors.quantity}
//                   helperText={touched.quantity && errors.quantity}
//                 />
//                 <FormControl variant="outlined" margin="normal" fullWidth>
//                   <InputLabel id="item-label">Item</InputLabel>
//                   <Field
//                     as={Select}
//                     labelId="item-label"
//                     id="item"
//                     name="item"
//                     label="Item"
//                     error={touched.item && !!errors.item}
//                     onChange={(e) => {
//                       setFieldValue('item', e.target.value);
//                       handleItemSizeChange(setFieldValue, e.target.value, values.size);
//                     }}
//                   >
//                     {items.map((item) => (
//                       <MenuItem key={item} value={item}>
//                         {item}
//                       </MenuItem>
//                     ))}
//                   </Field>
//                   <ErrorMessage name="item" component="div" style={{ color: 'red', marginTop: '10px' }} />
//                 </FormControl>
//                 <FormControl variant="outlined" margin="normal" fullWidth>
//                   <InputLabel id="size-label">Size</InputLabel>
//                   <Field
//                     as={Select}
//                     labelId="size-label"
//                     id="size"
//                     name="size"
//                     label="Size"
//                     error={touched.size && !!errors.size}
//                     onChange={(e) => {
//                       setFieldValue('size', e.target.value);
//                       handleItemSizeChange(setFieldValue, values.item, e.target.value);
//                     }}
//                   >
//                   <MenuItem value="XS">XS</MenuItem>
//                     <MenuItem value="S">S</MenuItem>
//                     <MenuItem value="M">M</MenuItem>
//                     <MenuItem value="L">L</MenuItem>
//                     <MenuItem value="XL">XL</MenuItem>
//                     <MenuItem value="XXL">XXL</MenuItem>
//                   </Field>
//                   <ErrorMessage name="size" component="div" style={{ color: 'red', marginTop: '10px' }} />
//                 </FormControl>
//                 <Field
//                   as={TextField}
//                   name="stockId"
//                   label="Stock ID"
//                   variant="outlined"
//                   margin="normal"
//                   fullWidth
//                   disabled
//                   error={touched.stockId && !!errors.stockId}
//                   helperText={touched.stockId && errors.stockId}
//                 />
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   sx={{ marginTop: '20px', backgroundColor: '#791414' }}
//                 >
//                   Update
//                 </Button>
//               </Form>
//             )}
//           </Formik>
//         </Box>
//       </div>
//     </div>
//   );
// };

// export default EditPurchase;



import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Button, TextField, Typography, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Swal from 'sweetalert2';
import logoImage from '../../assets/logo.png';
import SideBar from '../../components/SideBar';

const PurchaseSchema = Yup.object().shape({
  transactionId: Yup.string().required('Transaction ID is required'),
  date: Yup.date().required('Date is required'),
  unitPrice: Yup.number().required('Unit Price is required').positive('Must be positive'),
  quantity: Yup.number().required('Quantity is required').integer('Must be an integer').positive('Must be positive'),
  size: Yup.string().required('Size is required'),
  item: Yup.string().required('Item is required'),
  playerId: Yup.string().required('Player ID is required'),
});

const EditPurchases = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { purchase } = location.state || {};
  const [purchaseData, setPurchaseData] = useState(purchase);
  const [activePlayers, setActivePlayers] = useState([]);
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    if (!purchase) {
      navigate('/purchases'); // Redirect to purchases list if no purchase data is found
    }
  }, [purchase, navigate]);

  useEffect(() => {
    const fetchActivePlayers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/player');
        setActivePlayers(response.data);
      } catch (error) {
        console.error('Error fetching active players:', error);
      }
    };

    fetchActivePlayers();
  }, []);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/stock');
        setStockData(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockData();
  }, []);


  const handleSubmit = async (values) => {
    try {
      await axios.put(`http://localhost:3001/purchase/${values.transactionId}`, values);

      // Show success message using SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Purchase data updated successfully!',
        confirmButtonColor: '#791414',
      });

      navigate('/purchases');
    } catch (error) {
      console.error('Error updating purchase', error);

      // Show error message using SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error updating purchase data.',
        confirmButtonColor: '#791414',
      });
    }
  };

  const validate = (values) => {
    const errors = {};
    
    if (!activePlayers.some(player => player.playerId === values.playerId)) {
      errors.playerId = 'Invalid Player';
    }

    return errors;
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
            Edit Purchase Data
          </Typography>
          <Formik
            initialValues={{
              transactionId: purchaseData?.transactionId || '',
              date: purchaseData?.date ? purchaseData.date.split('T')[0] : '',
              unitPrice: purchaseData?.unitPrice || '',
              quantity: purchaseData?.quantity || '',
              size: purchaseData?.size || '',
              item: purchaseData?.item || '',
              playerId: purchaseData?.playerId || '',
            }}
            validationSchema={PurchaseSchema}
            validate={validate}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, setFieldValue }) => (
              <Form style={{ display: 'flex', flexDirection: 'column', width: '300px', marginTop: '20px' }}>
                <Field
                  as={TextField}
                  name="transactionId"
                  label="Transaction ID"
                  variant="outlined"
                  margin="normal"
                  disabled
                  fullWidth
                  error={touched.transactionId && !!errors.transactionId}
                  helperText={touched.transactionId && errors.transactionId}
                />
                <Field
                  as={TextField}
                  name="unitPrice"
                  label="Unit Price"
                  type="number"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.unitPrice && !!errors.unitPrice}
                  helperText={touched.unitPrice && errors.unitPrice}
                />
                <Field
                  as={TextField}
                  name="quantity"
                  label="Quantity"
                  type="number"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.quantity && !!errors.quantity}
                  helperText={touched.quantity && errors.quantity}
                />
                <Field
                  as={TextField}
                  name="size"
                  label="Size"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.size && !!errors.size}
                  helperText={touched.size && errors.size}
                />
                <Field
                  as={TextField}
                  name="item"
                  label="Item"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.item && !!errors.item}
                  helperText={touched.item && errors.item}
                />
                <FormControl variant="outlined" margin="normal" fullWidth>
                  <InputLabel id="playerId-label">Player ID</InputLabel>
                  <Field
                    as={Select}
                    labelId="playerId-label"
                    id="playerId"
                    name="playerId"
                    label="Player ID"
                    fullWidth
                    error={touched.playerId && !!errors.playerId}
                  >
                    {activePlayers.map((player) => (
                      <MenuItem key={player.playerId} value={player.playerId}>
                        {player.playerId}
                      </MenuItem>
                    ))}
                  </Field>
                  <ErrorMessage name="playerId" component="div" style={{ color: 'red', marginTop: '10px' }} />
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                  fullWidth
                >
                  Update Purchase
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </div>
    </div>
  );
};

export default EditPurchases;
