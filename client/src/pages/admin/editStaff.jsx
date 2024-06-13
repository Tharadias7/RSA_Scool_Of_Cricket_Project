import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Button, TextField, Typography, Box, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import logo from '../../assets/logo.png';
import SideBar from '../../components/SideBar';
import Profile from '../../components/profile';

const StaffSchema = Yup.object().shape({
  employee_no: Yup.string().required('Employee No is required'),
  name: Yup.string().required('Name is required'),
  designation: Yup.string().required('Designation is required'),
  contact_no: Yup.string().required('Contact Number is required'),
});

const EditStaff = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { staff } = location.state || {};
  const [designations, setDesignations] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchData = async () => {
      try {
  
        // Fetch distinct designations
        const designationsResponse = await axios.get('http://localhost:3001/staff/designations');
        setDesignations(designationsResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, [staff.employee_no, staff.designation]);

  const handleSubmit = async (values) => {
    try {
      // Update staff data
      await axios.put(`http://localhost:3001/staff/${values.employee_no}`, values);
  
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Staff data updated successfully!',
      });
  
      navigate('/staff');
    } catch (error) {
      console.error('Error updating staff', error);
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error updating staff data.',
      });
    }
  };
  
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  

  return (
    <div style={{ width: '100%', display: "flex" }}>
      <SideBar />
      <div className="profileBox">
        <Profile />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '80px' }}>
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
          <img src={logo} alt="logo" style={{ width: '120px', height: 'auto', marginBottom: '20px' }} />
          <Typography component="h1" variant="h5">
            Edit Staff Data
          </Typography>
          <Formik
            initialValues={{
              ...staff,
              // username: userData.username || '',
              // assigned_team: coachData.assigned_team || '',
              // qualifications: coachData.qualifications || '',
            }}
            validationSchema={StaffSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched }) => (
              <Form style={{ display: 'flex', flexDirection: 'column', width: '300px', marginTop: '20px' }}>
                <Field
                  as={TextField}
                  name="employee_no"
                  label="Employee No"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  disabled
                  error={touched.employee_no && !!errors.employee_no}
                  helperText={touched.employee_no && errors.employee_no}
                />
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
                <FormControl variant="outlined" margin="normal" fullWidth error={touched.designation && !!errors.designation}>
                  <InputLabel id="designation-label">Designation</InputLabel>
                  <Field
                    as={Select}
                    name="designation"
                    labelId="designation-label"
                    label="Designation"
                  >
                    {designations.map((designation) => (
                      <MenuItem key={designation} value={designation}>
                        {designation}
                      </MenuItem>
                    ))}
                  </Field>
                  {touched.designation && errors.designation && (
                    <Typography variant="caption" color="error">
                      {errors.designation}
                    </Typography>
                  )}
                </FormControl>
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
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </div>
    </div>
  );
};

export default EditStaff;




// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
// import axios from 'axios';
// import { Button, TextField, Typography, Box, Snackbar, Alert } from '@mui/material';
// import logo from '../../assets/logo.png';
// import SideBar from '../../components/SideBar';
// import Profile from '../../components/profile';

// const StaffSchema = Yup.object().shape({
//   employee_no: Yup.string().required('Employee No is required'),
//   name: Yup.string().required('Name is required'),
//   designation: Yup.string().required('Designation is required'),
//   contact_no: Yup.string().required('Contact Number is required'),
//   username: Yup.string().required('Username is required'),
//   password: Yup.string().required('Password is required'),
//   assigned_team: Yup.string().when('designation', {
//     is: 'Coach',
//     then: Yup.string().required('Assigned Team is required'),
//   }),
//   qualifications: Yup.string().when('designation', {
//     is: 'Coach',
//     then: Yup.string().required('Qualifications are required'),
//   }),
// });

// const EditStaff = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { staff } = location.state || {};
//   const [userData, setUserData] = useState({});
//   const [coachData, setCoachData] = useState({});
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarSeverity, setSnackbarSeverity] = useState('success');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch user data
//         const userResponse = await axios.get(`http://localhost:3001/users/${staff.employee_no}`);
//         setUserData(userResponse.data);
//         console.log("user:", userResponse.data);

//         // Fetch coach data if the designation is 'Coach'
//         if (staff.designation === 'Coach') {
//           const coachResponse = await axios.get(`http://localhost:3001/coaches/${staff.employee_no}`);
//           setCoachData(coachResponse.data);
//           console.log("coach:", coachResponse.data);
//         }
//       } catch (error) {
//         console.error('Error fetching user or coach data', error);
//       }
//     };
//     fetchData();
//   }, [staff.employee_no, staff.designation]);

