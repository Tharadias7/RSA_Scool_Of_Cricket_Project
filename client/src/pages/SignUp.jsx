import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import SideBar from "../components/SideBar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";

function SignUp() {

  const initialValues = {
    name: "",
    employee_no: "",
    contact_no: "",
    designation: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    employee_no: Yup.string(),
    contact_no: Yup.string().required("Contact number is required"),
    designation: Yup.string(),
    username: Yup.string().required("Username is required").max(25, "Username must be less than 26 characters"),
    password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters").max(25, "Password must be less than 26 characters"),
    confirm_password: Yup.string().required("Confirm password is required"),
  })

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/staff", data).then((response) => {   
      console.log("It worked") ;
    });
  };

  return (
    <div className="registerUserPage">
      <SideBar />
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form className="formContainer">
          <label>Name</label>
          <ErrorMessage name="name" component="span" style={{ color: "red" }} />
          <Field id="inputRegisterUser" name="name" />
          <label>Employee Number</label>
          <ErrorMessage name="employee_no" component="span" style={{ color: "red" }} />
          <Field id="inputRegisterUser" name="employee_no" />
          <label>Contact Number</label>
          <ErrorMessage name="contact_no" component="span" style={{ color: "red" }}/>
          <Field id="inputRegisterUser" name="contact_no" />
          <label>Designation</label>
          <ErrorMessage name="designation" component="span" style={{ color: "red" }}/>
          <Select id="designation" name="designation">
            <MenuItem value="">Select Designation</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Coach">Coach</MenuItem>
            <MenuItem value="Receptionist">Receptionist</MenuItem>
            <MenuItem value="InventoryManager">Inventory Manager</MenuItem>
          </Select>
          <label>Username</label>
          <ErrorMessage name="username" component="span" style={{ color: "red" }}/>
          <Field id="inputRegisterUser" name="username" />
          <label>Password</label>
          <ErrorMessage name="password" component="span" style={{ color: "red" }}/>
          <Field id="inputRegisterUser" name="password" />
          <label>Confirm Password</label>
          <ErrorMessage name="confirm_password" component="span" style={{ color: "red" }}/>
          <Field id="inputRegisterUser" name="confirm_password" />
          <button type="clear">Clear</button>
          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
}
export default SignUp;

// import * as React from "react";
// import SideBar from "../components/SideBar";
// import { Formik, Form } from "formik";
// import Button from "@mui/material/Button";
// import CssBaseline from "@mui/material/CssBaseline";
// import TextField from "@mui/material/TextField";
// import Box from "@mui/material/Box";
// import logoImage from "../assets/logo.png";
// import Typography from "@mui/material/Typography";
// import Container from "@mui/material/Container";
// import InputAdornment from "@mui/material/InputAdornment";
// import IconButton from "@mui/material/IconButton";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import * as Yup from "yup";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import axios from "axios";

// const defaultTheme = createTheme();

// const initialValues = {
//   first_name: "",
//   last_name: "",
//   designation: "",
//   contact_no: "",
//   username: "",
//   password: "",
//   confirm_password: "",
//   showPassword: false,
//   showConfirmPassword: false,
// };

// const validationSchema = Yup.object().shape({
//   password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
//   confirm_password: Yup.string().required("Confirm password is required").oneOf([Yup.ref("password"), null],"Passwords must match"),

// });

// export default function SignUp() {
// const [showPassword, setShowPassword] = React.useState(false);
// const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

// const handleClickShowPassword = () => setShowPassword((show) => !show);
// const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

// const handleMouseDownPassword = (event) => {
//   event.preventDefault();
// };

//   const onSubmit = (data) => {
//     console.log("form submitted",data);
//     axios.post("http://localhost:3001/user", data).then((response) => {
//       // setListOfUsers(response.data);
//       console.log("User Added Successfully!");
//     });
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "row" }}>
//       <SideBar />
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={onSubmit}
//       >
//         {({
//           values,
//           errors,
//           touched,
//           handleChange,
//           handleBlur,
//           isSubmitting,
//         }) => (
//           <Form  method="POST">
//             <ThemeProvider theme={defaultTheme}>
//               <Container component="main" maxWidth="md">
//                 <CssBaseline />
//                 <Box
//                   sx={{
//                     marginLeft: 40,
//                     padding: 5,
//                     display: "flex",
//                     border: "none",
//                     flexDirection: "column",
//                     alignItems: "center",
//                   }}
//                 >
//                   <img
//                     src={logoImage}
//                     alt="Lock"
//                     style={{
//                       width: "100px",
//                       height: "100px",
//                       alignSelf: "center",
//                     }}
//                   />

