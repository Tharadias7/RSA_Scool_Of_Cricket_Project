import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import SideBar from "../../components/SideBar";
import axios from "axios";
import logoImage from "../../assets/logo.png";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import "../../App.css";

function AddEquipment() {
  const initialValues = {
    item: "",
    brand: "",
    totalItems: "",
  };

  const validationSchema = Yup.object().shape({
    item: Yup.string().required("Item is required"),
    brand: Yup.string().required("Brand is required"),
    totalItems: Yup.number()
      .required("Total items is required")
      .min(1, "Total items must be at least 1"),
  });

  const onSubmit = async (data, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);

      const response = await axios.post(
        "http://localhost:3001/equipment",
        data
      );
      console.log("Equipment added successfully", response.data);

      Swal.fire({
        icon: "success",
        title: "Success",
        confirmButtonColor: "#791414",
        text: "Equipment added successfully",
      });

      resetForm();
    } catch (error) {
      console.log("Error adding equipment", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        confirmButtonColor: "#791414",
        text: "Failed to add equipment",
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
            alt="Logo"
            style={{ width: "100px", height: "100px" }}
          />
          <Typography component="h1" variant="h5">
            Add Equipment
          </Typography>
        </div>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className="formContainer">
            <label>Item</label>
            <ErrorMessage name="item" component="span" className="msg" />
            <Field as="select" id="inputRegisterUser" name="item">
              <option value="" label="Select item" />
              <option value="Bat" label="Bat" />
              <option value="Ball" label="Ball" />
              <option value="Gloves" label="Gloves" />
              <option value="Helmet" label="Helmet" />
              <option value="Wicket stumps" label="Wicket stumps" />
              <option value="Bails" label="Bails" />
              <option value="Cricket nets" label="Cricket nets" />
              <option value="Mobile Cages" label="Mobile Cages" />
              <option value="Cricket Bag" label="Cricket Bag" />
              <option value="Grip Tape" label="Grip Tape" />
              <option value="Abdo Guard" label="Abdo Guard" />
              <option value="Cricket Pads" label="Cricket Pads" />
              <option value="Cricket Boots" label="Cricket Boots" />
            </Field>

            <label>Brand</label>
            <ErrorMessage name="brand" component="span" className="msg" />
            <Field id="inputRegisterUser" name="brand" />

            <label>Total Items</label>
            <ErrorMessage name="totalItems" component="span" className="msg" />
            <Field type="number" id="inputRegisterUser" name="totalItems" />

            <div className="button-container">
              <button type="submit" style={{ width: "50%" }}>
                Add Equipment
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default AddEquipment;