//   const handleSubmit = async (values) => {
//     try {
//       // Update user data
//       await axios.put(`http://localhost:3001/users/${values.employee_no}`, {
//         username: values.username,
//         password: values.password,
//       });

//       // Update staff data
//       await axios.put(`http://localhost:3001/staff/${values.employee_no}`, values);

//       // Update coach data if the designation is 'Coach'
//       if (values.designation === 'Coach') {
//         await axios.put(`http://localhost:3001/coaches/${values.employee_no}`, {
//           assigned_team: values.assigned_team,
//           qualifications: values.qualifications,
//         });
//       }

//       setSnackbarMessage('Staff data updated successfully!');
//       setSnackbarSeverity('success');
//       setOpenSnackbar(true);
//       navigate('/staff');
//     } catch (error) {
//       console.error('Error updating staff', error);
//       setSnackbarMessage('Error updating staff data.');
//       setSnackbarSeverity('error');
//       setOpenSnackbar(true);
//     }
//   };

//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false);
//   };

//   return (
//     <div style={{ width: '100%', display: "flex" }}>
//       <SideBar />
//       <div className="profileBox" >
//         <Profile />
//       </div>
//       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '80px' }}>
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
//           <img src={logo} alt="logo" style={{ width: '120px', height: 'auto', marginBottom: '20px' }} />
//           <Typography component="h1" variant="h5">
//             Edit Staff Data
//           </Typography>
//           <Formik
//             initialValues={{
//               ...staff,
//               username: userData.username || '',
//               password: '',
//               assigned_team: coachData.assigned_team || '',
//               qualifications: coachData.qualifications || '',
//             }}
//             validationSchema={StaffSchema}
//             onSubmit={handleSubmit}
//             enableReinitialize
//           >
//             {({ errors, touched }) => (
//               <Form style={{ display: 'flex', flexDirection: 'column', width: '300px', marginTop: '20px' }}>
//                 <Field
//                   as={TextField}
//                   name="employee_no"
//                   label="Employee No"
//                   variant="outlined"
//                   margin="normal"
//                   fullWidth
//                   disabled
//                   error={touched.employee_no && !!errors.employee_no}
//                   helperText={touched.employee_no && errors.employee_no}
//                 />
//                 <Field
//                   as={TextField}
//                   name="name"
//                   label="Name"
//                   variant="outlined"
//                   margin="normal"
//                   fullWidth
//                   error={touched.name && !!errors.name}
//                   helperText={touched.name && errors.name}
//                 />
//                 <Field
//                   as={TextField}
//                   name="designation"
//                   label="Designation"
//                   variant="outlined"
//                   margin="normal"
//                   fullWidth
//                   error={touched.designation && !!errors.designation}
//                   helperText={touched.designation && errors.designation}
//                 />
//                 <Field
//                   as={TextField}
//                   name="contact_no"
//                   label="Contact Number"
//                   variant="outlined"
//                   margin="normal"
//                   fullWidth
//                   error={touched.contact_no && !!errors.contact_no}
//                   helperText={touched.contact_no && errors.contact_no}
//                 />
//                 <Field
//                   as={TextField}
//                   name="username"
//                   label="Username"
//                   variant="outlined"
//                   margin="normal"
//                   fullWidth
//                   error={touched.username && !!errors.username}
//                   helperText={touched.username && errors.username}
//                 />
//                 {staff.designation === 'Coach' && (
//                   <>
//                     <Field
//                       as={TextField}
//                       name="assigned_team"
//                       label="Assigned Team"
//                       variant="outlined"
//                       margin="normal"
//                       fullWidth
//                       error={touched.assigned_team && !!errors.assigned_team}
//                       helperText={touched.assigned_team && errors.assigned_team}
//                     />
//                     <Field
//                       as={TextField}
//                       name="qualifications"
//                       label="Qualifications"
//                       variant="outlined"
//                       margin="normal"
//                       fullWidth
//                       error={touched.qualifications && !!errors.qualifications}
//                       helperText={touched.qualifications && errors.qualifications}
//                     />
//                   </>
//                 )}
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
//           <Snackbar
//             open={openSnackbar}
//             autoHideDuration={6000}
//             onClose={handleCloseSnackbar}
//           >
//             <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
//               {snackbarMessage}
//             </Alert>
//           </Snackbar>
//         </Box>
//       </div>
//     </div>
//   );
// };

// export default EditStaff;
