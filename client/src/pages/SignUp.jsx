import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import SideBar from "../components/SideBar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import logoImage from "../assets/logo.png";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";

function SignUp() {
  const [des, setDes] = React.useState("");
  const [showCoachFields, setShowCoachFields] = React.useState(false);

  const handleSelectChange = (event) => {
    console.log("ID  " + event.target.id);
    setDes(event.target.id);
    setShowCoachFields(event.target.id === "coach");
  };

  const initialValues = {
    name: "",
    employee_no: "",
    contact_no: "",
    designation: "",
    qualification: "",
    assigned_team: "",
    username: "",
    password: "",
    confirm_password: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    employee_no: Yup.string(),
    contact_no: Yup.string().required("Contact number is required"),
    designation: Yup.string(),
    qualification: Yup.string(),
    assigned_team: Yup.string(),
    username: Yup.string()
      .required("Username is required")
      .max(25, "Username must be less than 26 characters"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(25, "Password must be less than 26 characters"),
    confirm_password: Yup.string().required("Confirm password is required"),
  });

  const onSubmit = async (data, { setSubmitting }) => {
    try {
      setSubmitting(true);

      const staffData = {
        name: data.name,
        designation: des,
        contact_no: data.contact_no,
        qualification: data.qualification,
        assigned_team: data.assigned_team,
      };

      const response = await axios.post(
        "http://localhost:3001/staff",
        staffData
      );
      const employeeNo = response.data.employee_no;

      const userData = {
        username: data.username,
        password: data.password,
        role: des,
        employee_no: data.employeeNo,
      };

      await axios.post("http://localhost:3001/user", userData);

      const coachData = {
        employee_no: employeeNo,
        qualifications: data.qualification,
        assigned_team: data.assigned_team,
      };

      await axios.post("http://localhost:3001/coach", coachData);

      console.log("User and staff created successfully");

      // Show success message using SweetAlert2
      Swal.fire({
        icon: "info",
        title: "Success",
        iconColor: "green",
        confirmButtonColor: "#791414",
        text: "Staff registration successful",
      });
    } catch (error) {
      console.log("Error creating user or staff", error);

      // Show error message using SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Error",
        confirmButtonColor: "#791414",
        text: "Staff registration failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registerUserPage">
      <SideBar />
      <div className="container">
        <div className="logo-container">
          <img
            src={logoImage}
            alt="Lock"
            style={{ width: "100px", height: "100px" }}
          />
          <Typography component="h1" variant="h5">
            Staff Registration
          </Typography>
        </div>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className="formContainer">
            <label>Name</label>
            <ErrorMessage
              name="name"
              component="span"
              style={{ color: "red" }}
            />
            <Field id="inputRegisterUser" name="name" />

            <label>Contact Number</label>
            <ErrorMessage
              name="contact_no"
              component="span"
              style={{ color: "red" }}
            />
            <Field id="inputRegisterUser" name="contact_no" />

            <label>Designation</label>
            <ErrorMessage
              name="designation"
              component="span"
              style={{ color: "red" }}
            />
            <Select id="designation" name="designation">
              <MenuItem value="">Select Designation</MenuItem>
              <MenuItem
                id="manager"
                value="Manager"
                onClick={handleSelectChange}
              >
                Manager
              </MenuItem>
              <MenuItem id="coach" value="Coach" onClick={handleSelectChange}>
                Coach
              </MenuItem>
              <MenuItem
                id="receptionist"
                value="Receptionist"
                onClick={handleSelectChange}
              >
                Receptionist
              </MenuItem>
              <MenuItem
                id="inventoryManager"
                value="InventoryManager"
                onClick={handleSelectChange}
              >
                Inventory Manager
              </MenuItem>
            </Select>

            {/* Conditionally render Qualification and Assigned Team fields */}
            {showCoachFields && (
              <>
                <label>Qualification</label>
                <Field id="inputRegisterUser" name="qualification" />

                <label>Assigned Team</label>
                <Field id="inputRegisterUser" name="assigned_team" />
              </>
            )}

            <label>Username</label>
            <ErrorMessage
              name="username"
              component="span"
              style={{ color: "red" }}
            />
            <Field id="inputRegisterUser" name="username" />

            <label>Password</label>
            <ErrorMessage
              name="password"
              component="span"
              style={{ color: "red" }}
            />
            <Field id="inputRegisterUser" name="password" />

            <label>Confirm Password</label>
            <ErrorMessage
              name="confirm_password"
              component="span"
              style={{ color: "red" }}
            />
            <Field id="inputRegisterUser" name="confirm_password" />
            <div className="button-container">
              <button type="submit" style={{ width: "50%" }}>
                Register
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default SignUp;
