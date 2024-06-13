import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import SideBar from "./SideBar";
import axios from "axios";
import logoImage from "../assets/logo.png";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import Profile from "../components/profile";
import { subYears } from 'date-fns';

function PlayerRegistration() {  
  const [coaches, setCoaches] = useState([]);

  const initialValues = {
    name: "",
    date_of_birth: "",
    contact_no: "",
    address: "",
    employee_no: "",
    joined_date: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    date_of_birth: Yup.date()
      .required("Date of birth is required")
      .max(subYears(new Date(), 7), "Minimum player age is 7 years old"),
    contact_no: Yup.string()
      .matches(/^\d{10}$/, "Contact number must be exactly 10 digits")
      .required("Contact number is required"),
    address: Yup.string().required("Address is required"),
    employee_no: Yup.string().required("Assigned coach is required"),
    joined_date: Yup.date()
      .required("Joined date is required")
      .when(
        'date_of_birth',
        (date_of_birth, schema) => date_of_birth && schema.min(date_of_birth, 'Joined date must be later than date of birth')
      ),
  });

  const onSubmit = async (data, { setSubmitting }) => {
    try {
      setSubmitting(true);
      const playerData = { ...data, active: true };  // Set active to true
      const response = await axios.post("http://localhost:3001/player", playerData);
      console.log("Player created successfully", response.data);

      // Show success message using SweetAlert2
      Swal.fire({
        icon: "info",
        title: "Success",
        iconColor: 'green',
        confirmButtonColor: '#791414',
        text: "Player registration successful!",
      });

    } catch (error) {
      console.log("Error creating player", error);

      // Show error message using SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Error",
        confirmButtonColor: '#791414',
        text: "Player registration failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get("http://localhost:3001/staff/coaches");
        setCoaches(response.data);
      } catch (error) {
        console.log("Error fetching coaches", error);
      }
    };

    fetchCoaches();
  }, []);

  return (
    <div className="registerUserPage">
      <SideBar />
      <div className="profileBox" >
        <Profile />
      </div>
      <div className="container">
        <div className="logo-container">
          <img
            src={logoImage}
            alt="Lock"
            style={{ width: "100px", height: "100px" }}
          />
          <Typography component="h1" variant="h5">
            Player Registration
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

            <label>Date of Birth</label>
            <ErrorMessage
              name="date_of_birth"
              component="span"
              style={{ color: "red" }}
            />
            <Field type="date" id="inputRegisterUser" name="date_of_birth" />

            <label>Contact Number</label>
            <ErrorMessage
              name="contact_no"
              component="span"
              style={{ color: "red" }}
            />
            <Field id="inputRegisterUser" name="contact_no" />

            <label>Address</label>
            <ErrorMessage
              name="address"
              component="span"
              style={{ color: "red" }}
            />
            <Field id="inputRegisterUser" name="address" />

            <label>Assigned Coach</label>
            <ErrorMessage
              name="employee_no"
              component="span"
              style={{ color: "red" }}
            />
            <Field as="select" id="inputRegisterUser" name="employee_no">
              <option value="" label="Select coach" />
              {coaches.map((coach) => (
                <option key={coach.employee_no} value={coach.employee_no}>
                  {coach.employee_no} - {coach.name}
                </option>
              ))}
            </Field>

            <label>Joined Date</label>
            <ErrorMessage
              name="joined_date"
              component="span"
              style={{ color: "red" }}
            />
            <Field type="date" id="inputRegisterUser" name="joined_date" />

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

export default PlayerRegistration;