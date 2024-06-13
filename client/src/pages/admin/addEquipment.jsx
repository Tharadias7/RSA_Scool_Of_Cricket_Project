import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import SideBar from "../../components/SideBar";
import axios from "axios";
import logoImage from "../../assets/logo.png";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import "../../App.css";
import Profile from "../../components/profile";

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
      <div className="profileBox" >
        <Profile />
      </div>
      <div className="container">
        <div className="logo-container">
          <img
            src={logoImage}
            alt="Logo"
            style={{ width: "100px", height: "100px" }}
          />
          <Typography component="h1" variant="h5">
            Add Equipment to Stock
          </Typography>
        </div>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ setFieldValue }) => (
            <Form className="formContainer">
              <label>Item</label>
              <ErrorMessage name="item" component="span" className="msg" />
              <Autocomplete
                freeSolo
                options={[
                  "Size 1 Bat",
                  "Size 2 Bat",
                  "Size 3 Bat",
                  "Junior Ball",
                  "Senior Ball",
                  "Soft Ball",
                  "Gloves",
                  "Helmet",
                  "Wicket stumps",
                  "Bails",
                  "Cricket nets",
                  "Mobile Cages",
                  "Cricket Bag",
                  "Grip Tape",
                  "Abdo Guard",
                  "Cricket Pads",
                  "Cricket Boots",
                ]}
                onChange={(event, value) => setFieldValue("item", value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="item"
                    onChange={(e) => setFieldValue("item", e.target.value)}
                  />
                )}
              />

              <label>Brand</label>
              <ErrorMessage name="brand" component="span" className="msg" />
              <Autocomplete
                freeSolo
                options={[
                  "Adidas",
                  "Nike",
                  "Puma",
                  "Reebok",
                  "GM",
                  "SS",
                  "SG",
                  "Gray-Nicolls",
                  "Kookaburra",
                  "New Balance",
                ]}
                onChange={(event, value) => setFieldValue("brand", value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="brand"
                    onChange={(e) => setFieldValue("brand", e.target.value)}
                  />
                )}
              />

              <label>Total Items</label>
              <ErrorMessage name="totalItems" component="span" className="msg" />
              <Field type="number" id="inputRegisterUser" name="totalItems" />

              <div className="button-container">
                <button type="submit" style={{ width: "50%" }}>
                  Add Equipment
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AddEquipment;
