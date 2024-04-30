import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import SideBar from "../components/SideBar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";

function SignUp() {

  const [des, setDes] = React.useState('');
  const handleSelectChange = (event) => {
    console.log("ID  "+event.target.id);
    setDes(event.target.id);
  }
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
    username: Yup.string()
      .required("Username is required")
      .max(25, "Username must be less than 26 characters"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(25, "Password must be less than 26 characters"),
    confirm_password: Yup.string().required("Confirm password is required"),
  });

    const onSubmit = (data) => {
      // const userRoleMapping = {
      //   Manager: "admin",
      //   Receptionist: "receptionist",
      //   InventoryManager: "inventory_manager",
      //   Coach: "coach",
      // };

      const userData = {
        "username": data.username,
        "password": data.password,
        "role": des,
        "employee_no": data.employee_no,
      };

      const staffData = {
        "name": data.name,
        "employee_no": data.employee_no,
        "contact_no": data.contact_no,
        "designation": des,
      };

      axios.post("http://localhost:3001/staff",  staffData).then((response) => {
          console.log("staff created");
          return axios.post("http://localhost:3001/user", userData);
        })
        .then((response) => {
          console.log("user created");
        })
        .catch((error) => {
          console.log("Error creating user or staff", error);
        });

    // axios.post("http://localhost:3001/staff", data).then((response) => {
    //   console.log("It worked") ;
    // });
  };

  return (
    <div className="registerUserPage">
      <SideBar />
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Name</label>
          <ErrorMessage name="name" component="span" style={{ color: "red" }} />
          <Field id="inputRegisterUser" name="name" />
          <label>Employee Number</label>
          <ErrorMessage
            name="employee_no"
            component="span"
            style={{ color: "red" }}
          />
          <Field id="inputRegisterUser" name="employee_no" />
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
            <MenuItem value="" >Select Designation</MenuItem>
            <MenuItem id = "manager" value="Manager" onClick={handleSelectChange}>Manager</MenuItem>
            <MenuItem id = "coach" value="Coach" onClick={handleSelectChange}>Coach</MenuItem>
            <MenuItem id = "receptionist" value="Receptionist" onClick={handleSelectChange}>Receptionist</MenuItem>
            <MenuItem id = "inventoryManager" value="InventoryManager" onClick={handleSelectChange}>Inventory Manager</MenuItem>
          </Select>
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
          <button type="clear">Clear</button>
          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
}
export default SignUp;