//                   <Typography
//                     component="h1"
//                     variant="h5"
//                     style={{ alignSelf: "center", marginBottom: "35px" }}
//                   >
//                     Sign Up
//                   </Typography>
//                   <Box
//                     component="form"
//                     noValidate
//                     sx={{ mt: 1 }}
//                   >
//                     <div style={{ display: "flex", flexDirection: "row" }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           flexDirection: "row",
//                           alignItems: "center",
//                           marginBottom: "10px",
//                         }}
//                       >
//                         <label
//                           htmlFor="first_name"
//                           style={{
//                             marginRight: "1rem",
//                             minWidth: "100px",
//                           }}
//                         >
//                           First Name:
//                         </label>
//                         <TextField
//                           margin="normal"
//                           required
//                           fullWidth
//                           id="first_name"
//                           label="First Name"
//                           name="first_name"
//                           value={values.first_name}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           autoFocus
//                           error={
//                             touched.first_name && Boolean(errors.first_name)
//                           }
//                           helperText={touched.first_name && errors.first_name}
//                         />
//                       </div>

//                       <div
//                         style={{
//                           display: "flex",
//                           flexDirection: "row",
//                           alignItems: "center",
//                           marginBottom: "10px",
//                         }}
//                       >
//                         <label
//                           htmlFor="last_name"
//                           style={{
//                             marginLeft: "1rem",
//                             marginRight: "1rem",
//                             minWidth: "100px",
//                           }}
//                         >
//                           Last Name:
//                         </label>
//                         <TextField
//                           margin="normal"
//                           required
//                           fullWidth
//                           id="last_name"
//                           label="Last Name"
//                           name="last_name"
//                           value={values.last_name}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           autoFocus
//                           error={touched.last_name && Boolean(errors.last_name)}
//                           helperText={touched.last_name && errors.last_name}
//                         />
//                       </div>
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         alignItems: "center",
//                         marginBottom: "10px",
//                       }}
//                     >
//                       <label
//                         htmlFor="address"
//                         style={{
//                           marginRight: "1rem",
//                           minWidth: "100px",
//                         }}
//                       >
//                         Address:
//                       </label>
//                       <TextField
//                         margin="normal"
//                         required
//                         fullWidth
//                         id="address"
//                         label="Address"
//                         name="address"
//                         value={values.address}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         autoFocus
//                         error={touched.address && Boolean(errors.address)}
//                         helperText={touched.address && errors.address}
//                       />
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         alignItems: "center",
//                         marginBottom: "10px",
//                       }}
//                     >
//                       <label
//                         htmlFor="designation"
//                         style={{
//                           marginRight: "1rem",
//                           minWidth: "100px",
//                         }}
//                       >
//                         Designation:
//                       </label>
//                       <Select
//                         margin="normal"
//                         required
//                         fullWidth
//                         color="primary"
//                         id="designation"
//                         label="Designation"
//                         name="designation"
//                         value={values.designation}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         autoFocus
//                       >
//                         <MenuItem value="">Select Designation</MenuItem>
//                         <MenuItem value="Manager">Manager</MenuItem>
//                         <MenuItem value="Coach">Coach</MenuItem>
//                         <MenuItem value="Receptionist">Receptionist</MenuItem>
//                         <MenuItem value="InventoryManager">
//                           Inventory Manager
//                         </MenuItem>
//                       </Select>
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         alignItems: "center",
//                         marginBottom: "10px",
//                       }}
//                     >
//                       <label
//                         htmlFor="qualifications"
//                         style={{
//                           marginRight: "1rem",
//                           minWidth: "100px",
//                         }}
//                       >
//                         Qualifications:
//                       </label>
//                       <TextField
//                         margin="normal"
//                         required
//                         fullWidth
//                         id="qualifiacations"
//                         label="Qualifications"
//                         name="qualifications"
//                         value={values.qualifications}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         autoFocus
//                         error={touched.qualifications && Boolean(errors.qualifications)}
//                         helperText={touched.qualifications && errors.qualifications}
//                       />
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         alignItems: "center",
//                         marginBottom: "10px",
//                       }}
//                     >
//                       <label
//                         htmlFor="contact_no"
//                         style={{
//                           marginRight: "1rem",
//                           minWidth: "100px",
//                         }}
//                       >
//                         Contact Number:
//                       </label>
//                       <TextField
//                         margin="normal"
//                         required
//                         fullWidth
//                         id="contact_no"
//                         label="Contact Number"
//                         name="contact_no"
//                         value={values.contact_no}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         autoFocus
//                         error={touched.contact_no && Boolean(errors.contact_no)}
//                         helperText={touched.contact_no && errors.contact_no}
//                       />
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         alignItems: "center",
//                         marginBottom: "10px",
//                       }}
//                     >
//                       <label
//                         htmlFor="username"
//                         style={{
//                           marginRight: "1rem",
//                           minWidth: "100px",
//                         }}
//                       >
//                         Username:
//                       </label>
//                       <TextField
//                         margin="normal"
//                         required
//                         fullWidth
//                         id="username"
//                         label="Username"
//                         name="username"
//                         value={values.username}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         autoFocus
//                         error={touched.username && Boolean(errors.username)}
//                         helperText={touched.username && errors.username}
//                       />
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         alignItems: "center",
//                         marginBottom: "10px",
//                       }}
//                     >
//                       <label
//                         htmlFor="password"
//                         style={{
//                           marginRight: "1rem",
//                           minWidth: "100px",
//                         }}
//                       >
//                         Password:
//                       </label>
//                       <TextField
//                         margin="normal"
//                         required
//                         fullWidth
//                         name="password"
//                         label="Password"
//                         type={showPassword ? "text" : "password"}
//                         helperText={touched.password && errors.password}
//                         id="password"
//                         value={values.password}
//                         error={touched.password && Boolean(errors.password)}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
// InputProps={{
//   endAdornment: (
//     <InputAdornment position="end">
//       <IconButton
//         aria-label="toggle password visibility"
//         onClick={handleClickShowPassword}
//         onMouseDown={handleMouseDownPassword}
//         edge="end"
//       >
//         {showPassword ? (
//           <VisibilityOff />
//         ) : (
//           <Visibility />
//         )}
//       </IconButton>
//     </InputAdornment>
//   ),
// }}
//                       />
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         alignItems: "center",
//                         marginBottom: "10px",
//                       }}
//                     >
//                       <label
//                         htmlFor="confirm_password"
//                         style={{
//                           marginRight: "1rem",
//                           minWidth: "100px",
//                         }}
//                       >
//                         Confirm Password:
//                       </label>
//                       <TextField
//                         margin="normal"
//                         required
//                         fullWidth
//                         id="confirm_password"
//                         label="Confirm Password"
//                         name="confirm_password"
//                         type={showConfirmPassword ? "text" : "password"}
//                         helperText={
//                           touched.confirm_password && errors.confirm_password
//                         }
//                         value={values.confirm_password}
//                         error={
//                           touched.confirm_password &&
//                           Boolean(errors.confirm_password)
//                         }
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         InputProps={{
//                           endAdornment: (
//                             <InputAdornment position="end">
//                               <IconButton
//                                 aria-label="toggle password visibility"
//                                 onClick={handleClickShowConfirmPassword}
//                                 onMouseDown={handleMouseDownPassword}
//                                 edge="end"
//                               >
//                                 {showConfirmPassword ? (
//                                   <VisibilityOff />
//                                 ) : (
//                                   <Visibility />
//                                 )}
//                               </IconButton>
//                             </InputAdornment>
//                           ),
//                         }}
//                       />
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         alignItems: "center",
//                         marginBottom: "10px",
//                       }}
//                     >
//                       <div style={{ marginRight: "5rem" }}>
//                         <Button
//                           type="clear"
//                           MediumWidth
//                           variant="contained"
//                           disabled={isSubmitting}
//                           sx={{
//                             mt: 3,
//                             mb: 2,
//                             backgroundColor: "#791414", // Set the background color
//                             "&:hover": {
//                               backgroundColor: "#ffffff", // Change color on hover if needed
//                               color: "#791414",
//                               border: "2px solid #791414",
//                             },
//                           }}
//                         >
//                           {isSubmitting ? "Clearing..." : "Clear"}
//                         </Button>
//                       </div>

//                       <Button
//                         type="submit"
//                         MediumWidth
//                         variant="contained"
//                         disabled={isSubmitting}
//                         sx={{
//                           mt: 3,
//                           mb: 2,
//                           backgroundColor: "#791414", // Set the background color
//                           "&:hover": {
//                             backgroundColor: "#ffffff", // Change color on hover if needed
//                             color: "#791414",
//                             border: "2px solid #791414",
//                           },
//                         }}
//                       >
//                         {isSubmitting ? "Signing in..." : "Sign In"}
//                       </Button>
//                     </div>
//                   </Box>
//                 </Box>
//               </Container>
//             </ThemeProvider>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// }
